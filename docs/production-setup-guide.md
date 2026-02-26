# AUSTA Healthcare SuperApp — Production Setup Guide

AWS region: sa-east-1 (LGPD compliance). All infrastructure is managed via Terraform
(`infrastructure/terraform/`). Kubernetes manifests live under `infrastructure/kubernetes/`.
Docker Compose files for local and staging use are under `src/backend/`.

---

## 1. Infrastructure Overview

### 1.1 Architecture Diagram

```
Internet
   |
   v
[ALB / CloudFront]
   |
[ingress namespace — NGINX Ingress Controller]
   |
[shared-services namespace]
   +-- api-gateway :3000  (routes all /api/* traffic)
   +-- auth-service :3001
   +-- notification-service :3006
   |
   +-- [health-journey namespace]  health-service :3002
   +-- [care-journey namespace]    care-service   :3003
   +-- [plan-journey namespace]    plan-service   :3004
   +-- [gamification namespace]    gamification-engine :3005
   |
   +-- [Data layer — private subnets]
       +-- RDS PostgreSQL 16  (db.m5.large, single instance, per-service schemas)
       +-- ElastiCache Redis 7 (cache.m5.large, 3 nodes)
       +-- Confluent Kafka 7.5.0 (3 brokers + Zookeeper)
   |
   +-- [monitoring namespace]
       +-- Prometheus :9090
       +-- Grafana    :3100
       +-- Sentry     (managed via infrastructure/monitoring/sentry.yml)
```

### 1.2 Service Inventory

| Service | Port | K8s Namespace | External Dependencies |
|---------|------|---------------|-----------------------|
| api-gateway | 3000 | shared-services | Redis, all downstream services |
| auth-service | 3001 | shared-services | PostgreSQL (auth schema), Redis |
| health-service | 3002 | health-journey | PostgreSQL (health schema), Redis, Kafka |
| care-service | 3003 | care-journey | PostgreSQL (care schema), Redis, Kafka |
| plan-service | 3004 | plan-journey | PostgreSQL (plan schema), Redis, Kafka |
| gamification-engine | 3005 | gamification | PostgreSQL (gamification schema), Redis, Kafka |
| notification-service | 3006 | shared-services | PostgreSQL (notification schema), Redis, Kafka |

Each service has its own Dockerfile under `src/backend/<service-name>/Dockerfile`, built with a
two-stage pattern (node:22-alpine builder → node:22-alpine runtime, non-root USER node,
`HEALTHCHECK` via `wget` on `/health`).

---

## 2. AWS Infrastructure

### 2.1 EKS Cluster Configuration

Cluster name: `austa-production-cluster` (staging: `austa-staging-cluster`), region `sa-east-1`.

Namespace manifests are in `infrastructure/kubernetes/namespaces.yaml`. Apply once per cluster:

```bash
kubectl apply -f infrastructure/kubernetes/namespaces.yaml
```

Resource quotas (from `infrastructure/kubernetes/namespaces.yaml`):

| Namespace | Max Pods | CPU req/limit | Mem req/limit | Container default (req/limit) |
|-----------|----------|---------------|---------------|-------------------------------|
| shared-services | — | — | — | 250m/500m, 256Mi/512Mi |
| health-journey | 50 | 10/20 | 20/40 Gi | 250m/500m, 256Mi/512Mi |
| care-journey | 60 | 15/30 | 30/60 Gi | 250m/500m, 256Mi/512Mi |
| plan-journey | 40 | 8/16 | 16/32 Gi | 250m/500m, 256Mi/512Mi |
| gamification | 50 | 12/24 | 24/48 Gi | 500m/1000m, 512Mi/1Gi |
| monitoring | — | — | — | — |

### 2.2 RDS PostgreSQL

- Engine: PostgreSQL 16
- Instance class: `db.m5.large` (defined in `infrastructure/terraform/variables.tf`)
- Database name: `austa` (single instance, per-service schemas)
- Schemas: `auth`, `health`, `care`, `plan`, `gamification`, `notification`
- Location: private subnets (10.0.11-13.0/24)
- Terraform variable: `database_instance_class` (default `db.m5.large`)

Connection string pattern (per service):

```
postgresql://<DB_USER>:<DB_PASSWORD>@<RDS_ENDPOINT>:5432/austa?schema=<service-name>
```

### 2.3 ElastiCache Redis

- Engine: Redis 7
- Node type: `cache.m5.large` (Terraform variable: `redis_node_type`)
- Cluster nodes: 3 (Terraform variable: `redis_num_cache_nodes`)
- Location: private subnets

All services connect via `REDIS_HOST` and `REDIS_PORT` environment variables.

### 2.4 S3 + CloudFront

- S3 bucket: static assets, mobile app OTA bundles (EAS Update)
- CloudFront: CDN in front of ALB and S3
- ACM certificate ARN configured via Terraform variable `certificate_arn`

### 2.5 VPC and Networking

Defined in `infrastructure/terraform/variables.tf`:

| CIDR block | Purpose |
|------------|---------|
| 10.0.0.0/16 | VPC |
| 10.0.1-3.0/24 | Public subnets (ALB, NAT Gateway) |
| 10.0.11-13.0/24 | Private subnets (EKS nodes, RDS, ElastiCache, Kafka) |

---

## 3. Secrets Management

### 3.1 AWS Secrets Manager

Secrets are stored in AWS Secrets Manager and injected into pods via the External Secrets
Operator (configured in `infrastructure/monitoring/sentry.yml` for the Sentry DSN).
Secret naming convention: `austa/<environment>/<secret-name>`.

> Note: There is a naming inconsistency between environments. Staging CI uses
> `AWS_ACCESS_KEY` while production CI uses `AWS_ACCESS_KEY_ID`. Align these when
> rotating credentials.

### 3.2 Environment Variables per Service

Variables are derived from `src/backend/docker-compose.yml` (local) and
`src/backend/docker-compose.staging.yml` (staging). No `.env.example` files exist in the
repository; the staging `.env.staging` file must be created manually on first deploy.

**Common to all services:**

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` or `staging` |
| `PORT` | Service port (3000–3006) |
| `DATABASE_URL` | `postgresql://<USER>:<PASS>@<HOST>:5432/austa?schema=<name>` |
| `REDIS_HOST` | ElastiCache primary endpoint |
| `REDIS_PORT` | `6379` |

**api-gateway only:**

| Variable | Description |
|----------|-------------|
| `AUTH_SERVICE_URL` | Internal URL for auth-service |
| `HEALTH_SERVICE_URL` | Internal URL for health-service |
| `CARE_SERVICE_URL` | Internal URL for care-service |
| `PLAN_SERVICE_URL` | Internal URL for plan-service |
| `GAMIFICATION_ENGINE_URL` | Internal URL for gamification-engine |
| `NOTIFICATION_SERVICE_URL` | Internal URL for notification-service |
| `JWT_SECRET` | Shared JWT signing secret |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins |

**Services with Kafka (health, care, plan, gamification, notification):**

| Variable | Description |
|----------|-------------|
| `KAFKA_BROKERS` | Comma-separated broker list, e.g. `broker1:9092,broker2:9092,broker3:9092` |

**Monitoring:**

| Variable | Description |
|----------|-------------|
| `SENTRY_DSN` | `<YOUR_SENTRY_DSN>` |
| `DATADOG_API_KEY` | `<YOUR_DATADOG_API_KEY>` (optional) |

### 3.3 GitHub Actions Secrets

Configure these in the repository's Settings > Secrets and variables > Actions:

| Secret | Used by | Description |
|--------|---------|-------------|
| `AWS_ACCESS_KEY_ID` | deploy-production.yml | IAM key for ECR/EKS access |
| `AWS_SECRET_ACCESS_KEY` | deploy-production.yml | IAM secret |
| `AWS_ACCESS_KEY` | deploy-staging.yml | IAM key (staging — note naming difference) |
| `AWS_SECRET_KEY` | deploy-staging.yml | IAM secret (staging) |
| `SENTRY_AUTH_TOKEN` | deploy-production.yml | Sentry release creation |
| `SENTRY_ORG` | deploy-production.yml | Sentry organisation slug |
| `CODECOV_TOKEN` | backend-ci.yml, frontend-ci.yml | Coverage upload |
| `EXPO_TOKEN` | eas-build.yml | EAS build authentication |
| `APPLE_ID` | eas-build.yml | Apple account for App Store submission |
| `ASC_APP_ID` | eas-build.yml | App Store Connect app identifier |
| `APPLE_TEAM_ID` | eas-build.yml | Apple Developer Team ID |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | eas-build.yml | Play Store service account JSON |
| `GITHUB_TOKEN` | all workflows | Auto-provided by GitHub Actions |

---

## 4. Monitoring and Observability

### 4.1 Sentry Error Tracking

Integration is in `src/backend/shared/src/exceptions/exceptions.filter.ts`.
`captureException` is only called when `NODE_ENV === 'production'`.
Kubernetes configuration: `infrastructure/monitoring/sentry.yml` (ConfigMap + ExternalSecrets).

Sentry SDK settings applied in production:
- `tracesSampleRate`: 0.10 (10%)
- `profilesSampleRate`: 0.10 (10%)
- DSN sourced from AWS Secrets Manager via External Secrets Operator

PHI access is tracked via `src/backend/shared/src/audit/phi-access.decorator.ts` and
`src/backend/shared/src/audit/audit.interceptor.ts` — these logs must not be sent to Sentry.

### 4.2 Prometheus Metrics

Configuration: `src/backend/prometheus.yml`.
Global scrape interval: 15s. Per-service scrape interval: 10s.

| Scrape target | Endpoint |
|---------------|----------|
| api-gateway | `api-gateway:3000/metrics` |
| auth-service | `auth-service:3001/metrics` |
| health-service | `health-service:3002/metrics` |
| care-service | `care-service:3003/metrics` |
| plan-service | `plan-service:3004/metrics` |
| gamification-engine | `gamification-engine:3005/metrics` |
| notification-service | `notification-service:3006/metrics` |
| postgres-exporter | `postgres-exporter:9187` |
| redis-exporter | `redis-exporter:9121` |
| node-exporter | `node-exporter:9100` |

> Prerequisite: NestJS Prometheus instrumentation (`@willsoto/nestjs-prometheus` or equivalent)
> must be enabled in each service module for `/metrics` to return data.

### 4.3 Grafana Dashboards

- Port: 3100 (monitoring namespace)
- Default admin credentials must be changed on first login
- Dashboard source: Prometheus data source pointed at `prometheus:9090`

---

## 5. CI/CD Pipeline

### 5.1 Backend CI

Workflow: `.github/workflows/backend-ci.yml`

Steps: Node 20 → yarn install (frozen lockfile) → lint → test with coverage → Codecov upload
(flag: `backend`).

### 5.2 Frontend CI

Workflow: `.github/workflows/frontend-ci.yml`

Steps: lint → typecheck → test with coverage (flag: `frontend`) → Maestro E2E on macOS runner.

### 5.3 Staging Deployment

Workflow: `.github/workflows/deploy-staging.yml`

Trigger: push to `staging` branch.

Steps:
1. `validate-deps` — dependency audit (fails fast; no `|| true` suppression)
2. `audit` — security audit
3. Build Docker images and push to `ghcr.io/<org>/<service>:staging`
4. Deploy to EKS cluster `austa-staging-cluster` (sa-east-1)

Local staging stack: `src/backend/docker-compose.staging.yml`
Scale testing: `src/backend/docker-compose.scale.yml`

> The `.env.staging` file is not committed to the repository. It must be created on the
> deployment host or injected via CI secrets before the staging deploy step runs.

### 5.4 Production Deployment (Canary)

Workflow: `.github/workflows/deploy-production.yml`

Trigger: push of a tag matching `v*.*.*`.

Steps:
1. Validate dependencies
2. Run full test suite
3. Build and push Docker images (matrix over all 7 services) to `ghcr.io`
4. Deploy canary (1 replica per service) to `austa-production-cluster`
5. Smoke-test all 7 `/health` endpoints (see Section 7.1)
6. Promote canary to full rollout
7. Create Sentry release (`SENTRY_AUTH_TOKEN`, `SENTRY_ORG`)
8. On any failure: automatic rollback (see Section 7.2)

Manual rollback is also available via workflow dispatch.

### 5.5 Mobile Builds (EAS)

Workflow: `.github/workflows/eas-build.yml`
EAS configuration: `src/web/mobile/eas.json` (3 profiles: `development`, `preview`, `production`)

| Trigger | Profile | Action |
|---------|---------|--------|
| Pull request | `preview` | EAS build only |
| Tag `v*.*.*` | `production` | EAS build + submit to App Store + Play Store |

Additional workflow for OTA updates: `.github/workflows/eas-update.yml`

---

## 6. Database Operations

### 6.1 Prisma Migrate Deploy

Each service runs its own migrations scoped to its schema. The `DATABASE_URL` must include
`?schema=<service-name>` for schema isolation.

```bash
# Run from the service directory (e.g., src/backend/auth-service)
DATABASE_URL="postgresql://<USER>:<PASS>@<HOST>:5432/austa?schema=auth" \
  npx prisma migrate deploy
```

In Kubernetes, migrations run as an init container or a pre-deploy Job before the service pod
starts. Never run `prisma migrate dev` in production — use `prisma migrate deploy` only.

### 6.2 Backup and Restore

RDS automated backups should be enabled (7-day retention minimum, LGPD requires audit trail).

```bash
# Manual snapshot via AWS CLI
aws rds create-db-snapshot \
  --db-instance-identifier austa-production-postgres \
  --db-snapshot-identifier austa-snapshot-$(date +%Y%m%d) \
  --region sa-east-1

# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier austa-production-postgres-restore \
  --db-snapshot-identifier <SNAPSHOT_ID> \
  --region sa-east-1
```

Encryption at rest is enforced via `src/backend/shared/src/encryption/encryption.service.ts`
and `src/backend/shared/src/encryption/prisma-encryption.middleware.ts` for PHI fields.

### 6.3 Schema-per-Service Strategy

All services share a single RDS instance (`austa` database) but each owns a PostgreSQL schema:

| Service | Schema |
|---------|--------|
| auth-service | `auth` |
| health-service | `health` |
| care-service | `care` |
| plan-service | `plan` |
| gamification-engine | `gamification` |
| notification-service | `notification` |

Cross-schema queries are not permitted. Services communicate only through Kafka events or
HTTP via the api-gateway. The 29 Prisma models and 9 enums are distributed across these schemas
with 42 indexes total (0 TypeORM — migration to Prisma is complete).

---

## 7. Incident Response Runbooks

### 7.1 Service Health Check Endpoints

All health checks are available through the api-gateway and directly per service:

| Check | Endpoint |
|-------|----------|
| Gateway | `GET http://<GATEWAY_HOST>:3000/health` |
| Auth (via gateway) | `GET http://<GATEWAY_HOST>:3000/api/auth/health` |
| Health (via gateway) | `GET http://<GATEWAY_HOST>:3000/api/health/health` |
| Care (via gateway) | `GET http://<GATEWAY_HOST>:3000/api/care/health` |
| Plan (via gateway) | `GET http://<GATEWAY_HOST>:3000/api/plan/health` |
| Gamification (via gateway) | `GET http://<GATEWAY_HOST>:3000/api/gamification/health` |
| Notifications (via gateway) | `GET http://<GATEWAY_HOST>:3000/api/notifications/health` |

Direct service checks (within cluster):

```bash
# Example: check all 7 services directly
for port in 3000 3001 3002 3003 3004 3005 3006; do
  echo -n "Port $port: "
  kubectl exec -n shared-services deploy/api-gateway -- \
    wget -qO- http://localhost:$port/health 2>/dev/null || echo "UNREACHABLE"
done
```

Metrics endpoints follow the same host/port pattern at `/metrics` (see Section 4.2).

### 7.2 Rollback Procedures

**Automatic rollback** is triggered by the production workflow (`deploy-production.yml`) when
the smoke-test step fails. It redeploys the previous image tag.

**Manual rollback** via workflow dispatch on `.github/workflows/deploy-production.yml` with
`rollback: true` input and a target tag.

**Kubernetes rollback** (emergency, in-cluster):

```bash
# Roll back a specific deployment to the previous revision
kubectl rollout undo deployment/<service-name> -n <namespace>

# Roll back to a specific revision
kubectl rollout undo deployment/<service-name> -n <namespace> --to-revision=<N>

# Check rollout status
kubectl rollout status deployment/<service-name> -n <namespace>

# View rollout history
kubectl rollout history deployment/<service-name> -n <namespace>
```

**Database rollback**: Prisma does not auto-rollback migrations. To reverse a bad migration:
1. Apply a new migration that reverts the schema change.
2. Never drop production data without a verified backup snapshot.

### 7.3 Scaling Procedures

**Horizontal scaling** (add replicas):

```bash
kubectl scale deployment/<service-name> --replicas=<N> -n <namespace>
```

Namespace resource quotas (from `infrastructure/kubernetes/namespaces.yaml`) cap total pods
and CPU/memory. Verify quota headroom before scaling:

```bash
kubectl describe resourcequota -n <namespace>
```

**Vertical scaling** (increase container limits): update the Kubernetes Deployment manifest
and apply. The gamification namespace has elevated defaults (500m/1000m CPU, 512Mi/1Gi mem)
because the gamification-engine is the most compute-intensive service.

**Infrastructure scaling** (RDS/ElastiCache): update Terraform variables in
`infrastructure/terraform/variables.tf` (`database_instance_class`, `redis_node_type`,
`redis_num_cache_nodes`) and apply:

```bash
cd infrastructure/terraform
terraform plan -var-file=environments/production.tfvars
terraform apply -var-file=environments/production.tfvars
```

**Kafka scaling**: increase `kafka_brokers` variable in `infrastructure/terraform/variables.tf`.
Confluent 7.5.0 supports online broker addition; coordinate with Confluent support for
production partition rebalancing.

---

## Appendix: ADRs

Architecture Decision Records are in `docs/adr/` (ADR-001 through ADR-005). Consult them
before making changes to service boundaries, database strategy, authentication flows,
deployment topology, or module design rules.

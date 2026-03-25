# Deployment Runbook

## 1. Pre-Deployment Checklist

| Item | Check | Notes |
|------|-------|-------|
| GitHub Secrets configured | [ ] | `GHCR_TOKEN`, `KUBE_CONFIG_PRODUCTION`, `KUBE_CONFIG_STAGING`, `SENTRY_AUTH_TOKEN` |
| Database migrations tested locally | [ ] | Run `npx prisma migrate dev` per service |
| All tests passing on main | [ ] | CI must be green before tagging |
| Docker images build locally | [ ] | `docker compose -f infrastructure/docker/docker-compose.dev.yml build` |
| Changelog updated | [ ] | Document breaking changes |
| Feature flags configured | [ ] | Verify toggles for new features |
| Rollback plan documented | [ ] | See [rollback.md](./rollback.md) |

## 2. Staging Deployment

Staging deploys automatically when code is pushed to the `staging` branch.

```bash
# Option A: Push to staging branch
git checkout staging
git merge main
git push origin staging

# Option B: Manual trigger
gh workflow run "Deploy to Staging" --ref staging
```

Pipeline stages: `validate-dependencies` -> `audit` -> `build-and-push` -> `deploy`

Monitor deployment progress:

```bash
# Watch all deployments across namespaces
kubectl --context austa-staging-cluster rollout status deployment/api-gateway -n shared-services
kubectl --context austa-staging-cluster rollout status deployment/auth-service -n shared-services
kubectl --context austa-staging-cluster rollout status deployment/health-service -n health-journey
kubectl --context austa-staging-cluster rollout status deployment/care-service -n care-journey
kubectl --context austa-staging-cluster rollout status deployment/plan-service -n plan-journey
kubectl --context austa-staging-cluster rollout status deployment/gamification-engine -n gamification
kubectl --context austa-staging-cluster rollout status deployment/notification-service -n shared-services
```

## 3. Production Deployment (Canary Pattern)

Production deploys are triggered by pushing a semantic version tag.

```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0

# Or manual trigger with optional rollback
gh workflow run "Deploy Production" -f rollback=false -f target_tag=v1.0.0
```

Pipeline stages: `validate` -> `test` -> `build-and-push` -> `deploy-canary` -> `smoke-test` -> `promote` -> (rollback on failure)

The canary phase:
1. Deploys 1 replica per service with the new image
2. Runs smoke tests against all 7 `/health` endpoints
3. If smoke tests pass, promotes to full deployment
4. If smoke tests fail, triggers automatic rollback

## 4. Post-Deployment Verification

### Health Endpoints

| Service | Namespace | Health URL (Production) |
|---------|-----------|------------------------|
| api-gateway | shared-services | `https://api.austa.health/health` |
| auth-service | shared-services | `https://api.austa.health/auth/health` |
| health-service | health-journey | `https://api.austa.health/health-svc/health` |
| care-service | care-journey | `https://api.austa.health/care/health` |
| plan-service | plan-journey | `https://api.austa.health/plan/health` |
| gamification-engine | gamification | `https://api.austa.health/gamification/health` |
| notification-service | shared-services | `https://api.austa.health/notifications/health` |

```bash
# Quick health check all services via kubectl
for svc in api-gateway auth-service health-service care-service plan-service gamification-engine notification-service; do
  echo "--- $svc ---"
  kubectl --context austa-production-cluster exec deploy/$svc -- curl -s localhost:4000/health
done
```

### Post-Deploy Checks

- **Sentry**: Check for new errors at `https://sentry.io` (release is auto-created on promote)
- **Grafana**: Review dashboards for error rate spikes and latency changes
- **Logs**: `kubectl logs deployment/<service> -n <namespace> --since=10m --tail=100`

## 5. Service Ports Reference

| Service | Dev Port | Staging/Prod Port | K8s Namespace |
|---------|----------|-------------------|---------------|
| api-gateway | 3000 | 4000 | shared-services |
| auth-service | 3001 | 3001 | shared-services |
| health-service | 3002 | 3002 | health-journey |
| care-service | 3003 | 3003 | care-journey |
| plan-service | 3004 | 3004 | plan-journey |
| gamification-engine | 3005 | 3005 | gamification |
| notification-service | 3006 | 3006 | shared-services |

**EKS Clusters:**
- Production: `austa-production-cluster` (sa-east-1)
- Staging: `austa-staging-cluster` (sa-east-1)

**Container Registry:** `ghcr.io`

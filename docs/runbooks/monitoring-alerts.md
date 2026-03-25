# Monitoring and Alerts Runbook

## 1. Monitoring Stack

| Tool | Purpose | Access |
|------|---------|--------|
| Prometheus | Metrics collection and alerting | Port 9090 (scale compose) |
| Grafana | Dashboards and visualization | Port 3100 (scale compose) |
| Sentry | Error tracking and release health | `https://sentry.io` (DSN per service) |
| Datadog | APM and distributed tracing | Configured for health-service |

Infrastructure compose files:
- Scale testing: `infrastructure/docker/docker-compose.scale.yml` (includes Prometheus + Grafana)
- Production: `infrastructure/docker/docker-compose.production.yml`

## 2. Health Endpoints

| Service | Namespace | Endpoint | Expected Response |
|---------|-----------|----------|-------------------|
| api-gateway | shared-services | `/health` | `200 OK` |
| auth-service | shared-services | `/health` | `200 OK` |
| health-service | health-journey | `/health` | `200 OK` |
| care-service | care-journey | `/health` | `200 OK` |
| plan-service | plan-journey | `/health` | `200 OK` |
| gamification-engine | gamification | `/health` | `200 OK` |
| notification-service | shared-services | `/health` | `200 OK` |

```bash
# Automated health check script
SERVICES=("api-gateway:shared-services" "auth-service:shared-services" "health-service:health-journey" \
  "care-service:care-journey" "plan-service:plan-journey" "gamification-engine:gamification" \
  "notification-service:shared-services")

for entry in "${SERVICES[@]}"; do
  svc="${entry%%:*}"
  ns="${entry##*:}"
  STATUS=$(kubectl --context austa-production-cluster exec deploy/$svc -n $ns -- \
    curl -sf -o /dev/null -w "%{http_code}" localhost:4000/health 2>/dev/null)
  echo "$svc ($ns): $STATUS"
done
```

## 3. Key Metrics to Monitor

| Metric | Warning Threshold | Critical Threshold | Alert Action |
|--------|-------------------|-------------------|--------------|
| HTTP error rate (5xx) | > 0.5% | > 1% | P2: Check service logs, recent deploys |
| Request latency (p99) | > 1s | > 2s | Investigate slow queries, cache misses |
| Pod restarts | > 2 in 10min | > 3 in 10min | P2: Check OOM, health probes, env vars |
| CPU usage per pod | > 70% | > 85% | Scale HPA, review resource limits |
| Memory usage per pod | > 75% | > 90% | Check for memory leaks, adjust limits |
| Disk usage | > 70% | > 80% | Expand PV, clean logs/temp files |
| PostgreSQL active connections | > 150/200 | > 180/200 | Review connection pooling, kill idle |
| PostgreSQL replication lag | > 1s | > 5s | Check replica health, network |
| Redis memory usage | > 75% (384MB) | > 90% (460MB) | Review eviction policy (allkeys-lru) |
| Redis connected clients | > 100 | > 150 | Check for connection leaks |
| Kafka consumer lag | > 500 | > 1000 | Scale consumer group, check processing |
| Kafka broker disk | > 70% | > 85% | Increase retention cleanup, expand disk |

**Redis production config:** `maxmemory 512mb`, eviction policy `allkeys-lru`, `requirepass` enabled

## 4. Sentry Error Triage

### Priority Actions

| Error Status | Action |
|-------------|--------|
| New error (first seen) | Investigate immediately, correlate with recent deploy |
| Regressed error (previously resolved) | Check recent deployments that may have reintroduced it |
| Escalating frequency | P2 alert, investigate root cause |
| Stable low-frequency | Schedule fix in next sprint |

### Triage Steps

```bash
# Check Sentry via CLI (if sentry-cli is installed)
sentry-cli releases list -o austa -p backend

# View recent issues
sentry-cli issues list -o austa -p backend --query "is:unresolved"
```

1. Group errors by service (each service has its own Sentry project/DSN)
2. Check stack traces for common patterns (null refs, timeout, auth)
3. Correlate timestamps with recent deployments
4. Assign to owning team based on service namespace

### Release Tracking

Sentry releases are auto-created during the production promote step in `deploy-production.yml`. Each release is tagged with the git tag version.

## 5. Grafana Dashboard Setup

### Available Dashboards

| Dashboard | Purpose | Data Source |
|-----------|---------|-------------|
| Service Health Overview | Pod status, restarts, error rates | Prometheus |
| Database Metrics | Connections, query latency, replication | Prometheus / CloudWatch |
| Redis Metrics | Memory, hit rate, connected clients | Prometheus |
| Kafka Metrics | Consumer lag, throughput, broker health | Prometheus |
| API Gateway | Request rate, latency percentiles, status codes | Prometheus |

### Setup from Scratch

```bash
# Grafana is available in the scale compose stack
docker compose -f infrastructure/docker/docker-compose.scale.yml up -d prometheus grafana

# Access Grafana at http://localhost:3100
# Default credentials: admin/admin (change on first login)

# Add Prometheus data source:
# URL: http://prometheus:9090

# Import dashboards from infrastructure/monitoring/ (if available)
# Or use Grafana dashboard IDs:
# - Node Exporter: 1860
# - Kubernetes Cluster: 7249
# - PostgreSQL: 9628
# - Redis: 11835
```

### Key Panels to Configure

1. **Error Rate**: `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))`
2. **Latency p99**: `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))`
3. **Pod Restarts**: `sum(kube_pod_container_status_restarts_total) by (pod)`
4. **PG Connections**: `pg_stat_activity_count` grouped by state

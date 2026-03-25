# Rollback Runbook

## 1. Automatic Rollback

Automatic rollback is triggered when smoke tests fail during the `deploy-production.yml` pipeline.

**What happens:**
1. Canary deployment runs smoke tests against all 7 service `/health` endpoints
2. If any smoke test fails, the `rollback` job executes
3. All 7 services are rolled back to their previous K8s revision via `kubectl rollout undo`
4. A Sentry release is not created (promote step is skipped)

**No action required** -- monitor the GitHub Actions run to confirm rollback succeeded.

## 2. Manual Rollback -- Previous Revision

Roll back all services to their previous K8s deployment revision:

```bash
# Roll back all services (production cluster)
kubectl --context austa-production-cluster rollout undo deployment/api-gateway -n shared-services
kubectl --context austa-production-cluster rollout undo deployment/auth-service -n shared-services
kubectl --context austa-production-cluster rollout undo deployment/health-service -n health-journey
kubectl --context austa-production-cluster rollout undo deployment/care-service -n care-journey
kubectl --context austa-production-cluster rollout undo deployment/plan-service -n plan-journey
kubectl --context austa-production-cluster rollout undo deployment/gamification-engine -n gamification
kubectl --context austa-production-cluster rollout undo deployment/notification-service -n shared-services
```

To roll back to a specific revision number:

```bash
# Check revision history first
kubectl --context austa-production-cluster rollout history deployment/<service> -n <namespace>

# Roll back to a specific revision
kubectl --context austa-production-cluster rollout undo deployment/<service> -n <namespace> --to-revision=<N>
```

## 3. Manual Rollback -- Specific Tag

Use the CI workflow to redeploy a known-good tag:

```bash
gh workflow run "Deploy Production" -f rollback=true -f target_tag=v1.0.0
```

Or set images directly via kubectl:

```bash
TAG="v1.0.0"
kubectl --context austa-production-cluster set image deployment/api-gateway api-gateway=ghcr.io/austa/api-gateway:${TAG} -n shared-services
kubectl --context austa-production-cluster set image deployment/auth-service auth-service=ghcr.io/austa/auth-service:${TAG} -n shared-services
kubectl --context austa-production-cluster set image deployment/health-service health-service=ghcr.io/austa/health-service:${TAG} -n health-journey
kubectl --context austa-production-cluster set image deployment/care-service care-service=ghcr.io/austa/care-service:${TAG} -n care-journey
kubectl --context austa-production-cluster set image deployment/plan-service plan-service=ghcr.io/austa/plan-service:${TAG} -n plan-journey
kubectl --context austa-production-cluster set image deployment/gamification-engine gamification-engine=ghcr.io/austa/gamification-engine:${TAG} -n gamification
kubectl --context austa-production-cluster set image deployment/notification-service notification-service=ghcr.io/austa/notification-service:${TAG} -n shared-services
```

## 4. Database Rollback

If a migration must be reverted:

```bash
# Mark a migration as rolled back (per service)
cd src/backend/<service>
npx prisma migrate resolve --rolled-back <migration_name>
```

| Service | Schema Path | DB Schema |
|---------|-------------|-----------|
| auth-service | `src/backend/auth-service/prisma/schema.prisma` | auth |
| health-service | `src/backend/health-service/prisma/schema.prisma` | health |
| care-service | `src/backend/care-service/prisma/schema.prisma` | care |
| plan-service | `src/backend/plan-service/prisma/schema.prisma` | plan |
| gamification-engine | `src/backend/gamification-engine/prisma/schema.prisma` | gamification |
| notification-service | `src/backend/notification-service/prisma/schema.prisma` | notification |

For destructive migrations that cannot be auto-reversed, apply a manual SQL rollback:

```bash
# Connect to production database and run rollback SQL
kubectl --context austa-production-cluster exec -it deploy/auth-service -n shared-services -- \
  psql "$DATABASE_URL" -f /path/to/rollback.sql
```

## 5. Verification After Rollback

```bash
# Confirm all rollouts completed
for ns in shared-services health-journey care-journey plan-journey gamification; do
  echo "=== $ns ==="
  kubectl --context austa-production-cluster get pods -n $ns
done

# Verify health endpoints respond
for svc in api-gateway auth-service health-service care-service plan-service gamification-engine notification-service; do
  echo "--- $svc ---"
  kubectl --context austa-production-cluster exec deploy/$svc -- curl -sf localhost:4000/health && echo " OK" || echo " FAIL"
done

# Check rollout status
kubectl --context austa-production-cluster rollout status deployment/api-gateway -n shared-services
kubectl --context austa-production-cluster rollout status deployment/auth-service -n shared-services
kubectl --context austa-production-cluster rollout status deployment/health-service -n health-journey
kubectl --context austa-production-cluster rollout status deployment/care-service -n care-journey
kubectl --context austa-production-cluster rollout status deployment/plan-service -n plan-journey
kubectl --context austa-production-cluster rollout status deployment/gamification-engine -n gamification
kubectl --context austa-production-cluster rollout status deployment/notification-service -n shared-services
```

- **Sentry**: Confirm no new errors after rollback
- **Grafana**: Confirm error rate returned to baseline
- **Notify team**: Post rollback status in incident channel

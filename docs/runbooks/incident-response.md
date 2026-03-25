# Incident Response Runbook

## 1. Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| P1 | System down, all users affected | 15 minutes | API gateway unreachable, database down |
| P2 | Major feature broken, subset of users affected | 1 hour | Auth failures, payment processing down |
| P3 | Minor feature broken, workaround exists | 4 hours | Gamification points not updating, notification delays |
| P4 | Cosmetic or minor issue | Next sprint | UI alignment, non-critical log warnings |

## 2. Initial Triage Steps

### Step 1: Check service health endpoints

```bash
# Quick status of all pods across all namespaces
kubectl --context austa-production-cluster get pods -A | grep -E 'shared-services|health-journey|care-journey|plan-journey|gamification'

# Check individual service health
for svc in api-gateway auth-service health-service care-service plan-service gamification-engine notification-service; do
  echo "--- $svc ---"
  kubectl --context austa-production-cluster exec deploy/$svc -- curl -sf localhost:4000/health && echo " OK" || echo " FAIL"
done
```

### Step 2: Check recent deployments

```bash
# Recent rollout history per service
kubectl --context austa-production-cluster rollout history deployment/api-gateway -n shared-services
kubectl --context austa-production-cluster rollout history deployment/auth-service -n shared-services
kubectl --context austa-production-cluster rollout history deployment/health-service -n health-journey
```

### Step 3: Check logs

```bash
# Tail recent logs for a specific service
kubectl --context austa-production-cluster logs deployment/api-gateway -n shared-services --since=15m --tail=200

# Check for OOMKilled or CrashLoopBackOff
kubectl --context austa-production-cluster get pods -A | grep -E 'Error|CrashLoop|OOMKilled|Pending'

# Describe a failing pod for events
kubectl --context austa-production-cluster describe pod <pod-name> -n <namespace>
```

### Step 4: Check infrastructure dependencies

```bash
# PostgreSQL connectivity (from any service pod)
kubectl --context austa-production-cluster exec deploy/auth-service -n shared-services -- \
  pg_isready -h $DB_HOST -p 5432

# Redis connectivity
kubectl --context austa-production-cluster exec deploy/auth-service -n shared-services -- \
  redis-cli -h $REDIS_HOST ping

# Kafka broker status (from a service pod with kafka tools)
kubectl --context austa-production-cluster exec deploy/notification-service -n shared-services -- \
  kafka-broker-api-versions --bootstrap-server $KAFKA_BROKERS 2>&1 | head -5
```

## 3. Common Failure Modes

| Symptom | Likely Cause | Immediate Action |
|---------|-------------|------------------|
| All services unreachable | API gateway down or ingress misconfigured | Check api-gateway pods in shared-services; restart if CrashLoop |
| 401/403 on all requests | JWT secret mismatch or Redis session store down | Check auth-service logs; verify Redis connectivity |
| Event processing stalled | Kafka or Zookeeper down | Check Kafka broker health; restart Zookeeper if needed |
| Database connection timeouts | PostgreSQL connections exhausted (max 200) | Check `pg_stat_activity`; kill idle connections; review pooling |
| High latency across services | Redis cache miss storm or service overloaded | Check Redis memory usage; review HPA scaling |
| Pods in CrashLoopBackOff | OOM, missing env vars, or failed health checks | `kubectl describe pod`; check resource limits and env config |
| Notification delays | Kafka consumer lag or notification-service backlog | Check consumer group lag; scale notification-service replicas |
| Gamification not updating | gamification-engine event processing failure | Check gamification namespace pods; review Kafka consumer logs |

## 4. Escalation Contacts

| Role | Name | Contact |
|------|------|---------|
| On-Call Engineer | (rotate weekly) | PagerDuty / Slack #oncall |
| Backend Lead | TBD | Slack #backend |
| Infrastructure Lead | TBD | Slack #infra |
| Security Lead | TBD | Slack #security |
| Product Owner | TBD | Slack #product |

## 5. Communication Templates

### P1 Incident -- Initial Notification

```
INCIDENT: P1 - [Brief description]
STATUS: Investigating
IMPACT: [All users / specific feature] affected
STARTED: [HH:MM UTC]
TEAM: [Names investigating]
NEXT UPDATE: In 15 minutes
CHANNEL: #incident-[date]
```

### P2 Incident -- Initial Notification

```
INCIDENT: P2 - [Brief description]
STATUS: Investigating
IMPACT: [Subset of users / specific journey] affected
STARTED: [HH:MM UTC]
WORKAROUND: [If available]
NEXT UPDATE: In 30 minutes
CHANNEL: #incident-[date]
```

### Resolution Notification

```
INCIDENT: [P1/P2] - [Brief description]
STATUS: Resolved
ROOT CAUSE: [Brief root cause]
RESOLUTION: [What was done]
DURATION: [Start - End, total minutes]
ACTION ITEMS: [Follow-up tasks, postmortem scheduled]
```

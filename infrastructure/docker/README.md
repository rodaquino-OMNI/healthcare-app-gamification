# Docker Compose Files

All Docker Compose configurations for the AUSTA Healthcare SuperApp.

| File | Environment | Usage |
|------|-------------|-------|
| `docker-compose.dev.yml` | Development | Full local stack with build |
| `docker-compose.staging.yml` | Staging | GHCR images, resource-limited |
| `docker-compose.production.yml` | Production | GHCR images, production config |
| `docker-compose.scale.yml` | Scale testing | 3-replica services, monitoring |
| `docker-compose.local.yml` | Local (gamification) | Isolated gamification dev |

## Quick Start

```bash
# Development
docker compose -f infrastructure/docker/docker-compose.dev.yml up -d

# Staging mirror
docker compose -f infrastructure/docker/docker-compose.staging.yml up -d

# Scale testing
docker compose -f infrastructure/docker/docker-compose.scale.yml up -d

# Gamification only
docker compose -f infrastructure/docker/docker-compose.local.yml up -d
```

## Services

| Service | Port | Schema |
|---------|------|--------|
| api-gateway | 3000 (dev) / 4000 (staging/prod) | - |
| auth-service | 3001 | auth |
| health-service | 3002 | health |
| care-service | 3003 | care |
| plan-service | 3004 | plan |
| gamification-engine | 3005 | gamification |
| notification-service | 3006 | notification |

## Infrastructure

| Service | Port |
|---------|------|
| PostgreSQL 16 | 5432 |
| Redis 7 | 6379 |
| Kafka | 9092 |
| Zookeeper | 2181 |
| Prometheus (scale only) | 9090 |
| Grafana (scale only) | 3100 |
| Kafdrop (local only) | 9000 |

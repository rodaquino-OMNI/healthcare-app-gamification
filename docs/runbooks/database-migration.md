# Database Migration Runbook

## 1. Overview

AUSTA uses Prisma ORM with PostgreSQL 16. Each microservice owns its own database schema and manages migrations independently. All services share one PostgreSQL instance with schema-level isolation.

**Key settings (production):** `max_connections=200`, `shared_buffers=256MB`

## 2. Service Schema Locations

| Service | Schema Path | DB Schema Name |
|---------|-------------|----------------|
| auth-service | `src/backend/auth-service/prisma/schema.prisma` | auth |
| health-service | `src/backend/health-service/prisma/schema.prisma` | health |
| care-service | `src/backend/care-service/prisma/schema.prisma` | care |
| plan-service | `src/backend/plan-service/prisma/schema.prisma` | plan |
| gamification-engine | `src/backend/gamification-engine/prisma/schema.prisma` | gamification |
| notification-service | `src/backend/notification-service/prisma/schema.prisma` | notification |

## 3. Development Migration

Create and apply a new migration locally:

```bash
# Navigate to the service directory
cd src/backend/<service>

# Create a new migration (generates SQL + applies to dev DB)
npx prisma migrate dev --name <description>

# Example
cd src/backend/auth-service
npx prisma migrate dev --name add-mfa-fields

# Regenerate the Prisma client after schema changes
npx prisma generate

# Verify migration was recorded
ls prisma/migrations/
```

Reset the dev database (destructive -- dev only):

```bash
npx prisma migrate reset
```

## 4. Staging/Production Migration

Production migrations use `migrate deploy` which only applies pending migrations without generating new ones.

### Via CI Pipeline

Migrations run automatically during the deploy step. Ensure migration files are committed before deploying.

### Manual Execution

```bash
# Via kubectl exec into the service pod
kubectl --context austa-production-cluster exec deploy/auth-service -n shared-services -- \
  npx prisma migrate deploy

kubectl --context austa-production-cluster exec deploy/health-service -n health-journey -- \
  npx prisma migrate deploy

kubectl --context austa-production-cluster exec deploy/care-service -n care-journey -- \
  npx prisma migrate deploy

kubectl --context austa-production-cluster exec deploy/plan-service -n plan-journey -- \
  npx prisma migrate deploy

kubectl --context austa-production-cluster exec deploy/gamification-engine -n gamification -- \
  npx prisma migrate deploy

kubectl --context austa-production-cluster exec deploy/notification-service -n shared-services -- \
  npx prisma migrate deploy
```

### Verify Migration Status

```bash
# Check which migrations have been applied
kubectl --context austa-production-cluster exec deploy/<service> -n <namespace> -- \
  npx prisma migrate status
```

## 5. Pre-Migration Backup

Always back up before running production migrations:

```bash
# Full database backup
pg_dump -U austa_admin -d austa_production -F c -f backup_$(date +%Y%m%d_%H%M%S).dump

# Per-schema backup
pg_dump -U austa_admin -d austa_production -n auth -f backup_auth_$(date +%Y%m%d).sql
pg_dump -U austa_admin -d austa_production -n health -f backup_health_$(date +%Y%m%d).sql
pg_dump -U austa_admin -d austa_production -n care -f backup_care_$(date +%Y%m%d).sql
pg_dump -U austa_admin -d austa_production -n plan -f backup_plan_$(date +%Y%m%d).sql
pg_dump -U austa_admin -d austa_production -n gamification -f backup_gamification_$(date +%Y%m%d).sql
pg_dump -U austa_admin -d austa_production -n notification -f backup_notification_$(date +%Y%m%d).sql
```

## 6. Rollback Procedure

### Mark Migration as Rolled Back

```bash
cd src/backend/<service>
npx prisma migrate resolve --rolled-back <migration_name>
```

### Manual SQL Rollback

If the migration included destructive changes, apply a manual rollback script:

```bash
# Connect to the database and execute rollback SQL
kubectl --context austa-production-cluster exec -it deploy/<service> -n <namespace> -- \
  psql "$DATABASE_URL" -f prisma/migrations/<migration_folder>/rollback.sql
```

### Restore From Backup

```bash
# Restore a specific schema from backup
psql -U austa_admin -d austa_production -f backup_auth_20260325.sql

# Or restore from custom format dump
pg_restore -U austa_admin -d austa_production -n auth backup_20260325_120000.dump
```

## 7. Seed Data

Seed scripts populate development and staging databases with test data.

```bash
# Run seed for a specific service
cd src/backend/<service>
npx prisma db seed

# Seed scripts are located at:
# src/backend/<service>/prisma/seed.ts
```

| Environment | Seed? | Notes |
|-------------|-------|-------|
| Development | Yes | Run after `migrate reset` |
| Staging | Optional | Use for QA testing |
| Production | No | Never seed production |

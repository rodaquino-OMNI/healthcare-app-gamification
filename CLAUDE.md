# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AUSTA SuperApp is a healthcare platform with three user journeys (Health, Care, Plan) and integrated gamification. The architecture uses microservices (NestJS backend), React Native/Next.js frontend, and AWS infrastructure.

## Commands

### Backend Development

```bash
# Start all backend services with Docker
cd src/backend
docker-compose up -d

# Start individual services
cd src/backend/[service-name]
yarn dev

# Run backend tests
cd src/backend
yarn test
yarn test:e2e
yarn test:cov

# Lint backend code
cd src/backend
yarn lint
yarn lint:fix

# Database operations
cd src/backend/shared
yarn prisma migrate dev
yarn prisma generate
yarn prisma studio
```

### Frontend Development

```bash
# Install dependencies (from src/web)
cd src/web
yarn install

# Start web application
yarn web:dev

# Start mobile application
yarn mobile:start

# Run design system storybook
yarn design-system:storybook

# Run tests
yarn test
yarn test:coverage

# Lint and format
yarn lint
yarn format
```

### Gamification Engine

```bash
# Start gamification engine with dependencies
cd src/backend/gamification-engine
./start-dev.sh

# Test gamification events
cd scripts
node test-gamification-events.js
```

### Infrastructure

```bash
# Deploy to staging
cd infrastructure/terraform/environments/staging
terraform plan
terraform apply

# Deploy services to Kubernetes
kubectl apply -f infrastructure/kubernetes/
```

## Architecture

### Microservices Structure

The backend consists of 7 core services, each with its own database schema:

1. **API Gateway (port 3000)**: GraphQL endpoint aggregating all services
2. **Auth Service (port 3001)**: JWT authentication, OAuth, RBAC
3. **Health Service (port 3002)**: Health metrics, wearables, FHIR integration
4. **Care Service (port 3003)**: Appointments, telemedicine, medications
5. **Plan Service (port 3004)**: Insurance plans, claims, coverage
6. **Gamification Engine (port 3005)**: Event processing, achievements, rewards
7. **Notification Service (port 3006)**: Multi-channel notifications, WebSockets

### Event-Driven Architecture

Services communicate via Kafka topics:
- `health.events`: Health journey events
- `care.events`: Care journey events  
- `plan.events`: Plan journey events
- `gamification.events`: Achievement unlocks
- `notification.events`: Notification triggers

### Frontend Architecture

Monorepo structure with shared components:
- `src/web/shared/`: Types, GraphQL queries, utilities
- `src/web/design-system/`: Journey-themed component library
- `src/web/mobile/`: React Native app
- `src/web/web/`: Next.js web app

### Journey Color Schemes
- Health Journey: #0ACF83 (green)
- Care Journey: #FF8C42 (orange)
- Plan Journey: #3A86FF (blue)

## Key Development Patterns

### Backend Service Structure
```
service/
├── src/
│   ├── module/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── module.controller.ts
│   │   ├── module.service.ts
│   │   └── module.module.ts
│   ├── config/
│   ├── app.module.ts
│   └── main.ts
├── test/
└── package.json
```

### Gamification Event Processing
Events from journey services trigger gamification rules:
```typescript
{
  type: 'APPOINTMENT_BOOKED' | 'STEPS_RECORDED' | 'CLAIM_SUBMITTED',
  userId: string,
  data: object,
  journey: 'health' | 'care' | 'plan'
}
```

### GraphQL Schema Organization
Queries and mutations are organized by journey in `src/web/shared/graphql/`:
- `queries/`: Journey-specific queries
- `mutations/`: Journey-specific mutations
- `fragments/`: Reusable fragments

## Environment Configuration

### Backend Services
Each service uses environment variables:
- `DATABASE_URL`: PostgreSQL connection
- `REDIS_URL`: Redis connection
- `KAFKA_BROKERS`: Kafka brokers
- `JWT_SECRET`: Authentication secret
- `SERVICE_PORT`: Service port

### Frontend Applications
Configure in `.env.local`:
- `NEXT_PUBLIC_API_URL`: GraphQL endpoint
- `NEXT_PUBLIC_WS_URL`: WebSocket endpoint
- `NEXT_PUBLIC_SENTRY_DSN`: Error tracking

## Testing Strategy

### Backend Testing
- Unit tests: Service methods with mocked dependencies
- E2E tests: Full request/response cycle
- Use `--watch` for development

### Frontend Testing
- Component tests: React Testing Library
- E2E tests: Cypress (web), Detox (mobile)
- Visual tests: Storybook + Chromatic

## Database Management

### Prisma Commands
```bash
# Create migration
yarn prisma migrate dev --name migration_name

# Reset database
yarn prisma migrate reset

# View database
yarn prisma studio
```

### Schema Organization
Each service has its own PostgreSQL schema:
- `auth_schema`: Users, roles, permissions
- `health_schema`: Metrics, goals, devices
- `care_schema`: Appointments, medications
- `plan_schema`: Plans, claims, coverage
- `gamification_schema`: Profiles, achievements
- `notification_schema`: Templates, preferences

## Deployment

### Local Development
Use Docker Compose for all services:
```bash
docker-compose -f docker-compose.dev.yml up
```

### Staging/Production
GitHub Actions handles CI/CD:
1. Tests run on pull requests
2. Staging deploys on merge to main
3. Production requires manual approval

### Kubernetes Deployment
Services deploy to journey-specific node groups:
- Health journey: 1-20 nodes
- Care journey: 2-30 nodes (highest demand)
- Plan journey: 1-15 nodes
- Gamification: 1-25 nodes (compute-intensive)
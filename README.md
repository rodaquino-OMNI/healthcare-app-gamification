# AUSTA SuperApp — Healthcare Platform with Gamification

> **A unified digital health platform** that transforms healthcare delivery through a journey-centred approach with gamification at its core. The platform consolidates multiple healthcare functions into three colour-coded user journeys, making healthcare management engaging, accessible and clinically rigorous.

[![Backend CI](https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7/actions/workflows/frontend-ci.yml)
[![Design System CI](https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7/actions/workflows/design-system-ci.yml/badge.svg)](https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7/actions/workflows/design-system-ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📊 Repository at a Glance

| Metric | Value |
|---|---|
| **Total source files** | 2,843 |
| **TypeScript / TSX files** | 1,474 (656 `.ts` + 818 `.tsx`) |
| **Lines of TS/JS code** | ~378,000 |
| — Backend (NestJS services) | ~45,500 |
| — Frontend (Next.js + React Native) | ~175,600 |
| **Markdown documentation** | 267 files / ~88,500 lines |
| **Terraform IaC** | 28 files / ~3,100 lines |
| **Kubernetes manifests** | 40 YAML files |
| **Test files** | 85 (72 `.spec.ts` + 1 `.test.ts` + 12 `.e2e-spec.ts`) |
| **GitHub Actions workflows** | 10 pipelines |
| **Architecture Decision Records** | 5 ADRs |
| **Design system components** | 67 component directories |
| **Prisma schemas** | 2 (shared + gamification) |
| **GraphQL schemas** | 2 (API Gateway + web shared) |

*Measured February 22 2026 — excludes `.git/`, `node_modules/`, `.next/` cache.*

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#️-architecture)
- [Repository Structure](#-repository-structure)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Development](#️-development)
- [Testing](#-testing)
- [Infrastructure and Deployment](#-infrastructure--deployment)
- [CICD Pipelines](#️-cicd-pipelines)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Features

### Three Core User Journeys

| Journey | Colour | Key Capabilities |
|---|---|---|
| 🏥 **Minha Saúde** (My Health) | Blue | Health metrics & vitals tracking, wearable integration (Google Fit / Apple HealthKit), medical history timeline, FHIR-compliant EHR, health goal management |
| 🩺 **Cuidar-me Agora** (Care Now) | Green | Symptom checker & self-triage, appointment booking, telemedicine / video consultations, medication tracking & reminders, treatment plan management, provider search |
| 📋 **Meu Plano & Benefícios** (My Plan & Benefits) | Orange | Insurance coverage & digital cards, claims submission & tracking, cost simulation for procedures, benefits showcase, document management |

### 🎮 Gamification Engine

- XP (experience points) and levelling system
- Achievement badges with collectible rarity tiers
- Multi-step quests and time-limited challenges
- Journey-specific and global leaderboards
- Reward management and redemption catalogue
- Real-time event-driven rules engine (Kafka-backed)
- Profile tracking with progress persistence (TimescaleDB)

### 🔐 Security & Compliance

- OAuth 2.0 + JWT with refresh-token rotation
- Multi-factor authentication (MFA) and biometric login
- LGPD (Brazilian GDPR) compliant data handling — see [ADR-004](docs/adr/ADR-004-lgpd-compliance.md)
- Role-based access control (RBAC) and fine-grained permissions
- End-to-end TLS, WAF (AWS WAFv2), and VPC network isolation

---

## 🏗️ Architecture

### System Overview

```text
┌──────────────────────────────────────────────────────────────────┐
│                            Clients                               │
│         Web App (Next.js)  │  Mobile App (React Native)         │
└─────────────────────────────┬────────────────────────────────────┘
                              │  HTTPS / WSS
┌─────────────────────────────▼────────────────────────────────────┐
│              API Gateway  (NestJS + GraphQL + REST)              │
│                    Rate limiting · Auth middleware               │
└──────┬──────────┬──────────┬──────────┬──────────┬──────────────┘
       │          │          │          │          │
  ┌────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────┐ ┌───▼──────────┐
  │  Auth  │ │ Health │ │  Care  │ │  Plan  │ │ Gamification │
  │Service │ │Service │ │Service │ │Service │ │   Engine     │
  └────────┘ └────────┘ └────────┘ └────────┘ └──────────────┘
       │          │          │          │          │
  ┌────▼──────────▼──────────▼──────────▼──────────▼──────────┐
  │                   Apache Kafka  (event bus)                │
  └────────────────────────────┬──────────────────────────────┘
                               │
  ┌────────────────────────────▼──────────────────────────────┐
  │        Notification Service  (multi-channel delivery)     │
  └───────────────────────────────────────────────────────────┘
                               │
  ┌────────────────────────────▼──────────────────────────────┐
  │  PostgreSQL 14+ · TimescaleDB · Redis 7 · S3              │
  └───────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

| ADR | Decision | Status |
|---|---|---|
| [ADR-001](docs/adr/ADR-001-navigation-architecture.md) | Journey-based navigation with colour coding | Accepted |
| [ADR-002](docs/adr/ADR-002-api-contract-strategy.md) | GraphQL-first API contract strategy | Accepted |
| [ADR-003](docs/adr/ADR-003-error-handling-strategy.md) | Structured error-handling with journey context | Accepted |
| [ADR-004](docs/adr/ADR-004-lgpd-compliance.md) | LGPD compliance data architecture | Accepted |
| [ADR-013](docs/adr/013-claude-flow-swarm-intelligence.md) | Claude Flow swarm-intelligence agent pattern | Accepted |

---

## 📁 Repository Structure

```text
healthcare-super-app/
├── src/
│   ├── backend/                        # NestJS monorepo (Lerna)
│   │   ├── api-gateway/                # GraphQL + REST unified entry point  (26 TS files)
│   │   ├── auth-service/               # OAuth2, JWT, MFA, biometric          (42 TS files)
│   │   ├── care-service/               # Appointments, telemedicine, Rx        (49 TS files)
│   │   ├── gamification-engine/        # XP, achievements, quests, rewards    (59 TS files)
│   │   │   └── src/
│   │   │       ├── achievements/       # Badge & achievement processing
│   │   │       ├── quests/             # Multi-step quest engine
│   │   │       ├── leaderboard/        # Journey + global leaderboards
│   │   │       ├── rewards/            # Reward catalogue & redemption
│   │   │       ├── rules/              # Event-driven rules engine
│   │   │       ├── profiles/           # Gamification user profiles
│   │   │       └── events/             # Kafka event consumers/producers
│   │   ├── health-service/             # Vitals, goals, wearable integrations  (56 TS files)
│   │   ├── notification-service/       # Push, SMS, email, in-app              (43 TS files)
│   │   ├── plan-service/               # Insurance, claims, benefits           (54 TS files)
│   │   ├── shared/                     # Cross-service utilities & DTOs        (57 TS files)
│   │   └── packages/
│   │       ├── auth/                   # Shared auth guards & decorators
│   │       └── shared/                 # Shared NestJS modules
│   │
│   └── web/                            # Turborepo monorepo
│       ├── web/                        # Next.js 14 web application            (341 TS/TSX files)
│       │   └── src/
│       │       ├── components/         # forms, navigation, modals, dashboard
│       │       ├── context/            # React context providers
│       │       ├── utils/              # Helpers and hooks
│       │       └── __tests__/          # Unit tests by page/feature
│       ├── mobile/                     # React Native 0.73 app                 (402 TS/TSX files)
│       │   └── src/
│       │       ├── screens/            # auth, care, gamification, health,
│       │       │                       # home, plan, profile, settings, error
│       │       ├── navigation/         # Typed React Navigation stack
│       │       ├── context/            # App-wide context
│       │       └── utils/              # RN-specific helpers
│       ├── design-system/              # Shared component library (Storybook)  (305 TS/TSX files)
│       │   └── src/
│       │       ├── care/               # AppointmentCard, SymptomSelector,
│       │       │                       # MedicationCard, ProviderCard,
│       │       │                       # VideoConsultation
│       │       ├── gamification/       # AchievementBadge, LevelIndicator,
│       │       │                       # Leaderboard, QuestCard, RewardCard,
│       │       │                       # AchievementNotification, XPCounter
│       │       └── plan/               # ClaimCard, CoverageInfoCard …
│       ├── shared/                     # Shared hooks, utils, GraphQL schema   (34 TS/TSX files)
│       └── types/                      # Global TypeScript type definitions
│
├── infrastructure/
│   ├── kubernetes/                     # 40 manifests across 8 namespaces
│   │   ├── api-gateway/
│   │   ├── auth-service/
│   │   ├── care-journey/
│   │   ├── gamification/
│   │   ├── health-journey/
│   │   ├── monitoring/
│   │   ├── notification-service/
│   │   └── plan-journey/
│   ├── terraform/                      # 28 .tf files / ~3,100 lines
│   │   ├── modules/
│   │   │   ├── eks/                    # EKS cluster
│   │   │   ├── network/                # VPC, subnets, security groups
│   │   │   ├── rds/                    # PostgreSQL RDS
│   │   │   ├── elasticache/            # Redis ElastiCache
│   │   │   ├── msk/                    # Amazon MSK (Kafka)
│   │   │   ├── s3/                     # Document & asset storage
│   │   │   ├── monitoring/             # CloudWatch, Grafana
│   │   │   └── waf/                    # AWS WAFv2
│   │   └── environments/               # staging / production tfvars
│   ├── monitoring/
│   │   ├── grafana-dashboard.json      # Pre-built Grafana dashboard
│   │   └── sentry.yml                  # Sentry project config
│   ├── nginx/
│   │   └── nginx.production.conf
│   └── docker-compose.production.yml
│
├── docs/
│   ├── adr/                            # 5 Architecture Decision Records
│   ├── analysis/                       # Security audit, quality scorecard
│   ├── design/                         # System & service architecture docs
│   ├── Figma/                          # Design tokens (JSON) + screen inventory
│   ├── specifications/                 # 8 formal spec documents
│   └── original documentation/        # Project guide & technical spec
│
├── .github/workflows/                  # 10 GitHub Actions pipelines
├── agents/                             # AI agent definitions (YAML)
├── lerna.json                          # Lerna monorepo config
├── tsconfig.base.json                  # Shared TypeScript base config
└── jest.config.js                      # Root Jest config
```

---

## 💻 Technology Stack

### Backend

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | v18+ LTS |
| Framework | NestJS | 10.0.0 |
| API | GraphQL (Apollo Server) + REST | graphql 16.8.1 |
| ORM | Prisma | 5.10.2 |
| Message broker | Apache Kafka (KafkaJS) | kafkajs ^2.2.4 |
| Cache | Redis (ioredis) | ioredis ^5.3.2 |
| Primary DB | PostgreSQL | 14+ |
| Time-series DB | TimescaleDB | — |
| Language | TypeScript | 5.x |

### Frontend

| Layer | Technology | Version |
|---|---|---|
| Web framework | Next.js | 14.2.29 |
| Mobile framework | React Native | 0.73.4 |
| UI library | React | 18.2.0 |
| State / data fetching | TanStack Query (React Query) | — |
| Styling | Styled Components | 6.0+ |
| Charts (web) | Recharts | — |
| Charts (mobile) | Victory Native | — |
| Language | TypeScript | 5.3.3 |
| Build system | Turborepo | — |
| Component docs | Storybook | — |
| Mobile E2E | Maestro | — |
| Mobile distribution | EAS (Expo Application Services) | — |

### Infrastructure

| Layer | Technology |
|---|---|
| Containers | Docker |
| Orchestration | Kubernetes (AWS EKS) |
| IaC | Terraform |
| Cloud provider | AWS (EKS, RDS, ElastiCache, MSK, S3, WAFv2) |
| CI/CD | GitHub Actions (10 workflows) |
| Metrics | Grafana / CloudWatch |
| Error tracking | Sentry |
| Package manager | Yarn (Lerna + Turborepo monorepo) |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | v18 LTS |
| Yarn | v1.22.19 |
| Docker & Docker Compose | latest stable |
| PostgreSQL | 14 |
| Redis | 7.0 |

### Installation

```bash
# 1. Clone
git clone https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7.git
cd healthcare-super-app--w-gamification--tgfzl7

# 2. Install all workspace dependencies (root + backend + web)
yarn install

# 3. Copy and configure environment variables
cp src/backend/.env.example src/backend/.env
# Edit src/backend/.env with your local DB, Redis, Kafka credentials

# 4. Start infrastructure services
docker-compose -f src/backend/docker-compose.yml up -d postgres redis kafka

# 5. Run database migrations
cd src/backend
yarn prisma migrate dev

# 6. Seed development data (optional)
yarn prisma db seed
```

---

## 🛠️ Development

### Backend Services

```bash
cd src/backend

# Start all services in watch mode
yarn dev

# Start a single service
yarn workspace @austa/api-gateway dev
yarn workspace @austa/auth-service dev
yarn workspace @austa/gamification-engine dev
yarn workspace @austa/health-service dev
yarn workspace @austa/care-service dev
yarn workspace @austa/plan-service dev
yarn workspace @austa/notification-service dev

# Prisma Studio (database GUI)
yarn prisma studio
```

### Web Application (Next.js)

```bash
cd src/web
yarn web dev          # → http://localhost:3000
```

### Mobile Application (React Native)

```bash
cd src/web
yarn mobile start     # Metro bundler
yarn mobile ios       # iOS simulator
yarn mobile android   # Android emulator
```

### Design System (Storybook)

```bash
cd src/web
yarn design-system storybook   # → http://localhost:6006
```

### Code Quality

```bash
# Lint (all workspaces)
yarn lint

# Type-check (all workspaces)
yarn typecheck

# Format
yarn format
```

---

## 🧪 Testing

The repository contains **85 test files**:

- 72 unit/integration spec files (`.spec.ts`)
- 1 isolated test file (`.test.ts`)
- 12 end-to-end spec files (`.e2e-spec.ts`)
- Maestro flows for native E2E (`src/web/mobile/.maestro/flows/`)

```bash
# Run all tests from root
yarn test

# Backend tests
cd src/backend
yarn test            # unit + integration
yarn test:e2e        # end-to-end
yarn test:cov        # with coverage report

# Web tests
cd src/web
yarn test

# Mobile tests
cd src/web
yarn mobile test

# Design system tests
cd src/web
yarn design-system test
```

---

## 📦 Infrastructure & Deployment

### Local (Docker Compose)

```bash
# Full stack local
docker-compose -f src/backend/docker-compose.yml up --build

# Staging profile
docker-compose -f src/backend/docker-compose.staging.yml up --build

# Scale services
docker-compose -f src/backend/docker-compose.scale.yml up --scale gamification-engine=3
```

### Kubernetes Namespaces

| Namespace | Services |
|---|---|
| `api-gateway` | API Gateway deployment & ingress |
| `auth-service` | Auth service & secrets |
| `care-journey` | Care service |
| `gamification` | Gamification engine |
| `health-journey` | Health service |
| `plan-journey` | Plan service |
| `notification-service` | Notification service |
| `monitoring` | Grafana, Prometheus, exporters |

### Terraform AWS Modules

```bash
cd infrastructure/terraform

# Initialise
terraform init

# Plan (staging)
terraform plan -var-file=environments/staging.tfvars

# Apply
terraform apply -var-file=environments/staging.tfvars
```

Provisioned modules: `eks`, `network`, `rds`, `elasticache`, `msk`, `s3`, `monitoring`, `waf`.

### Production Deployment

```bash
# Deploy all services (assumes kubectl context is set)
make deploy-all ENV=production

# Or via Terraform wrapper
./infrastructure/terraform/tf-wrapper.sh apply production
```

---

## ⚙️ CI/CD Pipelines

| Workflow file | Trigger | Purpose |
|---|---|---|
| `backend-ci.yml` | push / PR | Lint, type-check, unit & e2e tests for all backend services |
| `frontend-ci.yml` | push / PR | Lint, type-check, unit tests for Next.js web |
| `web-ci.yml` | push / PR | Full web build & test |
| `design-system-ci.yml` | push / PR | Component tests + Storybook build |
| `storybook-ci.yml` | push / PR | Publish Storybook artefact |
| `eas-build.yml` | push / PR | EAS build for React Native (iOS + Android) |
| `eas-update.yml` | merge to main | OTA update via EAS |
| `deploy-staging.yml` | merge to main | Deploy all services to staging |
| `deploy-production.yml` | manual / tag | Blue/green production deploy |
| `auto-commit-push.yml` | schedule | Automated dependency & changelog commits |

---

## 📚 Documentation

| Location | Contents |
|---|---|
| [`docs/adr/`](docs/adr/) | 5 Architecture Decision Records |
| [`docs/specifications/`](docs/specifications/) | 8 formal specification documents (functional, non-functional, integration, UI/UX, user stories, acceptance criteria) |
| [`docs/design/`](docs/design/) | System architecture, service pseudocode, API gateway design, gamification architecture, test strategy, security & error handling |
| [`docs/analysis/`](docs/analysis/) | Build quality scorecard, repository deep analysis, security audit, forward path plan |
| [`docs/Figma/`](docs/Figma/) | Design tokens JSON, screen inventory (100%), theme definitions |
| [`docs/original documentation/`](docs/original%20documentation/) | Original project guide and technical specification |
| [`src/backend/docs/`](src/backend/docs/) | Backend-specific API and service documentation |

---

## 🤝 Contributing

1. Fork the repository and create a feature branch from `main`
2. Follow the established TypeScript/NestJS/React code style
3. Write tests for all new features (unit + integration)
4. Ensure all CI checks pass before opening a PR
5. Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
6. Update relevant documentation and ADRs

```bash
# Branch naming convention
git checkout -b feat/GH-XXX-short-description
git checkout -b fix/GH-XXX-short-description
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🏥 About AUSTA

AUSTA SuperApp is committed to making healthcare more accessible, engaging and effective through innovative technology and user-centred design. The platform serves Brazilian healthcare consumers with full LGPD compliance and FHIR-compatible clinical data exchange.

---

*Repository: `rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7` · Branch: `main` · Last audited: February 22, 2026*

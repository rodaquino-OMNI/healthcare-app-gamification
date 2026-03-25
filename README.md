# AUSTA SuperApp — Plataforma de Saúde Digital com Gamificação

> **Plataforma unificada de saúde digital** que transforma a experiência do usuário por meio de quatro jornadas temáticas com gamificação integrada. Consolida múltiplas funções de saúde em jornadas por cores, tornando a gestão de saúde engajante, acessível e clinicamente rigorosa.

[![Backend CI](https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7/actions/workflows/frontend-ci.yml)
[![Design System CI](https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7/actions/workflows/design-system-ci.yml/badge.svg)](https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7/actions/workflows/design-system-ci.yml)
[![Licença: Proprietária](https://img.shields.io/badge/Licen%C3%A7a-Propriet%C3%A1ria-red.svg)](LICENSE)

---

## 📊 Panorama do Repositório

| Métrica | Valor verificado |
|---|---|
| **Arquivos fonte totais** | ~2.140 |
| **Arquivos TypeScript / TSX** | 1.500 (702 `.ts` + 798 `.tsx`) — excluindo testes |
| **Arquivos TS/TSX (incluindo testes)** | 2.036 |
| **Linhas de código TS/JS** | ~415.000 |
| — Backend (serviços NestJS) | ~86.500 |
| — Frontend (Next.js + React Native + Design System) | ~328.600 |
| **Documentação Markdown** | 45 arquivos em `docs/` / ~35.800 linhas (546 `.md` repo-wide / ~205.000 linhas) |
| **Terraform IaC** | 28 arquivos / ~3.160 linhas |
| **Manifestos Kubernetes** | 40 arquivos YAML em 8 namespaces |
| **Arquivos de teste** | 536 (163 `.spec.ts` + 1 `.test.ts` + 12 `.e2e-spec.ts` + 360 `.test.tsx`) |
| **Pipelines GitHub Actions** | 12 workflows |
| **Architecture Decision Records** | 7 ADRs |
| **Componentes do design system** | 61 diretórios de componentes (29 UI + 8 primitivos + 4 gráficos + 5 care + 7 gamification + 4 health + 4 plan) |
| **Schemas Prisma** | 2 (shared + gamification) |
| **Modelos Prisma** | 42 (33 shared + 9 gamification) |
| **Enums Prisma** | 11 (no schema shared) |
| **Schemas GraphQL** | 2 (API Gateway + web shared) |
| **Idiomas i18n** | 2 (en-US, pt-BR) — web + mobile |
| **Navigators mobile** | 14 (9 raiz + 5 sub-navigators de saúde) |
| **Fluxos Maestro E2E** | 18 fluxos |

*Verificado em 25 de março de 2026 — exclui `.git/`, `node_modules/`, `.next/`, `.claude-flow/`, `.swarm/`, `dist/`, `build/`.*

---

## 📋 Índice

1. [Funcionalidades](#-funcionalidades)
2. [Arquitetura](#arquitetura)
3. [Estrutura do Repositório](#-estrutura-do-repositório)
4. [Stack Tecnológico](#-stack-tecnológico)
5. [Primeiros Passos](#-primeiros-passos)
6. [Desenvolvimento](#desenvolvimento)
7. [Testes](#-testes)
8. [Infraestrutura e Deploy](#-infraestrutura-e-deploy)
9. [Pipelines CI/CD](#pipelines-cicd)
10. [Documentação](#-documentação)
11. [Tarefas para Desenvolvedores](#️-tarefas-para-desenvolvedores)
12. [Contribuindo](#-contribuindo)
13. [Licença](#-licença)

---

## 🎯 Funcionalidades

### Quatro Jornadas do Usuário

| Jornada | Cor | Principais Capacidades |
|---|---|---|
| 🏥 **Minha Saúde** | Azul | Métricas de saúde e sinais vitais, integração com wearables (Google Fit / Apple HealthKit), histórico médico, EHR compatível com FHIR, gestão de metas de saúde, rastreamento de ciclo, avaliação de saúde |
| 🩺 **Cuidar-me Agora** | Verde | Verificador de sintomas e auto-triagem, agendamento de consultas, telemedicina / videoconsultas, rastreamento e lembretes de medicamentos, gestão de plano de tratamento, busca de prestadores |
| 📋 **Meu Plano & Benefícios** | Laranja | Cobertura de seguro e carteirinhas digitais, envio e acompanhamento de sinistros, simulação de custos de procedimentos, vitrine de benefícios, gestão de documentos |
| 🧘 **Bem-estar** | Roxo | Chat com IA Companion, check-ins de humor, meditação e exercícios de respiração, diário pessoal, rastreamento de sono, atividades e nutrição, recursos de bem-estar (artigos, vídeos, programas) |

### 🧘 Jornada Bem-estar — IA Companion

A quarta jornada introduz um companion de bem-estar com IA:

- Interface de chat conversacional (CompanionChat / CompanionChatActive)
- Check-ins de humor e rastreamento emocional
- Sessões guiadas de meditação e respiração
- Diário pessoal com histórico
- Planos diários de bem-estar, streaks e desafios
- Feed de dicas de bem-estar com artigos via deep-link
- Dashboard de insights
- Sugestões de resposta rápida

### 🏃 Submódulos de Saúde

Jornada de saúde expandida com módulos dedicados:

- **Atividade** — metas de passos, biblioteca de exercícios, log de treinos/histórico, sincronização com dispositivos, exportação de tendências
- **Nutrição** — diário alimentar, busca de alimentos, rastreamento de macros, log de refeições, ingestão de água, metas dietéticas, insights
- **Sono** — home do sono, diário, metas, score de qualidade, tendências, alarme inteligente, rotina de dormir, insights, sincronização com dispositivos
- **Recursos de Bem-estar** — lista/detalhe de artigos, videoteca/player, programas de bem-estar, favoritos

### 🎮 Motor de Gamificação

- XP (pontos de experiência) e sistema de nivelamento
- Badges de conquistas com tiers de raridade colecionáveis
- Quests multi-etapas e desafios com tempo limitado
- Leaderboards por jornada e globais
- Gestão de recompensas e catálogo de resgate
- Rules engine orientado a eventos em tempo real (Kafka)
- Perfil de tracking com persistência de progresso

### 🔐 Segurança e Compliance

- OAuth 2.0 + JWT com rotação de refresh token
- Autenticação multifator (MFA) e login biométrico
- Tratamento de dados conforme LGPD — ver [ADR-004](docs/adr/ADR-004-lgpd-compliance.md)
- Controle de acesso baseado em papéis (RBAC) e permissões granulares
- TLS ponta-a-ponta, WAF (AWS WAFv2) e isolamento de rede VPC
- Criptografia AES-256-GCM para PHI com salt por registro
- Auditoria de acesso a PHI via decorator `@PhiAccess()` e interceptor

### 🌐 Internacionalização

- Suporte completo i18n: **en-US** e **pt-BR**
- Arquivos de locale separados para web (`src/web/web/src/i18n/`) e mobile (`src/web/mobile/src/i18n/`)
- Utilitários de formatação para datas, moedas e unidades de saúde por locale
- Script de verificação de paridade: `npx tsx scripts/check-i18n-parity.ts`

---

## Arquitetura

### Visão Geral do Sistema

```text
┌──────────────────────────────────────────────────────────────────┐
│                            Clientes                              │
│         Web App (Next.js 15)  │  Mobile App (React Native 0.76) │
└─────────────────────────────┬────────────────────────────────────┘
                              │  HTTPS / WSS
┌─────────────────────────────▼────────────────────────────────────┐
│              API Gateway  (NestJS 11 + GraphQL + REST)            │
│                    Rate limiting · Auth middleware                │
└──────┬──────────┬──────────┬──────────┬──────────┬──────────────┘
       │          │          │          │          │
  ┌────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼────┐ ┌───▼──────────┐
  │  Auth  │ │ Health │ │  Care  │ │  Plan  │ │ Gamification │
  │Service │ │Service │ │Service │ │Service │ │   Engine     │
  │ :3001  │ │ :3002  │ │ :3003  │ │ :3004  │ │   :3005      │
  └────────┘ └────────┘ └────────┘ └────────┘ └──────────────┘
       │          │          │          │          │
  ┌────▼──────────▼──────────▼──────────▼──────────▼──────────┐
  │                   Apache Kafka  (barramento de eventos)    │
  └────────────────────────────┬──────────────────────────────┘
                               │
  ┌────────────────────────────▼──────────────────────────────┐
  │      Notification Service :3006 (entrega multicanal)      │
  └───────────────────────────────────────────────────────────┘
                               │
  ┌────────────────────────────▼──────────────────────────────┐
  │  PostgreSQL 16 · Redis 7 · S3 · CloudFront                │
  └───────────────────────────────────────────────────────────┘
```

### Decisões Arquiteturais (ADRs)

| ADR | Decisão | Status |
|---|---|---|
| [ADR-001](docs/adr/ADR-001-navigation-architecture.md) | Navegação baseada em jornadas com cores | Aceito |
| [ADR-002](docs/adr/ADR-002-api-contract-strategy.md) | Estratégia GraphQL-first para contratos de API | Aceito |
| [ADR-003](docs/adr/ADR-003-error-handling-strategy.md) | Tratamento de erros estruturado com contexto de jornada | Aceito |
| [ADR-004](docs/adr/ADR-004-lgpd-compliance.md) | Arquitetura de dados em compliance com LGPD | Aceito |
| [ADR-005](docs/adr/ADR-005-design-ui-consistency.md) | Padrões de consistência de Design e UI | Aceito |
| [ADR-013](docs/adr/013-claude-flow-swarm-intelligence.md) | Padrão de agentes com inteligência de enxame (Claude Flow) | Aceito |
| [ADR-014](docs/adr/ADR-014-health-domain-api-modules.md) | Módulos de API do domínio de saúde | Aceito |

---

## 📁 Estrutura do Repositório

```text
healthcare-super-app/
├── src/
│   ├── backend/                        # Monorepo NestJS (pnpm)
│   │   ├── api-gateway/                # Entry point GraphQL + REST       38 TS / 4.778 linhas
│   │   ├── auth-service/               # OAuth2, JWT, MFA, biométrico     63 TS / 7.057 linhas
│   │   ├── care-service/               # Consultas, telemedicina, Rx      54 TS / 7.781 linhas
│   │   ├── gamification-engine/        # XP, conquistas, quests           70 TS / 26.388 linhas
│   │   │   └── src/
│   │   │       ├── achievements/       # Processamento de badges
│   │   │       ├── quests/             # Motor de quests multi-etapas
│   │   │       ├── leaderboard/        # Leaderboards por jornada + global
│   │   │       ├── rewards/            # Catálogo de recompensas e resgate
│   │   │       ├── rules/              # Rules engine orientado a eventos
│   │   │       ├── profiles/           # Perfis de gamificação
│   │   │       └── events/             # Consumers/producers Kafka
│   │   ├── health-service/             # Sinais vitais, metas, wearables  97 TS / 13.702 linhas
│   │   ├── notification-service/       # Push, SMS, e-mail, in-app        43 TS / 5.091 linhas
│   │   ├── plan-service/               # Seguro, sinistros, benefícios    62 TS / 7.532 linhas
│   │   ├── shared/                     # Utilitários e DTOs cross-service 78 TS / 10.505 linhas
│   │   │   └── prisma/schema.prisma    # 33 models, 11 enums
│   │   └── packages/
│   │       ├── auth/                   # Guards e decorators compartilhados
│   │       └── shared/                 # Módulos NestJS compartilhados
│   │
│   └── web/                            # Monorepo Turborepo
│       ├── web/                        # App web Next.js 15               559 arquivos / 83.043 linhas
│       │   └── src/
│       │       ├── pages/
│       │       │   ├── auth/           # Login, cadastro, MFA
│       │       │   ├── health/         # Métricas, avaliação, ciclo,
│       │       │   │                   # atividade, nutrição, sono,
│       │       │   │                   # recursos de bem-estar
│       │       │   ├── care/           # Consultas, telemedicina,
│       │       │   │                   # verificador de sintomas, visitas
│       │       │   ├── plan/           # Cobertura, sinistros
│       │       │   ├── wellness/       # IA companion, humor, meditação,
│       │       │   │                   # respiração, diário, plano diário,
│       │       │   │                   # metas, streaks, desafios, dicas,
│       │       │   │                   # insights, chat, respostas rápidas
│       │       │   ├── achievements/   # Quests, recompensas
│       │       │   ├── home/           # Dashboard
│       │       │   ├── notifications/
│       │       │   ├── profile/
│       │       │   ├── settings/
│       │       │   ├── search/
│       │       │   └── help/           # FAQ
│       │       ├── components/         # Formulários, navegação, modais, dashboard
│       │       ├── i18n/               # Locales en-US, pt-BR
│       │       ├── context/            # React context providers
│       │       └── utils/              # Helpers e hooks
│       │
│       ├── mobile/                     # React Native 0.76 + Expo        628 arquivos / 148.309 linhas
│       │   └── src/
│       │       ├── screens/
│       │       │   ├── auth/           # Login, cadastro, biométrico
│       │       │   ├── health/         # Sinais vitais + submódulos:
│       │       │   │   ├── activity/   # ActivityHome, StepGoals, WorkoutLog,
│       │       │   │   │               # ExerciseLibrary, Trends, DeviceSync
│       │       │   │   ├── nutrition/  # FoodDiary, MacroTracker, WaterIntake,
│       │       │   │   │               # MealLog, DietaryGoals, Insights
│       │       │   │   ├── sleep/      # SleepHome, Diary, Goals, Quality,
│       │       │   │   │               # SmartAlarm, BedtimeRoutine, Trends
│       │       │   │   ├── wellness-resources/ # Artigos, Vídeos, Programas
│       │       │   │   ├── assessment/ # Avaliação de risco + etapas
│       │       │   │   └── cycle-tracking/
│       │       │   ├── care/           # Consultas, telemedicina, Rx
│       │       │   ├── plan/           # Cobertura, sinistros
│       │       │   ├── wellness/       # IA Companion (15 telas):
│       │       │   │                   # Chat, MoodCheckIn, Meditation,
│       │       │   │                   # Breathing, Journal, DailyPlan,
│       │       │   │                   # Goals, Streaks, Challenges,
│       │       │   │                   # WellnessTip, Insights, QuickReplies
│       │       │   ├── gamification/   # Conquistas, leaderboard, quests
│       │       │   ├── home/           # Dashboard
│       │       │   ├── profile/
│       │       │   ├── settings/
│       │       │   └── error/
│       │       ├── navigation/         # 14 navigators tipados:
│       │       │   ├── RootNavigator       # Entry point
│       │       │   ├── MainNavigator       # Container de tabs
│       │       │   ├── AuthNavigator       # Autenticação
│       │       │   ├── HealthNavigator     # Jornada Saúde
│       │       │   ├── CareNavigator       # Jornada Cuidados
│       │       │   ├── PlanNavigator       # Jornada Plano
│       │       │   ├── WellnessNavigator   # Jornada Bem-estar
│       │       │   ├── GamificationNavigator # Gamificação
│       │       │   ├── SettingsNavigator   # Configurações
│       │       │   └── health/             # 5 sub-navigators:
│       │       │       ├── ActivityNavigator
│       │       │       ├── NutritionNavigator
│       │       │       ├── SleepNavigator
│       │       │       ├── CycleTrackingNavigator
│       │       │       └── WellnessResourcesNavigator
│       │       ├── i18n/               # Locales en-US, pt-BR
│       │       ├── constants/          # Constantes de rotas
│       │       ├── context/            # Context global do app
│       │       └── utils/              # Helpers específicos RN
│       │
│       ├── design-system/              # Biblioteca de componentes (Storybook 8)  356 TS/TSX / 91.273 linhas
│       │   └── src/
│       │       ├── components/         # 29 componentes UI (Tabs, Input, Button,
│       │       │                       # Modal, Toast, Card, Table, etc.)
│       │       ├── primitives/         # 8 primitivos (Box, Text, Stack, Icon, etc.)
│       │       ├── charts/             # 4 gráficos (Bar, Line, Radial, Donut)
│       │       ├── care/               # 5 componentes (AppointmentCard, SymptomSelector,
│       │       │                       # MedicationCard, ProviderCard, VideoConsultation)
│       │       ├── gamification/       # 7 componentes (AchievementBadge, LevelIndicator,
│       │       │                       # Leaderboard, QuestCard, RewardCard,
│       │       │                       # AchievementNotification, XPCounter)
│       │       ├── health/             # 4 componentes (MetricCard, GoalCard,
│       │       │                       # DeviceCard, HealthChart)
│       │       ├── plan/               # 4 componentes (ClaimCard, CoverageInfoCard,
│       │       │                       # BenefitCard, InsuranceCard)
│       │       ├── themes/             # Temas claro/escuro
│       │       └── tokens/             # Design tokens
│       ├── shared/                     # Hooks, utils, schema GraphQL     83 arquivos / 8.251 linhas
│       └── types/                      # Definições TypeScript globais
│
├── infrastructure/
│   ├── kubernetes/                      # 40 manifestos em 8 namespaces
│   │   ├── api-gateway/               # Deployment, Service, HPA, PDB, NetworkPolicy, Ingress
│   │   ├── auth-service/              # Deployment, Service, HPA, PDB, NetworkPolicy
│   │   ├── care-journey/
│   │   ├── gamification/
│   │   ├── health-journey/
│   │   ├── monitoring/                # Prometheus, Grafana, Loki
│   │   ├── notification-service/
│   │   └── plan-journey/
│   ├── terraform/                      # 28 arquivos .tf / ~3.160 linhas
│   │   ├── modules/
│   │   │   ├── eks/                    # Cluster EKS
│   │   │   ├── network/                # VPC, subnets, security groups
│   │   │   ├── rds/                    # PostgreSQL RDS
│   │   │   ├── elasticache/            # Redis ElastiCache
│   │   │   ├── msk/                    # Amazon MSK (Kafka)
│   │   │   ├── s3/                     # Armazenamento de documentos e assets
│   │   │   ├── monitoring/             # CloudWatch, Grafana
│   │   │   └── waf/                    # AWS WAFv2
│   │   └── environments/              # tfvars staging / production
│   ├── monitoring/
│   │   ├── grafana-dashboard.json
│   │   └── sentry.yml
│   ├── nginx/
│   │   └── nginx.production.conf
│   └── docker/                      # All Docker Compose files
│       ├── docker-compose.dev.yml
│       ├── docker-compose.staging.yml
│       ├── docker-compose.production.yml
│       ├── docker-compose.scale.yml
│       └── docker-compose.local.yml
│
├── docs/
│   ├── adr/                            # 7 Architecture Decision Records
│   ├── analysis/                       # Resultados de CI, auditoria, análise de deps
│   ├── design/                         # 10 documentos de arquitetura e design
│   ├── Documentação para Devs/         # 3 guias para desenvolvedores
│   ├── Figma/                          # Design tokens JSON + inventário de telas
│   ├── specifications/                 # 8 documentos formais de especificação
│   └── original documentation/         # Guia do projeto e spec técnica original
│
├── .github/workflows/                  # 12 pipelines GitHub Actions
├── agents/                             # Definições de agentes IA (YAML)
├── scripts/                            # Scripts utilitários (i18n parity, validação)
├── pnpm-workspace.yaml                 # Configuração monorepo pnpm
├── turbo.json                          # Configuração Turborepo
├── tsconfig.base.json                  # Config base TypeScript compartilhada
└── jest.config.js                      # Config raiz Jest
```

---

## 💻 Stack Tecnológico

### Backend

| Camada | Tecnologia | Versão |
|---|---|---|
| Runtime | Node.js | 20+ |
| Framework | NestJS | ^11.0.0 |
| API | GraphQL (Apollo Server) + REST | graphql 16.13.1 |
| ORM | Prisma | ^7.0.0 |
| Message broker | Apache Kafka (KafkaJS) | kafkajs ^2.2.4 |
| Cache | Redis (ioredis) | ioredis ^5.10.1 |
| BD primário | PostgreSQL | 16 |
| Linguagem | TypeScript | 5.9.3 (backend) / 5.3.3 (frontend) |

### Frontend

| Camada | Tecnologia | Versão |
|---|---|---|
| Web framework | Next.js | 15.5.12 |
| Mobile framework | React Native | 0.76.9 |
| UI (web) | React | 19.2.0 |
| UI (mobile) | React | 19.2.0 |
| Data fetching | TanStack Query (React Query) | — |
| Estilização | Styled Components | 6.3.11 |
| Gráficos (web) | Recharts | — |
| Gráficos (mobile) | Victory Native | 36.9.2 |
| Linguagem | TypeScript | 5.3.3 (web/mobile) |
| Build system | Turborepo | — |
| Documentação de componentes | Storybook | ^8.4.0 |
| E2E mobile | Maestro | 18 fluxos |
| Distribuição mobile | EAS (Expo Application Services) | — |
| i18n | Camada customizada | en-US + pt-BR |

### Infraestrutura

| Camada | Tecnologia |
|---|---|
| Contêineres | Docker (node:22-alpine, multi-stage) |
| Orquestração | Kubernetes (AWS EKS) |
| IaC | Terraform (8 módulos) |
| Cloud provider | AWS (EKS, RDS, ElastiCache, MSK, S3, WAFv2, CloudFront) |
| CI/CD | GitHub Actions (12 workflows) |
| Métricas | Prometheus + Grafana / CloudWatch |
| Rastreamento de erros | Sentry |
| Gerenciador de pacotes | pnpm (Turborepo monorepo) |
| Região AWS | sa-east-1 (compliance LGPD) |

---

## 🚀 Primeiros Passos

### Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Node.js | 20+ |
| pnpm | 10.6+ |
| Docker & Docker Compose | latest stable |
| Expo CLI | `npm install -g expo-cli` |

### Instalação

```bash
# 1. Clone
git clone https://github.com/rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7.git
cd healthcare-super-app--w-gamification--tgfzl7

# 2. Instalar dependências (todos os workspaces)
pnpm install

# 3. Configurar variáveis de ambiente
# Crie .env nos diretórios de serviço com credenciais locais de DB, Redis, Kafka

# 4. Iniciar serviços de infraestrutura
docker compose -f infrastructure/docker/docker-compose.dev.yml up -d

# 5. Gerar client Prisma
pnpm prisma:generate

# 6. Executar migrações do banco
pnpm --filter @austa/shared exec prisma migrate dev

# 7. Popular dados de desenvolvimento (opcional)
pnpm --filter @austa/shared exec prisma db seed
```

> **Avisos de instalação inofensivos:** `postinstall script path` e `husky .git not found` podem ser ignorados com segurança.

---

## Desenvolvimento

### Serviços Backend

```bash
cd src/backend

# Iniciar todos os serviços em watch mode via Docker Compose
docker compose -f infrastructure/docker/docker-compose.dev.yml up -d
pnpm run dev:backend       # Da raiz, via turbo

# Iniciar um serviço específico
pnpm --filter @austa/api-gateway dev
pnpm --filter @austa/auth-service dev
pnpm --filter @austa/gamification-engine dev
pnpm --filter @austa/health-service dev
pnpm --filter @austa/care-service dev
pnpm --filter @austa/plan-service dev
pnpm --filter @austa/notification-service dev

# Prisma Studio (GUI do banco)
pnpm --filter @austa/shared exec prisma studio
```

### Aplicação Web (Next.js)

```bash
cd src/web
pnpm run dev:web      # Da raiz → http://localhost:3000
```

### Aplicação Mobile (React Native)

```bash
cd src/web/mobile
pnpm start            # Metro bundler
pnpm run ios          # Simulador iOS
pnpm run android      # Emulador Android
```

### Design System (Storybook)

```bash
cd src/web/design-system
pnpm run storybook             # → http://localhost:6006
```

### Qualidade de Código

```bash
# Lint (todos os workspaces)
pnpm lint

# Type-check (todos os workspaces)
pnpm typecheck

# Format
pnpm format
```

---

## 🧪 Testes

O repositório contém **536 arquivos de teste**:

| Tipo | Quantidade | Extensão |
|---|---|---|
| Backend unit/integration | 163 | `.spec.ts` |
| Backend isolado | 1 | `.test.ts` |
| Backend end-to-end | 12 | `.e2e-spec.ts` |
| Frontend componente/tela | 360 | `.test.tsx` |
| Mobile E2E (Maestro) | 18 fluxos | `.yaml` |

```bash
# Executar todos os testes a partir da raiz
pnpm test

# Testes backend
pnpm test:backend

# Testes web
pnpm test:frontend

# Testes mobile
pnpm --filter austa-mobile test

# Testes design system
pnpm --filter @austa/design-system test

# E2E mobile (requer Maestro: brew tap mobile-dev-inc/tap && brew install maestro)
cd src/web/mobile
maestro test .maestro/flows/        # Todos os 18 fluxos
maestro test .maestro/flows/auth-login.yaml  # Fluxo específico
```

### Fluxos Maestro E2E

| Fluxo | Arquivo |
|---|---|
| Login e autenticação | `auth-login.yaml` |
| Envio de sinistro | `claim-submission.yaml` |
| Rastreamento de ciclo | `cycle-tracking-log.yaml` |
| Agendamento médico | `doctor-booking.yaml` |
| Erro: consentimento revogado | `error-consent-revoked.yaml` |
| Erro: sessão expirada | `error-expired-session.yaml` |
| Erro: formulário inválido | `error-invalid-form.yaml` |
| Erro: login inválido | `error-invalid-login.yaml` |
| Erro: falha de rede | `error-network-failure.yaml` |
| Gamificação | `gamification.yaml` |
| Entrada de métricas de saúde | `health-metrics-entry.yaml` |
| Configurações LGPD | `lgpd-settings.yaml` |
| Gestão de medicamentos | `medication-mgmt.yaml` |
| Navegação do plano | `plan-navigation.yaml` |
| Busca e agendamento de prestador | `provider-search-book.yaml` |
| Rastreamento de sono | `sleep-tracking-log.yaml` |
| Verificador de sintomas | `symptom-checker.yaml` |
| Chat companion bem-estar | `wellness-companion-chat.yaml` |

### Cobertura Atual (baseline 2026-03-10)

| Pacote | Stmts | Branches | Funcs | Lines | Meta pré-launch |
|---|---|---|---|---|---|
| Backend | 62.85% | 40.28% | 60.59% | 62.22% | 70% |
| Web | 24.38% | 16.97% | 16.72% | 24.66% | 40% |
| Design System | 83.04% | 73.24% | 80.51% | 83.46% | 80% |

---

## 📦 Infraestrutura e Deploy

### Local (Docker Compose)

```bash
# Stack completo local
docker compose -f infrastructure/docker/docker-compose.dev.yml up --build

# Perfil staging
docker compose -f infrastructure/docker/docker-compose.staging.yml up --build

# Escalar serviços
docker compose -f infrastructure/docker/docker-compose.scale.yml up --scale gamification-engine=3
```

### Namespaces Kubernetes

| Namespace | Serviços | Manifestos por namespace |
|---|---|---|
| `api-gateway` | API Gateway + Ingress | deployment, service, hpa, pdb, network-policy, ingress |
| `auth-service` | Serviço de auth | deployment, service, hpa, pdb, network-policy |
| `care-journey` | Serviço de cuidados | deployment, service, hpa, pdb, network-policy |
| `gamification` | Motor de gamificação | deployment, service, hpa, pdb, network-policy |
| `health-journey` | Serviço de saúde | deployment, service, hpa, pdb, network-policy |
| `plan-journey` | Serviço de plano | deployment, service, hpa, pdb, network-policy |
| `notification-service` | Notificações | deployment, service, hpa, pdb, network-policy |
| `monitoring` | Observabilidade | prometheus, grafana, loki |

### Módulos Terraform AWS

```bash
cd infrastructure/terraform

# Inicializar
terraform init

# Planejar (staging)
terraform plan -var-file=environments/staging.tfvars

# Aplicar
terraform apply -var-file=environments/staging.tfvars
```

Módulos provisionados: `eks`, `network`, `rds`, `elasticache`, `msk`, `s3`, `monitoring`, `waf`.

### Deploy em Produção

O workflow `deploy-production.yml` usa estratégia **canary**:

1. Valida dependências
2. Executa suite de testes completa
3. Builda e publica imagens Docker (matrix de 7 serviços) no `ghcr.io`
4. Deploy canary (1 réplica por serviço) no cluster `austa-production-cluster`
5. Smoke-test em todos os 7 endpoints `/health`
6. Promoção do canary para rollout completo
7. Criação de release no Sentry
8. Em qualquer falha: rollback automático

---

## Pipelines CI/CD

| Arquivo de workflow | Trigger | Propósito |
|---|---|---|
| `backend-ci.yml` | push / PR | Lint, type-check, testes unitários e e2e para todos os serviços backend |
| `frontend-ci.yml` | push / PR | Lint, type-check, testes unitários para Next.js web |
| `web-ci.yml` | push / PR | Build e testes completos da web |
| `design-system-ci.yml` | push / PR | Testes de componentes + build Storybook |
| `storybook-ci.yml` | push / PR | Build Storybook + regressão visual Chromatic |
| `eas-build.yml` | push / PR | Build EAS para React Native (iOS + Android) |
| `eas-update.yml` | merge em main | OTA update via EAS |
| `deploy-staging.yml` | push em staging / manual | Deploy de todos os serviços em staging |
| `deploy-production.yml` | manual / tag `v*.*.*` | Deploy canary em produção |
| `renovate-auto-merge.yml` | Renovate | Auto-merge de PRs Renovate aprovados |
| `renovate-ci.yml` | Renovate | CI de validação para PRs Renovate |
| `renovate-runner.yml` | Renovate | Runner do Renovate |

---

## 📚 Documentação

| Local | Conteúdo |
|---|---|
| [`docs/adr/`](docs/adr/) | 7 Architecture Decision Records |
| [`docs/specifications/`](docs/specifications/) | 8 documentos formais de especificação (funcional, não-funcional, integração, UI/UX, user stories, critérios de aceite, análise de sistema, restrições técnicas) |
| [`docs/design/`](docs/design/) | 10 documentos: arquitetura do sistema, pseudocódigo de serviços, API gateway e service mesh, arquitetura de componentes, fluxo de dados, motor de gamificação, infraestrutura de deploy, insights de pesquisa em saúde, segurança e tratamento de erros, estratégia de testes |
| [`docs/Documentação para Devs/`](docs/Documentação%20para%20Devs/) | 3 guias essenciais: [Forward Guide](docs/Documentação%20para%20Devs/DEVELOPER_FORWARD_GUIDE.md), [Security Guide Mobile](docs/Documentação%20para%20Devs/mobile-security-guide.md), [Production Setup](docs/Documentação%20para%20Devs/production-setup-guide.md) |
| [`docs/analysis/`](docs/analysis/) | Resultados de CI, auditoria pré-deploy, análise de dependências Renovate |
| [`docs/Figma/`](docs/Figma/) | Design tokens JSON (core, light, dark, theme), inventário de telas (100%), definições de modo |
| [`docs/original documentation/`](docs/original%20documentation/) | Guia original do projeto e especificação técnica |
| [`src/backend/docs/`](src/backend/docs/) | Padrões de path alias do backend |

---

## 🛠️ Tarefas para Desenvolvedores

> **Leitura obrigatória antes de iniciar:** Os 3 guias em [`docs/Documentação para Devs/`](docs/Documentação%20para%20Devs/) contêm contexto detalhado, workarounds e instruções passo-a-passo para cada tarefa listada abaixo.

### P0 — Bloqueantes de Lançamento (requer ação humana)

Estas tarefas **não podem** ser completadas apenas por ferramentas de IA. Requerem contas externas, revisão jurídica ou provisionamento de infraestrutura.

| # | Tarefa | Status | Detalhes |
|---|---|---|---|
| 1 | **API layer** (~222 funções exportadas, 0 stubs) | 🟢 100% | `auth` ✅, `plan` ✅, `wellness` ✅, `gamification` ✅, `health` ✅, `care` ✅. Ver `src/web/mobile/src/api/` |
| 2 | **Setup do projeto Expo (EAS)** | 🟡 Parcial | `projectId` lê env var `EAS_PROJECT_ID` em `app.config.js`; bundle IDs configurados (`br.com.austa.superapp`); falta definir `EAS_PROJECT_ID` real via `eas init` |
| 3 | **Provisionamento AWS** | 🔴 Pendente | EKS, RDS PostgreSQL 16, ElastiCache Redis 7, S3, Secrets Manager, CloudFront — ver Terraform em `infrastructure/terraform/` |
| 4 | **Configuração Firebase** | 🟡 Parcial | `GoogleService-Info.plist` (iOS) ✅ presente; `google-services.json` (Android) 🔴 ausente |
| 5 | **Credenciais de serviços terceiros** | 🔴 Pendente | Firebase, Twilio (SMS), SendGrid (e-mail), Sentry DSN, Analytics — configurar no AWS Secrets Manager e `.env` |
| 6 | **Revisão jurídica LGPD** | 🔴 Pendente | Revisão legal de textos de consentimento, sign-off do DPO, política de rotação de chaves PHI, link de privacidade em `app.json` |

> 📖 Detalhes completos: [`DEVELOPER_FORWARD_GUIDE.md` → Seção P0](docs/Documentação%20para%20Devs/DEVELOPER_FORWARD_GUIDE.md)

### P1 — Pré-Lançamento (assistível por IA)

| # | Tarefa | Status | Detalhes |
|---|---|---|---|
| 1 | **Substituição de dados mock** | 🟢 Concluído | Scan encontrou 0 mock data em telas; telas usam dados dinâmicos via hooks/API |
| 2 | **Aumento de cobertura de testes** | 🟡 Em progresso | 536 arquivos de teste existem — metas: 60/40/70% |
| 3 | **TypeScript strict mode** (incremental) | 🟡 Em progresso | `strict: true` habilitado, `noImplicitAny: false`; corrigir por módulo |
| 4 | **Auditoria TODO/FIXME** | 🟡 Em progresso | 16 TODOs restantes no código fonte |
| 5 | **Migração Prisma 7.x** | 🟢 Concluído | Prisma `^7.0.0` em `package.json`; `prisma.config.ts` presente em `src/backend/shared/prisma/` |

> 📖 Detalhes completos: [`DEVELOPER_FORWARD_GUIDE.md` → Seção P1](docs/Documentação%20para%20Devs/DEVELOPER_FORWARD_GUIDE.md)

### Problemas Técnicos Conhecidos

| # | Problema | Severidade | Status / Solução |
|---|---|---|---|
| 1 | **Erros TypeScript no mobile** | Média | App roda; `strict: true`, `noImplicitAny: false`. Reduzido significativamente após sprint TS-STRICT |
| 2 | **Build do Design System** | Alta | Conflito ESM/CJS em `rollup.config.mjs` no Node 22. `"type": "module"` já adicionado. Fix recomendado: migrar para Vite |
| 3 | **Alinhamento de portas K8s** | — | ✅ Resolvido (portas 3000-3006 alinhadas) |
| 4 | **Mismatch estrutural i18n** | Baixa | `en-US.ts` usa chaves aninhadas, `pt-BR.ts` usa nível superior em alguns pontos. Verificar: `npx tsx scripts/check-i18n-parity.ts` |

### Segurança Mobile — Gaps Pendentes

> 📖 Documentação completa: [`mobile-security-guide.md`](docs/Documentação%20para%20Devs/mobile-security-guide.md)

| Controle MASVS | Status | Ação necessária |
|---|---|---|
| MASVS-STORAGE-1 | 🟢 Implementado | `secure-storage.ts` wired no `AuthContext.tsx` (import + uso de `secureTokenStorage`) |
| MASVS-NETWORK-2 | 🟢 Implementado | `react-native-ssl-pinning` ^1.5.5 instalado; `native-ssl-pinning.ts` presente |
| MASVS-AUTH-2 | 🟡 Parcial | Implementar verificação server-side de key-pair biométrica (`createKeys()` / `createSignature()`) |
| MASVS-RESILIENCE-1 | 🟢 Implementado | `warnIfCompromised()` chamado no `App.tsx` (root/jailbreak detection ativo) |
| MASVS-RESILIENCE-2 | 🔴 Gap | Implementar anti-tampering / integrity checks (SafetyNet/Play Integrity) |
| MASVS-CODE-1 | 🟡 Parcial | `minifyEnabled` comentado no `build.gradle`; `proguard-rules.pro` criado — descomentar para release |

### Setup de Produção — Checklist

> 📖 Documentação completa: [`production-setup-guide.md`](docs/Documentação%20para%20Devs/production-setup-guide.md)

| Item | Status | Referência |
|---|---|---|
| Secrets no AWS Secrets Manager | 🔴 Pendente | Convenção: `austa/<environment>/<secret-name>` |
| GitHub Actions Secrets configurados | 🔴 Pendente | 11 secrets necessários (AWS, Sentry, Codecov, Expo, Apple, Google) |
| NestJS Prometheus instrumentation | 🔴 Pendente | Habilitar `@willsoto/nestjs-prometheus` em cada serviço para `/metrics` |
| Grafana admin password alterada | 🔴 Pendente | Alterar credenciais default no primeiro login |
| Sentry PHI scrubbing verificado | 🔴 Pendente | PHI não deve ser enviado ao Sentry |
| RDS backup automatizado (7 dias+) | 🔴 Pendente | Requerido pela LGPD para audit trail |

### Navegação por Módulo (referência)

| Navigator | Arquivo | Telas |
|---|---|---|
| RootNavigator | `navigation/RootNavigator.tsx` | Entry point |
| MainNavigator | `navigation/MainNavigator.tsx` | Container de tabs |
| HealthNavigator | `navigation/HealthNavigator.tsx` | 92 telas (37 + 5 sub-navigators: Activity 10, Nutrition 10, Sleep 12, Cycle 15, WellnessResources 8) |
| CareNavigator | `navigation/CareNavigator.tsx` | 68 telas |
| WellnessNavigator | `navigation/WellnessNavigator.tsx` | 15 telas |
| PlanNavigator | `navigation/PlanNavigator.tsx` | 8 telas |
| SettingsNavigator | `navigation/SettingsNavigator.tsx` | 33 telas |
| AuthNavigator | `navigation/AuthNavigator.tsx` | 23 telas |
| GamificationNavigator | `navigation/GamificationNavigator.tsx` | 7 telas |

---

## 🤝 Contribuindo

1. Faça fork do repositório e crie uma branch de feature a partir de `main`
2. Siga o estilo de código TypeScript/NestJS/React estabelecido
3. Escreva testes para todas as novas features (unit + integration)
4. Assegure que todos os checks de CI passam antes de abrir um PR
5. Use [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit
6. Atualize a documentação e ADRs relevantes
7. **Leia o [ADR-005](docs/adr/ADR-005-design-ui-consistency.md) antes de adicionar novos módulos** — define limites de linhas por tela, requisitos de `testID`, regras de acessibilidade e estrutura i18n

```bash
# Convenção de nomes de branch
git checkout -b feat/GH-XXX-descricao-curta
git checkout -b fix/GH-XXX-descricao-curta
```

---

## 📄 Licença

Este projeto está licenciado sob **Licença Proprietária** — consulte o arquivo [LICENSE](LICENSE) para detalhes.

**Copyright (c) 2023 AUSTA Healthcare Technologies. Todos os direitos reservados.**

---

## 🏥 Sobre a AUSTA

O AUSTA SuperApp é comprometido em tornar a saúde mais acessível, engajante e eficaz por meio de tecnologia inovadora e design centrado no usuário. A plataforma atende consumidores de saúde brasileiros com compliance total à LGPD e troca de dados clínicos compatível com FHIR.

---

*Repositório: `rodaquino-OMNI/healthcare-super-app--w-gamification--tgfzl7` · Branch: `main` · Última auditoria forense: 25 de março de 2026*

# AUSTA Healthcare SuperApp

Plataforma digital de saude com gamificacao para engajamento de pacientes.

## Arquitetura

```
PostgreSQL 16 --> Redis 7 --> Laravel 12 (API RESTful) --> Flutter App (iOS/Android)
```

### Stack Tecnologica

| Camada | Tecnologia |
|--------|-----------|
| **Backend** | Laravel 12 (PHP 8.3), Eloquent ORM, Laravel Sanctum |
| **Banco de Dados** | PostgreSQL 16 |
| **Cache/Filas** | Redis 7 (cache + queue driver) |
| **Mobile** | Flutter 3.x (Dart), Riverpod, GoRouter |
| **Infra** | Docker Swarm, Nginx |
| **CI/CD Backend** | GitHub Actions |
| **CI/CD Mobile** | Codemagic |

> **Nota:** GeneXus pode ser utilizado como complemento para paineis administrativos e backoffice.

## Jornadas do Usuario

| Jornada | Cor | Descricao |
|---------|-----|-----------|
| **Minha Saude** | #0ACF83 (Verde) | Metricas vitais, wearables, metas de saude |
| **Cuidar-me Agora** | #FF8C42 (Laranja) | Consultas, telemedicina, medicamentos |
| **Meu Plano** | #3A86FF (Azul) | Plano de saude, sinistros, cobertura |
| **Bem-estar** | #9F7AEA (Roxo) | Companion IA, meditacao, humor |

## Gamificacao

- **XP & Niveis**: `level = floor(xp / 100) + 1`
- **Achievements**: Badges por jornada com progresso
- **Quests**: Diarias, semanais e especiais
- **Rewards**: Catalogo de recompensas resgataveis
- **Leaderboard**: Rankings globais e por jornada
- **Rules Engine**: Avaliacao segura de condicoes (symfony/expression-language)

## Estrutura do Repositorio

```
healthcare-app-gamification/
├── backend/                    # Laravel 12 API
│   ├── app/
│   │   ├── Domain/             # Logica de negocio (Auth, Health, Care, Plan, Gamification)
│   │   ├── Enums/              # PHP 8.1 backed enums
│   │   ├── Http/Controllers/   # API Controllers
│   │   ├── Models/             # Eloquent models (32)
│   │   └── Jobs/               # Queue jobs (Redis)
│   ├── database/migrations/    # 32 tabelas
│   ├── routes/api.php          # RESTful API v1
│   └── tests/                  # PHPUnit
├── mobile/                     # Flutter App
│   └── lib/
│       ├── core/               # API, auth, navigation, theme, i18n
│       ├── design_system/      # 26 componentes + 7 gamificacao
│       ├── features/           # Auth, Home, Health, Care, Plan, Wellness, Gamification
│       └── shared/             # Models, widgets, providers
├── infrastructure/
│   ├── docker-swarm/           # Stack files producao
│   ├── nginx/                  # Reverse proxy
│   ├── postgres/               # Config PostgreSQL
│   ├── redis/                  # Config Redis
│   └── scripts/                # Deploy, backup, rollback
├── docs/                       # Especificacoes e ADRs
├── .github/workflows/          # CI/CD GitHub Actions
└── codemagic.yaml              # CI/CD Flutter
```

## DevOps

```
Backend:  Dev -> GitHub -> GitHub Actions -> Servidor Producao (Docker Swarm)
Frontend: Dev -> GitHub -> Codemagic -> App Store / Play Store
```

## Requisitos

- PHP 8.3+
- Composer 2.x
- Flutter 3.x / Dart 3.x
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7

## Desenvolvimento Local

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Mobile
```bash
cd mobile
flutter pub get
dart run build_runner build --delete-conflicting-outputs
flutter run
```

### Docker (completo)
```bash
cd infrastructure/docker-swarm
docker compose -f docker-compose.dev.yml up -d
```

## API

Base URL: `/api/v1/`

| Grupo | Prefix | Auth |
|-------|--------|------|
| Auth | `/api/v1/auth/` | Publico |
| Health | `/api/v1/health/` | Sanctum |
| Care | `/api/v1/care/` | Sanctum |
| Plan | `/api/v1/plan/` | Sanctum |
| Gamification | `/api/v1/gamification/` | Sanctum |
| Notifications | `/api/v1/notifications/` | Sanctum |
| Consent (LGPD) | `/api/v1/consent/` | Sanctum |

## Compliance

- **LGPD**: Consent records, criptografia PHI, audit logging
- **Dados no Brasil**: Servidor em regiao brasileira
- **Retencao**: Prontuarios medicos 20 anos (CFM)

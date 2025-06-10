# AUSTA Healthcare Super App

A unified digital health platform that transforms healthcare delivery through a journey-centered approach with gamification at its core. The platform consolidates multiple healthcare functions into three intuitive user journeys, making healthcare management engaging and accessible.

## 🚀 Overview

The AUSTA SuperApp is designed to provide a comprehensive healthcare experience by integrating various health services into a single platform. It features:

- **Journey-based navigation**: Three color-coded journeys for intuitive user experience
- **Gamification engine**: Points, achievements, quests, and leaderboards to encourage healthy behaviors
- **Microservices architecture**: Scalable, maintainable, and resilient system design
- **Multi-platform support**: Web and mobile applications with offline capabilities

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Features

### Three Main User Journeys

#### 1. 🏥 **Minha Saúde (My Health)**
- Health metrics tracking and visualization
- Wearable device integration (Google Fit, Apple HealthKit)
- Medical history timeline
- Health goal setting and progress tracking
- FHIR-compliant EHR integration

#### 2. 🩺 **Cuidar-me Agora (Care Now)**
- Symptom checker and self-triage
- Appointment booking system
- Telemedicine/video consultations
- Medication tracking and reminders
- Treatment plan management
- Healthcare provider search

#### 3. 📋 **Meu Plano & Benefícios (My Plan & Benefits)**
- Insurance coverage information
- Digital insurance cards
- Claims submission and tracking
- Cost simulation for procedures
- Benefits showcase
- Document management

### 🎮 Gamification Features
- User levels and experience points (XP)
- Achievement system with collectible badges
- Multi-step quests and challenges
- Journey-specific and overall leaderboards
- Reward management and redemption
- Event-driven rules engine

## 🏗️ Architecture

The application follows a microservices architecture with the following key components:

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients                              │
│         (Web App, Mobile App, Third-party Apps)            │
└─────────────────────────────────┬───────────────────────────┘
                                  │
┌─────────────────────────────────┴───────────────────────────┐
│                      API Gateway                            │
│                    (GraphQL + REST)                         │
└─────────┬───────────────────────────────────────────────────┘
          │
┌─────────┴────────┬─────────────┬─────────────┬─────────────┐
│   Auth Service   │ Health Svc  │  Care Svc   │  Plan Svc   │
├──────────────────┼─────────────┼─────────────┼─────────────┤
│ Gamification Eng │ Notification│    Shared   │   Redis     │
├──────────────────┴─────────────┴─────────────┴─────────────┤
│                     Apache Kafka                            │
├─────────────────────────────────────────────────────────────┤
│           PostgreSQL / TimescaleDB / Redis                  │
└─────────────────────────────────────────────────────────────┘
```

### Key Services

- **API Gateway**: Unified entry point with GraphQL interface
- **Auth Service**: OAuth 2.0, JWT, MFA, and biometric authentication
- **Health Service**: Health metrics, goals, and device integrations
- **Care Service**: Appointments, telemedicine, and treatment management
- **Plan Service**: Insurance, claims, and coverage management
- **Gamification Engine**: Achievement processing and reward distribution
- **Notification Service**: Multi-channel notification delivery

## 💻 Technology Stack

### Backend
- **Runtime**: Node.js v18+ LTS
- **Framework**: NestJS v10.0+
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL v14+, TimescaleDB, Redis v7.0+
- **Message Queue**: Apache Kafka
- **ORM**: Prisma v5.10.2

### Frontend
- **Web**: Next.js v14.2.25, React v18.2.0
- **Mobile**: React Native v0.72.6
- **State Management**: React Query/TanStack Query
- **Styling**: Styled Components v6.0+
- **Charts**: Victory Native, Recharts

### Infrastructure
- **Container**: Docker
- **Orchestration**: Kubernetes (EKS/ECS)
- **IaC**: Terraform
- **Cloud**: AWS
- **CI/CD**: GitHub Actions
- **Monitoring**: Datadog, Sentry

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ LTS
- Yarn v1.22.19+
- Docker and Docker Compose
- PostgreSQL v14+
- Redis v7.0+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/healthcare-super-app.git
cd healthcare-super-app
```

2. Install dependencies:
```bash
# Install root dependencies
yarn install

# Install backend dependencies
cd src/backend
yarn install

# Install frontend dependencies
cd ../web
yarn install
```

3. Set up environment variables:
```bash
# Copy example environment files
cp .env.example .env
# Edit .env with your configuration
```

4. Start infrastructure services:
```bash
docker-compose up -d postgres redis kafka
```

5. Run database migrations:
```bash
cd src/backend
yarn prisma migrate dev
```

## 🛠️ Development

### Backend Development

```bash
# Start all backend services
cd src/backend
yarn dev

# Start specific service
yarn workspace @healthcare/auth-service dev

# Run database studio
yarn prisma studio
```

### Frontend Development

```bash
# Start web application
cd src/web/web
yarn dev

# Start mobile application
cd src/web/mobile
yarn start
```

### Code Quality

```bash
# Run linting
yarn lint

# Run type checking
yarn typecheck

# Format code
yarn format
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run backend tests
cd src/backend
yarn test

# Run e2e tests
yarn test:e2e

# Run with coverage
yarn test:cov
```

## 📦 Deployment

### Local Deployment

```bash
# Build and start with Docker Compose
docker-compose -f docker-compose.yml up --build
```

### Production Deployment

```bash
# Deploy infrastructure
cd infrastructure/terraform
terraform apply

# Deploy services
make deploy-all ENV=production
```

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Guidelines

1. Follow the established code style and conventions
2. Write tests for new features
3. Update documentation as needed
4. Create feature branches from `main`
5. Submit PR with clear description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Technical Documentation](./blitzy/documentation/Technical%20Specifications_a4343085-92fd-4530-8868-0a0afbb37ab7.md)
- [API Documentation](http://localhost:3000/api/docs)
- [Design System Storybook](http://localhost:6006)

## 🏥 About AUSTA

AUSTA SuperApp is committed to making healthcare more accessible, engaging, and effective through innovative technology and user-centered design.

---

Made with ❤️ by the AUSTA Team
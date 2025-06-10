# AUSTA SuperApp - Gamification Service

## Overview

The Gamification Service is a core component of the AUSTA SuperApp, designed to increase user engagement and motivation across all three journey domains: Health ("Minha Saúde"), Care ("Cuidar-me Agora"), and Plan ("Meu Plano & Benefícios").

Key responsibilities include:

- Tracking user actions and progress across all journeys
- Awarding points, badges, and achievements
- Managing user levels and progression
- Providing leaderboards and social comparison
- Triggering notifications for gamification events
- Supporting challenges and goal-based incentives

## Technology Stack

- **Framework**: NestJS v10.0+
- **Database**: PostgreSQL 14+ via Prisma ORM
- **Caching**: Redis for leaderboards and real-time tracking
- **Message Broker**: Kafka for event-driven architecture
- **Analytics**: Time-series storage for metrics and trends
- **Testing**: Jest for unit and integration tests

## Getting Started

### Prerequisites

- Node.js 18.x or later
- Docker and Docker Compose
- PostgreSQL 14+ (can be run via Docker)
- Redis (can be run via Docker)
- Kafka (can be run via Docker)

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd src/backend/gamification-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with appropriate values
   ```

4. Run the service:

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

5. With Docker:

   ```bash
   docker-compose up -d
   ```

## Core Gamification Concepts

The service implements multiple gamification mechanics:

### Points System

- **Experience Points (XP)**: General progression points
- **Journey-Specific Points**: Health Points, Care Points, Plan Points
- **Special/Bonus Points**: For challenges, streaks, or promotional activities

### Achievements & Badges

- **Milestone Achievements**: Based on completing specific actions or reaching thresholds
- **Streak Achievements**: Based on consistent engagement over time
- **Journey Mastery**: Special achievements for completing journey paths
- **Hidden/Easter Egg**: Special discoveries within the app

### Levels & Progression

- **User Levels**: Overall progression through the system
- **Journey Levels**: Separate progression within each journey
- **Benefits Per Level**: Unlocking features or rewards at specific levels

### Challenges & Goals

- **Daily Challenges**: Quick activities to complete each day
- **Weekly Goals**: More substantial objectives spanning multiple days
- **Journey Challenges**: Path-specific objectives
- **Community Challenges**: Group-based activities for social motivation

## Architecture

The Gamification Service follows an event-driven architecture:

```
src/
├── events/                # Event handling and processing
├── points/                # Points management
├── achievements/          # Achievement tracking
├── levels/                # Level progression
├── challenges/            # Challenge management
├── leaderboards/          # Leaderboard functionality
├── rewards/               # Reward management
├── analytics/             # Gamification analytics
├── notifications/         # Gamification notifications
├── config/                # Service configuration
└── common/                # Shared utilities
```

## API Endpoints

### User Gamification Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gamification/profile/:userId` | Get user's gamification profile |
| GET | `/gamification/points/:userId` | Get user's points summary |
| GET | `/gamification/achievements/:userId` | Get user's earned achievements |
| GET | `/gamification/levels/:userId` | Get user's level information |

### Activities and Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/gamification/events` | Record a gamification event |
| GET | `/gamification/events/:userId` | Get user's recent gamification events |
| POST | `/gamification/verify-activity` | Verify a user's claimed activity |

### Challenges and Goals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gamification/challenges/active` | Get active challenges |
| GET | `/gamification/challenges/user/:userId` | Get user's challenge progress |
| POST | `/gamification/challenges/:challengeId/join` | Join a challenge |
| PUT | `/gamification/challenges/:challengeId/progress` | Update challenge progress |

### Leaderboards

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gamification/leaderboards/global` | Get global leaderboard |
| GET | `/gamification/leaderboards/journey/:journeyId` | Get journey-specific leaderboard |
| GET | `/gamification/leaderboards/friends/:userId` | Get friend-based leaderboard |

## Event System

The service processes events from all other services through Kafka topics:

### Health Journey Events

- `health.metric.recorded` - When a health metric is recorded
- `health.goal.created` - When a health goal is set
- `health.goal.progress` - When progress is made toward a health goal
- `health.goal.achieved` - When a health goal is achieved
- `health.device.connected` - When a health device is connected

### Care Journey Events

- `care.appointment.booked` - When an appointment is scheduled
- `care.appointment.completed` - When an appointment is completed
- `care.medication.taken` - When medication is marked as taken
- `care.telemedicine.completed` - When a telemedicine session concludes
- `care.symptom-check.completed` - When a symptom check is completed

### Plan Journey Events

- `plan.claim.submitted` - When an insurance claim is submitted
- `plan.benefit.used` - When a health benefit is used
- `plan.cost-simulation.completed` - When a cost simulation is run
- `plan.insurance-card.viewed` - When digital insurance card is viewed

### General App Events

- `app.login` - Daily login streak tracking
- `app.profile.completed` - Profile completion steps
- `app.survey.completed` - When a feedback survey is completed
- `app.feature.discovered` - When a new feature is used

## Notification Integration

The service sends gamification events to the Notification Service:

- Achievement unlocked
- Level up
- Challenge completed
- Streak milestones
- Leaderboard position changes

## Configuration

Key configuration parameters include:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `PORT` | Service port | 3005 |
| `DATABASE_URL` | PostgreSQL connection string | postgres://postgres:postgres@localhost:5432/gamification |
| `REDIS_URL` | Redis connection string | redis://localhost:6379 |
| `KAFKA_BROKERS` | Kafka brokers list | localhost:9092 |
| `POINTS_MULTIPLIER` | Global points scaling factor | 1.0 |
| `LEADERBOARD_REFRESH_INTERVAL` | How often leaderboards update | 5m |
| `INACTIVE_USER_THRESHOLD_DAYS` | Days before user is considered inactive | 14 |

## Gamification Rules Engine

The service includes a flexible rules engine that allows configuring:

- Points awarded per action
- Requirements for achievements
- Level thresholds
- Challenge criteria
- Streak bonuses
- Special event multipliers

Configuration is stored in the database and can be updated through an admin API.

## Analytics

The service captures analytics data for:

- Event frequency by user and journey
- Point accumulation rates
- Achievement unlock rates
- User engagement patterns
- Level progression speed
- Challenge completion rates

Data is stored in a time-series format and can be exported to external analytics tools.

## Testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:cov
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for contribution guidelines.

## License

Copyright © 2023 AUSTA Health Technologies. All rights reserved.
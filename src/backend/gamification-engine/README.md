# AUSTA SuperApp Gamification Engine

The Gamification Engine is a core service in the AUSTA SuperApp platform that manages all gamification-related functionality across the three main user journeys: Health, Care, and Plan.

## Architecture

The Gamification Engine follows a modular architecture with the following components:

- **Profiles**: Managing user game profiles including level, XP, and achievements
- **Achievements**: Handling unlockable achievements across different journeys
- **Quests**: Managing multi-step challenges for users to complete
- **Rules**: Processing incoming events against configurable rules to award points and achievements
- **Leaderboard**: Generating and caching leaderboards for different journeys
- **Events**: Consuming and producing events to/from Kafka for cross-service integration

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose
- PostgreSQL client (optional, for direct database access)

## Getting Started

### Using the Development Script

The easiest way to get started is to use the development script:

```bash
# Make the script executable (if needed)
chmod +x start-dev.sh

# Start the development environment
./start-dev.sh
```

This script will:

1. Start all required Docker containers (PostgreSQL, Redis, Kafka)
2. Generate the Prisma client
3. Run database migrations
4. Seed the database with sample data
5. Start the service in development mode

### Manual Setup

If you prefer to set up manually:

```bash
# Start infrastructure services
docker-compose -f docker-compose.local.yml up -d

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start the development server
npm run start:dev
```

## Key Components

### Game Profiles

Every user has a game profile that tracks their gamification progress:

- Level: Current user level
- XP: Experience points accumulated
- Achievements: Collection of unlocked achievements

Game profiles are automatically created when a user first interacts with the platform.

### Achievements

Achievements are unlockable rewards that users can earn by completing specific actions:

- Journey-specific achievements (Health, Care, Plan)
- Different difficulty levels
- XP rewards
- Visual badges displayed in the app

### Quests

Quests are multi-step challenges that users can complete:

- Sequential steps to complete
- Progress tracking
- XP rewards upon completion

### Leaderboards

The service generates and caches leaderboards for different journeys:

- Overall leaderboard
- Journey-specific leaderboards
- Different time periods (daily, weekly, monthly)

## API Endpoints

### Profiles

- `GET /api/profiles/:userId` - Get a user's game profile
- `POST /api/profiles` - Create a new game profile
- `PUT /api/profiles/:userId` - Update a user's game profile

### Achievements

- `GET /api/achievements` - List all available achievements
- `GET /api/achievements/:id` - Get a specific achievement
- `GET /api/users/:userId/achievements` - Get a user's achievements
- `POST /api/users/:userId/achievements/:achievementId` - Award an achievement to a user

### Quests

- `GET /api/quests` - List all available quests
- `GET /api/quests/:id` - Get a specific quest
- `GET /api/users/:userId/quests` - Get a user's quests
- `PUT /api/users/:userId/quests/:questId/progress` - Update a user's quest progress

### Leaderboards

- `GET /api/leaderboards/:journey` - Get leaderboard for a specific journey
- `GET /api/leaderboards/:journey/user/:userId` - Get a user's rank in a leaderboard

## Event Processing

The Gamification Engine processes events from other services via Kafka:

- Health events (steps recorded, metrics tracked)
- Care events (appointments booked, medications tracked)
- Plan events (claims submitted, plan details viewed)

These events are processed against rule configurations to award XP and achievements.

## Configuration

Service configuration is managed through environment variables. See `.env` file for available options.

## Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

## Development Guidelines

### Code Style

The project follows the NestJS style guide and uses ESLint and Prettier for code formatting:

```bash
# Format code
npm run format

# Lint code
npm run lint
```

### Adding New Features

When adding new features to the gamification engine:

1. Create necessary entities and DTOs
2. Create services for business logic
3. Create controllers for API endpoints
4. Write unit and integration tests
5. Update documentation

### Working with Prisma

The service uses Prisma for database access:

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Open Prisma Studio to view/edit data
npx prisma studio
```

## Debugging

- Development server runs on port 3005 by default
- Swagger API documentation is available at `/api/docs`
- Prisma Studio provides a visual database editor
- Kafdrop is available on port 9000 for Kafka topic monitoring

## Integration with Other Services

The Gamification Engine integrates with other AUSTA SuperApp services:

- **Auth Service**: User authentication and authorization
- **Health Service**: Receives health journey events
- **Care Service**: Receives care journey events
- **Plan Service**: Receives plan journey events
- **Notification Service**: Sends achievement notifications

## License

This project is proprietary and confidential. Unauthorized copying, transfer, or use is strictly prohibited.

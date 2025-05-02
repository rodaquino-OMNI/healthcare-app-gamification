# Health Service

## Overview

The Health Service manages health-related data and functionality for the AUSTA SuperApp. It provides APIs for storing, retrieving, and processing health metrics, medical history, and related information.

This service is a critical component of the "Minha Saúde" (My Health) journey, enabling users to track their health metrics, view their medical history, and connect wearable devices.

## Functionality

The Health Service provides the following functionalities:

- Stores and retrieves health metrics (e.g., heart rate, blood pressure, sleep data)
- Manages medical history and events
- Integrates with wearable devices to collect health data
- Provides APIs for other services to access health information
- Generates health insights based on collected metrics
- Supports health goal tracking and progress
- Publishes events to the gamification engine when health milestones are achieved
- Enforces data privacy and security for sensitive health information

## Setup Instructions

To set up the Health Service, follow these steps:

1. Install dependencies: `npm install`
2. Configure environment variables (see `.env.example` for required variables)
3. Run database migrations: `npm run migrate`
4. Start the service: `npm run start:dev`

For production deployment:

```bash
npm run build
npm run start:prod
```

## API Endpoints

The Health Service exposes the following API endpoints:

- `GET /health/metrics`: Retrieves health metrics for a user
- `POST /health/metrics`: Creates a new health metric
- `GET /health/history`: Retrieves medical history for a user
- `POST /health/history`: Creates a new medical event
- `GET /devices`: Retrieves connected devices for a user
- `POST /devices`: Connects a new device for a user
- `GET /health/goals`: Retrieves health goals for a user
- `POST /health/goals`: Creates or updates a health goal
- `GET /health/insights`: Retrieves health insights for a user

For detailed API documentation, see the OpenAPI specification at `/docs` when running the service.

## Data Storage

The Health Service uses PostgreSQL as its primary data store. Health metrics are stored in a time-series database (TimescaleDB) for efficient querying and analysis.

Key data models include:
- `HealthMetric`: Time-series data for health measurements
- `MedicalEvent`: Historical medical events and conditions
- `HealthGoal`: User-defined health targets and progress
- `DeviceConnection`: Information about connected wearable devices

## Integration Points

The Health Service integrates with:

- **Gamification Engine**: Publishes events when health metrics are recorded or goals are achieved
- **EHR Systems**: Retrieves medical records using HL7 FHIR standard
- **Wearable Device APIs**: Connects to supported devices for automatic data collection
- **Notification Service**: Triggers health-related notifications and reminders

## Contributing

To contribute to the Health Service, please follow these guidelines:

- Create a new branch for your changes
- Write unit tests for your code
- Follow the established coding standards
- Ensure all tests pass before submitting your changes
- Submit a pull request with a clear description of your changes

## Environment Variables

Required environment variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/health_db
TIMESCALE_URL=postgresql://user:password@localhost:5432/timescale_db
KAFKA_BROKERS=localhost:9092
AUTH_SERVICE_URL=http://localhost:3001
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
PORT=3002
```

## License

Copyright © 2023 AUSTA Health. All rights reserved.
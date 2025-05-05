# AUSTA SuperApp - Care Service

The Care Service is a crucial component of the AUSTA SuperApp's "Care Now Journey," designed to provide immediate healthcare access through a variety of features. This service enables users to receive timely care, manage appointments, track medications, and follow treatment plans.

## Overview

The Care Service handles the following key functionalities within the AUSTA SuperApp:

- **Symptom Checking**: Self-assessment and triage to guide users to appropriate care

- **Appointment Booking**: Search and scheduling with healthcare providers

- **Telemedicine**: Real-time video consultations with healthcare professionals

- **Medication Tracking**: Managing medication schedules with reminders

- **Treatment Plans**: Tracking progress of prescribed treatment plans

## Technology Stack

- **Framework**: NestJS v10.0+

- **Runtime**: Node.js v18.0+ LTS

- **Database**: PostgreSQL v14+ via Prisma ORM

- **Real-time Communication**: Socket.io v4.0+

- **Event Streaming**: Kafka via KafkaJS v2.0+

- **Caching**: Redis v7.0+

- **Monitoring**: OpenTelemetry for distributed tracing

- **Documentation**: OpenAPI/Swagger

## Prerequisites

- Node.js 18.0+

- Docker and Docker Compose

- PostgreSQL 14+

- Redis 7.0+

- Kafka

## Installation

1. Clone the repository

```bash
git clone git@github.com:austa/superapp.git
cd superapp/src/backend/care-service
```markdown

2. Install dependencies
```bash
npm install
```markdown

3. Configure environment variables
```bash
cp .env.example .env

# Edit .env with your configuration

```markdown

4. Run database migrations
```bash
npx prisma migrate dev
```markdown

## Running the Service

### Development Mode

```bash

# Start the service in development mode

npm run start:dev
```markdown

### Production Mode

```bash

# Build the service

npm run build

# Start the service in production mode

npm run start:prod
```markdown

### Docker

```bash

# Build the Docker image

docker build -t austa/care-service .

# Run the service with Docker Compose

docker-compose up -d
```markdown

## API Documentation

Once the service is running, the API documentation is available at:

- Swagger UI: <http://localhost:3002/api/docs>

- OpenAPI JSON: <http://localhost:3002/api/docs-json>

## Integration Points

The Care Service integrates with several other components of the AUSTA SuperApp:

- **Health Service**: For accessing user health records

- **Plan Service**: For insurance verification during appointments

- **Gamification Engine**: For triggering engagement events

- **Notification Service**: For sending reminders and alerts

## Event Publishing

The Care Service publishes the following events to Kafka:

- `appointment.created` - When a new appointment is booked

- `appointment.completed` - When an appointment is completed

- `medication.taken` - When medication is marked as taken

- `telemedicine.completed` - When a telemedicine session ends

- `treatment.progress` - When treatment plan progress is updated

These events are consumed by the Gamification Engine to award points and unlock achievements.

## Testing

```bash

# Run unit tests

npm run test

# Run e2e tests

npm run test:e2e

# Run test coverage

npm run test:cov
```markdown

## Project Structure

```markdown
src/
├── appointments/       # Appointment booking functionality
├── medications/        # Medication tracking functionality
├── providers/          # Provider management functionality
├── symptom-checker/    # Symptom assessment functionality
├── telemedicine/       # Video consultation functionality
├── treatments/         # Treatment plan functionality
├── config/             # Service configuration
├── dto/                # Data transfer objects
├── entities/           # Database entities
├── interfaces/         # TypeScript interfaces
├── main.ts             # Application entry point
└── app.module.ts       # Main application module
```markdown

## Performance Considerations

The Care Service is optimized for:

- Fast appointment availability searches

- Low-latency telemedicine connections

- Real-time medication reminders

- Efficient provider discovery

SLA targets:

- API Response Time: < 150ms

- Telemedicine Connection: < 5s

- Availability: 99.99%

## Deployment

The service is deployed using Kubernetes, with configuration stored in the `k8s/` directory. CI/CD pipelines automatically build, test, and deploy the service on changes to the main branch.

## Monitoring

The service exports metrics, logs, and traces:

- **Metrics**: Exposed on `/metrics` endpoint in Prometheus format

- **Logs**: Structured JSON logs sent to centralized logging

- **Traces**: OpenTelemetry traces sent to Jaeger/Zipkin

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for contribution guidelines.

## License

Copyright © 2023 AUSTA Health Technologies. All rights reserved.

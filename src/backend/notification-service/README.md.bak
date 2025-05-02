# AUSTA SuperApp Notification Service

The AUSTA SuperApp Notification Service is a specialized microservice that delivers user communications across multiple channels with journey-specific formatting and prioritization. This service is responsible for delivering personalized notifications to users based on their preferences and the operational needs of the AUSTA platform.

## Features

- **Multi-channel delivery**: Send notifications via email, SMS, push notifications, and in-app messages
- **Template-based notifications**: Use dynamic templates with personalization capabilities
- **User preferences**: Respect user notification preferences by channel and notification type
- **Journey-specific theming**: Apply visual styling consistent with the Health, Care, and Plan journeys
- **Prioritization**: Intelligent message prioritization to prevent notification fatigue
- **Real-time notifications**: WebSocket-based delivery for immediate in-app notifications
- **Delivery tracking**: Monitor notification delivery status and user interactions
- **Rate limiting**: Prevent notification flooding with configurable rate limits

## Architecture Overview

The Notification Service follows a modular architecture with the following components:

- **Notification Controller**: REST API for sending notifications and querying delivery status
- **Preferences Controller**: Manage user notification preferences
- **Notification Service**: Core business logic for notification processing and routing
- **Channel Services**: Specialized services for each delivery channel (email, SMS, push, in-app)
- **Template Service**: Manages notification templates with personalization capabilities
- **WebSocket Gateway**: Handles real-time in-app notification delivery
- **Preference Service**: Manages user notification preferences

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- Redis (for rate limiting and WebSocket adapter)
- Amazon SES or SMTP server (for email notifications)
- Firebase Cloud Messaging account (for push notifications)
- Twilio account (for SMS notifications)

## Installation

```bash
# Clone the repository (if not already done)
git clone https://github.com/yourusername/austa-superapp.git

# Navigate to the notification service directory
cd austa-superapp/src/backend/notification-service

# Install dependencies
npm install
```

## Configuration

The service uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
# Application
PORT=3003
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/austa_notifications

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRATION=1d

# Email (Amazon SES)
EMAIL_PROVIDER=ses
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
EMAIL_FROM=notifications@austa.com.br

# Push Notifications (Firebase)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=your-phone-number

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

Alternatively, you can use the configuration service that loads values from environment variables, configuration files, or environment-specific sources.

## Running the Service

### Development Mode

```bash
# Run in development mode with hot-reload
npm run start:dev
```

### Production Mode

```bash
# Build the application
npm run build

# Run in production mode
npm run start:prod
```

### Docker Support

```bash
# Build Docker image
docker build -t austa-notification-service .

# Run Docker container
docker run -p 3003:3003 --env-file .env austa-notification-service
```

## API Endpoints

### Notifications API

- `POST /api/notifications` - Send a new notification
- `GET /api/notifications` - Get notifications (with filtering options)
- `GET /api/notifications/:id` - Get notification details by ID
- `GET /api/notifications/status/:id` - Get notification delivery status

### Preferences API

- `GET /api/preferences/:userId` - Get user notification preferences
- `PATCH /api/preferences/:userId` - Update user notification preferences
- `GET /api/preferences/:userId/channels` - Get user's enabled notification channels

## Usage Examples

### Sending a Notification

```typescript
// Example: Send a notification
const notification = {
  userId: '123e4567-e89b-12d3-a456-426614174000',
  templateId: 'appointment-reminder',
  journeyType: 'care',
  priority: 'high',
  data: {
    provider: 'Dr. Silva',
    time: '14:00',
    date: '2023-04-15',
    appointmentId: '5678'
  },
  channels: ['push', 'email', 'in-app']
};

const response = await fetch('http://localhost:3003/api/notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify(notification)
});

const result = await response.json();
console.log(result);
```

### WebSocket Connection for Real-time Notifications

```typescript
// Client-side code to connect to WebSocket for notifications
import { io } from 'socket.io-client';

const socket = io('http://localhost:3003', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

// Listen for notifications
socket.on('notification', (notification) => {
  console.log('New notification received:', notification);
  // Handle the notification in your UI
});

// Subscribe to specific channels
socket.emit('subscribe', { userId: 'user-123' });
```

## Notification Channels

The service supports the following notification channels:

### Email

Uses Amazon SES or SMTP to send email notifications with HTML templates.

### Push Notifications

Uses Firebase Cloud Messaging (FCM) to send push notifications to mobile devices.

### SMS

Uses Twilio to send SMS notifications for critical alerts and time-sensitive information.

### In-App Notifications

Uses WebSockets to deliver real-time notifications within the application.

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run test coverage
npm run test:cov
```

## Design Considerations

- **Journey Context**: Notifications include journey context (health, care, plan) for consistent theming
- **Prioritization**: Critical notifications (like care reminders) are prioritized over informational messages
- **User Control**: Users have granular control over notification preferences by type and channel
- **Delivery Guarantees**: Critical notifications use multiple channels with delivery confirmation
- **Compliance**: All communications comply with LGPD (Brazilian General Data Protection Law)

## License

Copyright (c) 2023 AUSTA SuperApp. All rights reserved.
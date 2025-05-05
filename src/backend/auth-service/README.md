# AUSTA SuperApp - Authentication Service

## Overview

The Authentication Service is a critical component of the AUSTA SuperApp that manages user identity, authentication, and authorization. It provides secure access controls across all three journey domains: Health ("Minha Saúde"), Care ("Cuidar-me Agora"), and Plan ("Meu Plano & Benefícios").

Key responsibilities include:

- User registration and profile management

- Secure authentication with multiple factors

- Role-based access control with journey-specific permissions

- OAuth 2.0 integration with external identity providers

- JWT token issuance and validation

- Session management and security enforcement

## Technology Stack

- **Framework**: NestJS v10.0+

- **Database**: PostgreSQL 14+ via Prisma ORM

- **Authentication**: Passport.js with JWT, OAuth 2.0, and Local strategies

- **Caching**: Redis for token blacklisting and rate limiting

- **Message Broker**: Kafka for event distribution

- **Security**: bcrypt for password hashing, helmet for HTTP security

- **Testing**: Jest for unit and e2e tests

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
   cd src/backend/auth-service
   ```markdown

2. Install dependencies:

   ```bash
   npm install
   ```markdown

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with appropriate values
   ```markdown

4. Run the service:

   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```markdown

5. With Docker:

   ```bash
   docker-compose up -d
   ```markdown

## Configuration

The service uses a tiered configuration approach with environment-specific values. Configuration is managed in `src/config/configuration.ts` and validated with Joi schema in `src/config/validation.schema.ts`.

Key configuration parameters include:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `PORT` | Service port | 3001 |
| `DATABASE_URL` | PostgreSQL connection string | postgres://postgres:postgres@localhost:5432/auth |
| `JWT_SECRET` | Secret for signing JWTs | [generated in production] |
| `JWT_EXPIRATION` | Token expiration time | 1h |
| `REFRESH_TOKEN_EXPIRATION` | Refresh token expiration | 7d |
| `REDIS_URL` | Redis connection string | redis://localhost:6379 |
| `KAFKA_BROKERS` | Kafka brokers list | localhost:9092 |
| `OAUTH_PROVIDERS` | OAuth provider configurations | [see .env.example] |

## Architecture

The Auth Service is designed as a microservice with clear boundaries and responsibilities:

```markdown
src/
├── auth/                  # Core authentication logic
│   ├── controllers/       # API endpoints
│   ├── decorators/        # Custom decorators (@CurrentUser, @Roles)
│   ├── dto/               # Data transfer objects
│   ├── guards/            # Route protection (JWT, Roles)
│   ├── strategies/        # Passport authentication strategies
│   └── services/          # Authentication business logic
├── users/                 # User management
├── roles/                 # Role definitions
├── permissions/           # Permission management
├── config/                # Service configuration
└── common/                # Shared utilities
```markdown

## API Endpoints

### Authentication

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| POST | `/auth/login` | User login | `{ email, password }` | `{ access_token, refresh_token, user }` |
| POST | `/auth/register` | User registration | `CreateUserDto` | `{ access_token, refresh_token, user }` |
| POST | `/auth/refresh` | Refresh access token | `{ refresh_token }` | `{ access_token }` |
| POST | `/auth/logout` | User logout | `{ refresh_token }` | `{ success: true }` |
| GET | `/auth/profile` | Get user profile | - | User object |
| GET | `/auth/oauth/:provider` | OAuth login redirect | - | Redirects to provider |
| GET | `/auth/oauth/:provider/callback` | OAuth callback | - | `{ access_token, refresh_token, user }` |

### Users

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/users` | Get all users (admin) | - | Array of users |
| GET | `/users/:id` | Get user by ID | - | User object |
| PATCH | `/users/:id` | Update user | `UpdateUserDto` | Updated user |
| DELETE | `/users/:id` | Delete user | - | `{ success: true }` |

### Roles and Permissions

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|-------------|----------|
| GET | `/roles` | Get all roles | - | Array of roles |
| POST | `/roles` | Create role | Role object | Created role |
| GET | `/permissions` | Get all permissions | - | Array of permissions |
| POST | `/permissions` | Create permission | Permission object | Created permission |

## Authentication Flows

### Password Authentication

1. User submits email/password to `/auth/login`
2. Service validates credentials using `LocalStrategy`
3. On success, generates JWT access token and refresh token
4. Returns tokens and user information to client

### OAuth Authentication

1. User initiates OAuth flow via `/auth/oauth/:provider`
2. Service redirects to identity provider
3. User authenticates with provider
4. Provider redirects back to callback URL
5. Service validates response using appropriate `OAuthStrategy`
6. Creates or updates user record based on provider data
7. Generates tokens and returns to client

### Multi-Factor Authentication (MFA)

1. User completes primary authentication
2. Service checks if MFA is required for user
3. If required, returns temporary token and MFA challenge
4. User submits MFA code to `/auth/mfa/verify`
5. On successful verification, service issues full access token

### Token Refresh

1. When access token expires, client submits refresh token to `/auth/refresh`
2. Service validates refresh token and issues new access token
3. Optionally rotates refresh token for enhanced security

## Authorization Model

The service implements a comprehensive RBAC system with journey-specific permissions:

1. **Roles**: Named collections of permissions (e.g., "User", "Admin", "Provider")
2. **Permissions**: Specific access rights in format `<journey>:<resource>:<action>`
3. **Journey Context**: Permissions are scoped to specific journeys ("health", "care", "plan")

Example permissions:

- `health:metrics:read` - Can view health metrics

- `care:appointment:create` - Can create appointments

- `plan:claim:submit` - Can submit insurance claims

Permissions are enforced using the `@Roles()` decorator and `RolesGuard`.

## Integration with Other Services

The Auth Service integrates with other AUSTA SuperApp components through:

1. **API Gateway**: Validates tokens and forwards authentication context
2. **Event Publishing**: Emits events on user creation, updates, or status changes
3. **Service-to-Service Authentication**: Provides mechanisms for secure inter-service communication

### Event Schema

```typescript
interface UserEvent {
  eventType: 'created' | 'updated' | 'deleted' | 'locked' | 'unlocked';
  userId: string;
  timestamp: Date;
  payload: {
    user: UserDto;
    changedBy?: string;
  };
}
```markdown

## Testing

### Unit Tests

```bash

# Run all unit tests

npm run test

# Run with coverage

npm run test:cov
```markdown

### End-to-End Tests

```bash

# Run all e2e tests

npm run test:e2e

# Run specific test file

npm run test:e2e -- auth.e2e-spec.ts
```markdown

### Test Environment Setup

The e2e tests use an in-memory database and mock external services. Configuration is in `test/jest-e2e.json`.

## Security Considerations

- All passwords are hashed using bcrypt with appropriate cost factor

- JWTs are signed with RS256 algorithm in production

- Tokens include appropriate claims (iss, aud, exp, nbf)

- Session management includes token revocation capabilities

- Rate limiting is applied to sensitive endpoints

- Security headers are applied using Helmet

- Input validation using class-validator and Joi

## Troubleshooting

Common issues and solutions:

1. **Database connection errors**: Verify DATABASE_URL and that PostgreSQL is running
2. **Token validation failures**: Check JWT_SECRET consistency across services
3. **Rate limiting issues**: Adjust Redis configuration and rate limit settings
4. **OAuth integration problems**: Verify callback URLs and provider credentials

## Development Guidelines

1. Follow NestJS best practices for module organization
2. Use dependency injection for all services
3. Implement comprehensive input validation
4. Write unit tests for all business logic
5. Document all public interfaces with JSDoc comments
6. Follow semantic versioning for API changes

## Contributing

1. Create a feature branch from `develop`
2. Implement changes with appropriate tests
3. Run linting and formatting checks (`npm run lint`)
4. Submit a pull request with detailed description
5. Ensure CI pipeline passes

## License

Copyright © 2023 AUSTA Health Technologies. All rights reserved.

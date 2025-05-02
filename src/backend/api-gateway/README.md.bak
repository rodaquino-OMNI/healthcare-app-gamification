# API Gateway Service

This service acts as the entry point for all client requests, routing them to the appropriate backend services. It also handles authentication, authorization, and rate limiting.

## Configuration

The service is configured using environment variables. See `.env.example` for a list of required variables.

## Endpoints

- `/graphql`: GraphQL endpoint for all client requests
- `/rest/*`: REST endpoints for external system integrations
- `/ws/*`: WebSocket endpoints for real-time communication

## Middleware

The following middleware is used:

- `AuthMiddleware`: Authenticates and authorizes requests
- `LoggingMiddleware`: Logs all requests
- `RateLimitMiddleware`: Limits the number of requests per client

## Technologies

- Node.js
- NestJS
- GraphQL
- Apollo Server
- Redis

## Deployment

The service is deployed as a Docker container to AWS ECS.
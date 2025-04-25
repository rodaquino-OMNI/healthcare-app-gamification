# Plan Service

The Plan Service manages insurance-related features including coverage information, digital insurance card, claims submission and tracking, cost simulator, and benefits showcase.

## Description

This service provides endpoints for managing user insurance plans, coverage details, claims, and benefits. It integrates with external insurance systems and payment processors to provide a seamless experience for users to manage their insurance plans.

## Features

- Coverage Information: Display detailed insurance coverage information.
- Digital Insurance Card: Provide a digital version of the insurance card with relevant details.
- Claims Submission: Allow users to submit insurance claims with required documentation.
- Claims Tracking: Enable users to track the status of submitted claims.
- Cost Simulator: Calculate estimated costs for procedures based on coverage.
- Benefits Showcase: Display available benefits and usage.

## Technical Stack

- Node.js
- NestJS
- PostgreSQL
- Prisma
- Docker

## Setup Instructions

1.  Clone the repository.
2.  Install dependencies using `npm install`.
3.  Configure the database connection in `src/config/configuration.ts`.
4.  Run database migrations using `prisma migrate deploy`.
5.  Start the service using `npm run start:dev`.

## Endpoints

- `GET /plans`: Retrieve user insurance plans.
- `GET /plans/:id`: Retrieve a specific insurance plan.
- `GET /coverage`: Retrieve coverage details for a plan.
- `POST /claims`: Submit an insurance claim.
- `GET /claims/:id`: Retrieve a specific insurance claim.
- `GET /benefits`: Retrieve available benefits for a plan.
- `POST /cost-simulator`: Simulate costs for a procedure.

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the LICENSE file for details
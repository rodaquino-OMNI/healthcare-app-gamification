# AUSTA SuperApp

AUSTA SuperApp is a unified digital health platform designed to transform healthcare delivery through a journey-centered approach with gamification at its core. The platform consolidates multiple healthcare functions into three intuitive user journeys: "Minha Saúde" (My Health), "Cuidar-me Agora" (Care Now), and "Meu Plano & Benefícios" (My Plan & Benefits).

## Introduction

The AUSTA SuperApp addresses the fragmentation and complexity in current healthcare digital experiences by providing a cohesive platform that aligns with how users naturally think about their healthcare needs.

### Business Problems Addressed:
- Fragmented healthcare digital experiences
- Low digital adoption and adherence
- Complex user interfaces causing friction
- Disconnected health data

### Solution Approach:
- Journey-centered design with gamification
- Simplified architecture with consistent UX
- Unified design system with journey color-coding
- Integrated data architecture

### Value Proposition:
- Improved user engagement and health outcomes
- Reduced operational costs and improved efficiency
- Enhanced user satisfaction and retention
- Better clinical decision-making

The AUSTA SuperApp is built with a simplified technology stack centered around React Native, Next.js, Node.js, and PostgreSQL. The system architecture follows a modular microservices approach organized around the three core user journeys.

## Technical Specifications

For comprehensive technical details, refer to the [Technical Specifications](./docs/technical-specifications.md) document, which includes:

- Detailed system architecture
- Feature catalog and functional requirements
- API design and integration patterns
- Database schema and data flow
- Frontend component library
- Security architecture and compliance considerations
- Infrastructure and deployment strategy
- Testing approach and quality metrics

## Getting Started

### Prerequisites

- Node.js (v18.x or later)
- Yarn package manager
- Docker and Docker Compose
- AWS CLI (for deployment)

### Development Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/austa-superapp.git
   cd austa-superapp
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env file with appropriate values
   ```

4. Start the development environment:
   ```bash
   docker-compose up -d
   yarn dev
   ```

5. Access the application:
   - Mobile app: Open the project in Expo or your preferred emulator
   - Web app: Navigate to http://localhost:3000

### Building for Production

1. Build the application:
   ```bash
   yarn build
   ```

2. Run production build locally:
   ```bash
   yarn start
   ```

3. Deploy to AWS (requires proper credentials and configuration):
   ```bash
   yarn deploy
   ```

## Project Structure

The project follows a journey-centered architecture with the following structure:

```
austa-superapp/
├── apps/
│   ├── mobile/          # React Native mobile application
│   └── web/             # Next.js web application
├── packages/
│   ├── api/             # API client and types
│   ├── auth/            # Authentication utilities
│   ├── components/      # Shared UI components
│   ├── config/          # Configuration utilities
│   ├── design-system/   # Design system and tokens
│   ├── gamification/    # Gamification utilities
│   └── utils/           # Shared utilities
├── services/
│   ├── api-gateway/     # API Gateway service
│   ├── auth-service/    # Authentication service
│   ├── health-service/  # My Health journey service
│   ├── care-service/    # Care Now journey service
│   ├── plan-service/    # My Plan & Benefits journey service
│   └── game-service/    # Gamification Engine service
├── infrastructure/      # Terraform IaC
└── docs/                # Project documentation
```

Each journey service contains the following structure:

```
journey-service/
├── src/
│   ├── api/             # API controllers/resolvers
│   ├── domain/          # Domain models and business logic
│   ├── infrastructure/  # External dependencies and adapters
│   ├── application/     # Use cases and application services
│   └── config/          # Service configuration
├── test/                # Test files
├── Dockerfile           # Container definition
└── package.json         # Dependencies
```

## Contributing

We welcome contributions to the AUSTA SuperApp project! Please follow these guidelines:

### Code Style

- Follow the project's coding standards
- Use TypeScript for type safety
- Follow the journey-centered architecture
- Write tests for new features

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Create a new Pull Request

### Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the user experience and journey-centered design
- Consider security and privacy in all contributions

## License

This project is licensed under the [MIT License](LICENSE).
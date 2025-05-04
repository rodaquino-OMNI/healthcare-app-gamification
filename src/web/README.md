# AUSTA SuperApp Web Component

This directory contains the source code for the web component of the AUSTA SuperApp, including both the web application (Next.js) and mobile application (React Native) with shared code and design system.

## Architecture

The web component follows a journey-centered architecture with the following key components:

- **Shared**: Common code, types, and utilities shared between web and mobile

- **Design System**: Unified component library with journey-specific theming

- **Mobile**: React Native application for iOS and Android

- **Web**: Next.js application for browser-based access

This architecture enables code reuse while maintaining platform-specific optimizations and a consistent user experience across all platforms.

## Directory Structure

```markdown
src/web/
├── shared/            # Shared code between web and mobile

│   ├── types/         # TypeScript type definitions

│   ├── constants/     # Shared constants

│   ├── utils/         # Utility functions

│   ├── graphql/       # GraphQL queries and mutations

│   └── config/        # Shared configuration

├── design-system/     # UI component library

│   ├── src/           # Component source code

│   ├── storybook/     # Component documentation

│   └── tests/         # Component tests

├── mobile/           # React Native mobile application

│   ├── src/           # Application source code

│   ├── android/       # Android-specific code

│   └── ios/           # iOS-specific code

├── web/              # Next.js web application

│   ├── src/           # Application source code

│   ├── public/        # Static assets

│   └── pages/         # Next.js pages

├── package.json      # Root package.json for workspace

├── tsconfig.json     # TypeScript configuration

└── README.md         # This file
```

## Getting Started

### Prerequisites

- Node.js 16+

- Yarn

- For mobile development: Android Studio and/or Xcode

### Installation

```bash
# Install dependencies
cd src/web
yarn install

# Set up environment variables
cp .env.example .env.local
```

### Development

```bash
# Start the web application
cd src/web
yarn web:dev

# Start the mobile application
cd src/web
yarn mobile:start

# Run the design system storybook
cd src/web
yarn design-system:storybook
```

## Journey Implementation

The AUSTA SuperApp implements three core user journeys across both web and mobile platforms:

1. **My Health (Minha Saúde)**

   - Health metrics dashboard with visualization
   - Medical history timeline
   - Health goals tracking
   - Device connections management

2. **Care Now (Cuidar-me Agora)**

   - Symptom checker
   - Appointment booking
   - Telemedicine sessions
   - Medication tracking

3. **My Plan & Benefits (Meu Plano & Benefícios)**

   - Coverage information
   - Digital insurance card
   - Claims submission and tracking
   - Cost simulator

Each journey has a distinct visual identity while maintaining consistency through the shared design system.

## Gamification Integration

The gamification engine is integrated across all journeys to enhance user engagement:

- Achievement badges and notifications

- Progress tracking for health goals

- XP and level system

- Rewards for completing actions

Gamification components are part of the design system and can be used in both web and mobile applications.

## Internationalization

The application supports multiple languages, with Brazilian Portuguese as the primary language:

- Translation files are stored in the `src/web/shared/i18n` directory

- The `i18next` library is used for translation management

- Date, number, and currency formatting is handled through locale-specific formatters

## Testing

The project uses the following testing approach:

- **Unit Tests**: Jest and React Testing Library

- **Component Tests**: Storybook and Chromatic

- **E2E Tests**: Cypress (web) and Detox (mobile)

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage
```

## Deployment

The applications are deployed using CI/CD pipelines:

- **Web**: Containerized with Docker and deployed to AWS ECS

- **Mobile**: Built using Expo EAS and deployed to app stores

Deployment configurations are managed in the `.github/workflows` directory.

## Contributing

Please refer to the project's `CONTRIBUTING.md` file for guidelines on contributing to the web component.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

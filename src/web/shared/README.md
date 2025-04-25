# AUSTA SuperApp Shared Code

## Overview

The `src/web/shared` directory is a central repository for code, types, constants, utilities, and configurations that are shared between the web (Next.js) and mobile (React Native) frontends of the AUSTA SuperApp. This approach promotes code reuse, reduces redundancy, and ensures a consistent experience across different platforms.

## Directory Structure

The `src/web/shared` directory is organized as follows:

- `types`: TypeScript type definitions shared between the web and mobile frontends.
- `constants`: JavaScript constants used across both web and mobile applications.
- `utils`: Utility functions for data formatting, validation, and other common tasks.
- `graphql`: GraphQL queries, mutations, and fragments used to interact with the backend API.
- `config`: Configuration settings for the shared code, such as API endpoints and internationalization settings.

## Key Components

The following are key components within the `src/web/shared` directory:

- `types/index.ts`: Exports all shared types for use throughout the AUSTA SuperApp.
- `constants/index.ts`: Exports constants related to API endpoints, journeys, and routes.
- `utils/index.ts`: Exports utility functions for formatting data, handling dates, and validating user input.
- `graphql/index.ts`: Exports GraphQL queries, mutations, and fragments for fetching and manipulating data.
- `config/index.ts`: Exports configuration settings for the shared code, such as API endpoints and internationalization settings.

## Usage

To use the shared code in a web or mobile component, import the desired module or function from the appropriate file within the `src/web/shared` directory. For example:

```typescript
import { formatCurrency } from 'src/web/shared/utils';
import { API_BASE_URL } from 'src/web/shared/constants';
import { HealthMetric } from 'src/web/shared/types';
```

## Benefits

The `src/web/shared` directory provides several benefits:

- **Code Reuse**: Reduces code duplication by sharing common code between the web and mobile frontends.
- **Consistency**: Ensures a consistent user experience across platforms by using the same types, constants, and utilities.
- **Maintainability**: Simplifies maintenance by centralizing code in a single location.
- **Testability**: Improves testability by providing a clear separation of concerns.
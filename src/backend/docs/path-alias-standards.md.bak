# TypeScript Path Alias Coding Standards

## Overview

This document establishes the coding standards for TypeScript path aliases in our Healthcare Super-APP monorepo. Consistent use of path aliases improves code readability, maintainability, and helps avoid path-related errors across our microservices architecture.

## Path Alias Definitions

Our project uses the following path aliases defined in the root `tsconfig.json`:

| Path Alias | Directory Mapping | Purpose |
|------------|-------------------|---------|
| `@shared/*` | `shared/src/*` | Common utilities, services, and DTOs shared across microservices |
| `@gamification/*` | `gamification-engine/src/*` | Gamification engine specific modules |
| `@prisma/*` | `shared/prisma/*` | Prisma schema and generated client code |

## Usage Guidelines

### When to Use Path Aliases

1. **Always use path aliases for cross-module imports**
   ```typescript
   // CORRECT: Using path alias for importing from shared module
   import { LoggerService } from '@shared/logging/logger.service';
   
   // INCORRECT: Using relative path
   import { LoggerService } from '../../shared/src/logging/logger.service';
   ```

2. **Use relative imports only for files within the same module**
   ```typescript
   // CORRECT: Using relative import within the same module
   import { AppConfig } from './config/app.config';
   ```

### Path Alias Best Practices

1. **Keep imports organized by alias type**
   ```typescript
   // External libraries first
   import { Injectable } from '@nestjs/common';
   
   // Then shared modules
   import { LoggerService } from '@shared/logging/logger.service';
   
   // Then service-specific imports
   import { AppConfig } from './config/app.config';
   ```

2. **Avoid deep nested imports when possible**
   ```typescript
   // PREFER: Create barrel files in shared modules
   import { LoggerService, KafkaService } from '@shared/services';
   
   // INSTEAD OF:
   import { LoggerService } from '@shared/logging/logger.service';
   import { KafkaService } from '@shared/kafka/kafka.service';
   ```

3. **Never use absolute paths starting with `src/`**
   ```typescript
   // INCORRECT: Using src-based paths
   import { LoggerService } from 'src/backend/shared/src/logging/logger.service';
   ```

## Runtime Path Resolution

For path aliases to work at runtime (not just during TypeScript compilation), we use the following approaches:

### During Development

Add `-r tsconfig-paths/register` to the Node.js command:

```json
// In package.json scripts
"scripts": {
  "start:dev": "nest start --watch -r tsconfig-paths/register",
  "start:debug": "nest start --debug --watch -r tsconfig-paths/register"
}
```

### For Production

For production builds, paths are resolved during compilation to JavaScript with proper relative paths.

## Troubleshooting Path Resolution

If you encounter issues with path resolution:

1. Verify file existence using the verification script:
   ```bash
   node verify-paths-simple.js
   ```

2. Check that your IDE's TypeScript server has reloaded the configuration

3. For runtime errors, verify that `tsconfig-paths/register` is included in your start scripts

4. If adding new shared modules, ensure they follow the established directory structure

## Adding New Path Aliases

When adding new path aliases:

1. Update the root `tsconfig.json` file
2. Document the new alias in this guide
3. Announce the addition to the team
4. Run the verification script to ensure the paths are correctly configured

## Enforcing These Standards

These standards are enforced through:

1. Code reviews
2. ESLint rules (see `.eslintrc.js` for import path rules)
3. Automated verification during CI/CD pipeline

By adhering to these path alias standards, we ensure consistent, maintainable, and error-free imports across our monorepo architecture.
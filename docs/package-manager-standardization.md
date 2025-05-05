# Package Manager Standardization & Dependency Management Guide

This document outlines the standard approach to dependency management in the AUSTA SuperApp monorepo.

## Overview

The AUSTA SuperApp uses a structured approach to dependency management across multiple services and packages to ensure consistency, security, and maintainability.

## Tools & Scripts

The following tools and scripts are available to assist with dependency management:

| Script | Purpose | Usage |
|--------|---------|-------|
| `validate-package-json.js` | Validates package.json files for consistency and security issues | `node scripts/validate-package-json.js` |
| `fix-common-dependencies.js` | Automatically fixes common dependency issues | `node scripts/fix-common-dependencies.js` |
| `setup-path-aliases.js` | Configures TypeScript path aliases across the project | `node scripts/setup-path-aliases.js` |
| `fix-imports.js` | Converts relative imports to path alias imports | `node scripts/fix-imports.js` |
| `apply-security-patches.js` | Applies security patches to vulnerable dependencies | `node scripts/apply-security-patches.js` |
| `generate-security-report.js` | Generates a report of security vulnerabilities | `node scripts/generate-security-report.js` |

## Package Manager Standardization

### Yarn as the Standard Package Manager

The AUSTA SuperApp uses Yarn exclusively as its package manager. This ensures consistent dependency resolution and installation across all environments.

### Key Conventions

1. **Always use `yarn` commands, never `npm`**

   ```bash
   # Correct
   yarn add package-name
   
   # Incorrect
   npm install package-name
   ```

2. **Use exact versions for critical dependencies**

   ```json
   "dependencies": {
     "react": "18.2.0",
     "react-dom": "18.2.0"
   }
   ```

3. **Use the root workspace for global dependency management**
   - Common dependencies are specified in the root package.json
   - Use resolutions and overrides to enforce version consistency

## Path Aliases

The project uses TypeScript path aliases to simplify imports across the monorepo:

| Alias | Path |
|-------|------|
| `@shared/*` | `src/web/shared/*` |
| `@app/shared/*` | `src/backend/shared/src/*` |
| `@app/gamification/*` | `src/backend/gamification-engine/src/*` |
| `@app/health/*` | `src/backend/health-service/src/*` |
| `@app/care/*` | `src/backend/care-service/src/*` |
| `@app/plan/*` | `src/backend/plan-service/src/*` |
| `@app/auth/*` | `src/backend/auth-service/src/*` |
| `@app/notifications/*` | `src/backend/notification-service/src/*` |
| `@design-system/*` | `src/web/design-system/*` |

### Example Usage

```typescript
// Instead of this (relative import):
import { UserProfile } from '../../../../shared/types/user';

// Use this (path alias):
import { UserProfile } from '@shared/types/user';
```

## Adding New Dependencies

When adding new dependencies, follow these steps:

1. **Check if the dependency already exists elsewhere in the monorepo**

   ```bash
   yarn why package-name
   ```

2. **Add to the appropriate package**

   ```bash
   cd path/to/package
   yarn add package-name
   ```

3. **For shared dependencies, add to the root package.json**

   ```bash
   # At the root directory
   yarn add package-name -W
   ```

4. **Validate dependency consistency**

   ```bash
   node scripts/validate-package-json.js
   ```

## Handling Version Conflicts

When version conflicts arise:

1. **Use the root-level resolutions**

   ```json
   "resolutions": {
     "package-name": "1.2.3"
   }
   ```

2. **Use overrides for security fixes**

   ```json
   "overrides": {
     "vulnerable-package": "1.2.3"
   }
   ```

3. **Run fix-common-dependencies.js** to automatically resolve common issues

   ```bash
   node scripts/fix-common-dependencies.js
   ```

## Security Vulnerability Management

### Automated Security Checks

The project uses several methods to identify and fix security issues:

1. **Dependabot alerts** - GitHub's automated security alerts
2. **yarn audit** - Regular auditing through CI/CD
3. **Security patching** - Automatic application of security patches

### Manual Security Checks

Run this command to generate a comprehensive security report:

```bash
yarn security:report
```

### Applying Security Patches

Security patches can be applied to vulnerable dependencies without breaking changes:

```bash
yarn postinstall
# or
node scripts/apply-security-patches.js
```

## Journey-Specific Dependency Management

Each journey (Health, Care, Plan) has its own package and dependency structure. When adding journey-specific dependencies:

1. Add them directly to the journey's package.json
2. Ensure the dependency doesn't conflict with shared dependencies
3. Use the appropriate path alias for imports

## Troubleshooting

### Common Issues and Solutions

#### Duplicate React/React Native versions

```bash
# Check for duplicate React installations
yarn why react

# Fix by running
node scripts/fix-common-dependencies.js
```

**Path resolution errors**

```bash
# Fix TypeScript path aliases
node scripts/setup-path-aliases.js

# Fix relative imports
node scripts/fix-imports.js
```

**Dependency resolution errors during install**

```bash
# Clear Yarn cache
yarn cache clean

# Reinstall dependencies
yarn install
```

**Security vulnerabilities**

```bash
# Generate security report
node scripts/generate-security-report.js

# Apply security patches
node scripts/apply-security-patches.js
```

## Best Practices

1. **Never use `latest` as a version** - Always specify exact versions or appropriate ranges
2. **Keep the dependency tree as flat as possible** - Use shared dependencies from the root when appropriate
3. **Regularly update dependencies** - Schedule regular updates of non-breaking dependency versions
4. **Use lockfiles** - Always commit yarn.lock to ensure consistent installations
5. **Test after dependency changes** - Always run tests after updating dependencies

## For CI/CD Environments

In CI/CD environments, use these commands to ensure a clean, secure installation:

```bash
# Fresh install without using cache
yarn install --frozen-lockfile

# Apply security patches
node scripts/apply-security-patches.js

# Validate dependencies
node scripts/validate-package-json.js
```

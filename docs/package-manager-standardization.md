# Package Manager Standardization

This document outlines the standardized approach to dependency management in the AUSTA SuperApp project.

## Package Manager

**Yarn** is the official package manager for this project. All dependency operations should be performed using Yarn.

```bash

# Installing dependencies (correct)

yarn install

# Adding a dependency (correct)

yarn add package-name

# Adding a dev dependency (correct)

yarn add --dev package-name

# DO NOT use npm for dependency management

# npm install  # incorrect

# npm add      # incorrect

```markdown

## Dependency Specification Guidelines

### ✅ Correct Package Naming

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "yup": "^1.3.3",
    "zod": "^3.22.4"
  }
}
```markdown

### ❌ Incorrect Package Naming

```json
{
  "dependencies": {
    "@hookform/resolvers/yup": "latest",
    "@hookform/resolvers/zod": "3.0.0"
  }
}
```markdown

## Version Resolution

For managing React version conflicts, we use Yarn's resolutions field:

```json
{
  "resolutions": {
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-test-renderer": "18.2.0"
  }
}
```markdown

## CI/CD Integration

Our CI pipeline has been updated to validate dependency specifications and ensure consistent package manager usage across all build environments.

## Troubleshooting Common Issues

- If you encounter "Invalid package name" errors, check for incorrectly nested package paths

- For React version conflicts, ensure the resolutions field is properly configured

- When working with workspaces, use the `-W` flag for root dependencies: `yarn add -W package-name`

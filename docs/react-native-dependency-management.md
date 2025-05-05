# React Native Dependency Management Guide

## Overview

This guide outlines our strategy for managing React Native dependencies and provides guidelines for maintaining compatibility while preparing for future upgrades.

## Current Approach

Instead of immediately upgrading React Native (which requires significant testing and can disrupt development), we've implemented a future-proofing strategy that:

1. Identifies and resolves dependency conflicts
2. Ensures consistent versioning across the project
3. Replaces deprecated packages with their modern equivalents
4. Prepares the codebase for a smooth upgrade path

## Available Tools

We've created several utility scripts to help manage React Native dependencies:

### 1. Dependency Analysis Tool

The `check-rn-dependencies.js` script analyzes all React Native dependencies across the project and generates a detailed report:

```bash
# Basic usage
node scripts/check-rn-dependencies.js

# Target a specific React Native version for compatibility analysis
node scripts/check-rn-dependencies.js --target=0.74.0

# Save the report to a specific file
node scripts/check-rn-dependencies.js --report-file=rn-dependency-report.json

# Show more detailed information
node scripts/check-rn-dependencies.js --verbose
```

This tool helps identify:
- Version conflicts between packages
- Outdated dependencies that need updating
- Deprecated Babel plugins that should be replaced
- Compatibility issues for future React Native versions

### 2. Dependency Fix Tool

The `fix-rn-dependencies.js` script helps resolve common dependency issues:

```bash
# Preview changes without applying them
node scripts/fix-rn-dependencies.js --dry-run

# Fix only Babel plugin transformation issues
node scripts/fix-rn-dependencies.js --babel-only

# Prepare for a specific React Native version
node scripts/fix-rn-dependencies.js --target=0.73.0
```

This tool performs the following tasks:
- Standardizes versions of key React Native dependencies
- Replaces deprecated Babel plugins with their transform equivalents
- Updates overrides and resolutions in package.json files

## Best Practices for Dependency Management

### 1. Always Use Resolutions and Overrides

When adding new React Native dependencies, always ensure they're properly referenced in the `resolutions` and `overrides` sections of package.json:

```json
"resolutions": {
  "react": "18.2.0",
  "react-native": "0.72.6",
  "react-native-webview": "13.13.5"
}
```

### 2. Replace Deprecated Babel Plugins

Use the transform equivalents for all Babel plugins:

| Deprecated Plugin | Modern Replacement |
|-------------------|-------------------|
| @babel/plugin-proposal-class-properties | @babel/plugin-transform-class-properties |
| @babel/plugin-proposal-nullish-coalescing-operator | @babel/plugin-transform-nullish-coalescing-operator |
| @babel/plugin-proposal-optional-chaining | @babel/plugin-transform-optional-chaining |
| @babel/plugin-proposal-numeric-separator | @babel/plugin-transform-numeric-separator |

### 3. Regularly Check for Updates

Run the dependency analysis tool regularly to catch new issues:

```bash
# Add this as a pre-commit hook or CI step
node scripts/check-rn-dependencies.js
```

### 4. Test Compatibility Before Upgrading

Before embarking on a full React Native upgrade:

```bash
# Check compatibility with target version
node scripts/check-rn-dependencies.js --target=0.74.0 --verbose
```

## Future Upgrade Path

When we're ready for a full React Native upgrade:

1. Run the dependency analysis tool with the target version
2. Address all compatibility issues highlighted in the report
3. Update native code as required by the React Native upgrade guide
4. Test extensively across all supported platforms

## Common Issues and Solutions

### Dependency Version Conflicts

If you see warnings about conflicting versions:

```
Dependency X has version conflict: v1.2.3 vs v2.0.0
```

Run the fix script to standardize versions:

```bash
node scripts/fix-rn-dependencies.js
```

### Babel Plugin Deprecations

If you see warnings about deprecated Babel plugins:

```
@babel/plugin-proposal-class-properties is deprecated
```

Use the Babel-specific fix:

```bash
node scripts/fix-rn-dependencies.js --babel-only
```

### Metro Configuration Issues

If you encounter Metro bundler issues:

1. Check the [Metro configuration documentation](https://facebook.github.io/metro/docs/configuration/)
2. Ensure your config matches the React Native version in use
3. Consider using the `--reset-cache` flag when running Metro

## Further Reading

- [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/)
- [React Native Releases](https://github.com/facebook/react-native/releases)
- [Metro Bundler Documentation](https://facebook.github.io/metro/)
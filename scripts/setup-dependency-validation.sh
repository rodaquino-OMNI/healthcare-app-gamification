#!/bin/bash

# AUSTA SuperApp Dependency Validation Setup
# This script sets up tools and configurations for dependency management

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🔧 Setting up dependency validation for AUSTA SuperApp..."

# Ensure scripts are executable
chmod +x "$SCRIPT_DIR/fix-security-vulnerabilities.js"
chmod +x "$SCRIPT_DIR/analyze-dependencies.js"

# Add necessary scripts to package.json
echo "📦 Adding dependency management scripts to package.json..."

# Use a temporary file to update package.json
node -e "
const fs = require('fs');
const packageJsonPath = '$ROOT_DIR/package.json';
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add dependency management scripts if they don't exist
pkg.scripts = pkg.scripts || {};

// Define the scripts to add
const scriptsToAdd = {
  'deps:analyze': 'node scripts/analyze-dependencies.js',
  'deps:fix-security': 'node scripts/fix-security-vulnerabilities.js',
  'deps:audit': 'yarn audit',
  'deps:audit-fix': 'yarn audit --level high --groups dependencies,devDependencies',
  'deps:update': 'yarn upgrade-interactive',
  'deps:check-consistency': 'node scripts/analyze-dependencies.js',
};

// Add scripts that don't exist yet
let modified = false;
for (const [name, command] of Object.entries(scriptsToAdd)) {
  if (!pkg.scripts[name]) {
    pkg.scripts[name] = command;
    modified = true;
  }
}

// Set up overrides and resolutions if they don't exist
if (!pkg.resolutions) {
  pkg.resolutions = {};
  modified = true;
}

if (!pkg.overrides) {
  pkg.overrides = {};
  modified = true;
}

// Add key security fixes to resolutions and overrides
const securityFixes = {
  'axios': '1.6.8',
  'follow-redirects': '1.15.4',
  'semver': '7.5.4',
  'word-wrap': '1.2.4',
  'tough-cookie': '4.1.3',
};

for (const [dep, version] of Object.entries(securityFixes)) {
  if (!pkg.resolutions[dep]) {
    pkg.resolutions[dep] = version;
    modified = true;
  }
  if (!pkg.overrides[dep]) {
    pkg.overrides[dep] = version;
    modified = true;
  }
}

// Write back if changes were made
if (modified) {
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
  console.log('✅ Updated package.json with dependency management scripts and security fixes');
} else {
  console.log('ℹ️ No changes needed to package.json');
}
"

# Create .github directory if it doesn't exist
mkdir -p "$ROOT_DIR/.github/workflows"

# Create Dependabot configuration
echo "🔄 Setting up Dependabot for automated dependency updates..."
mkdir -p "$ROOT_DIR/.github"

cat > "$ROOT_DIR/.github/dependabot.yml" << EOL
# Dependabot configuration for AUSTA SuperApp
version: 2
updates:
  # Check for updates to npm packages in the web frontend
  - package-ecosystem: "npm"
    directory: "/src/web"
    schedule:
      interval: "weekly"
      day: "monday"
    # Limit to direct dependencies and security updates
    open-pull-requests-limit: 10
    versioning-strategy: "auto"
    labels:
      - "dependencies"
      - "frontend"
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]
    commit-message:
      prefix: "deps(web)"
      include: "scope"

  # Check for updates to npm packages in the backend
  - package-ecosystem: "npm"
    directory: "/src/backend"
    schedule:
      interval: "weekly"
      day: "wednesday"
    open-pull-requests-limit: 10
    versioning-strategy: "auto"
    labels:
      - "dependencies"
      - "backend"
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]
    commit-message:
      prefix: "deps(backend)"
      include: "scope"

  # Check for updates to GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "github-actions"
    commit-message:
      prefix: "ci"
      include: "scope"
EOL

echo "✅ Created Dependabot configuration"

# Create documentation for dependency management
cat > "$ROOT_DIR/DEPENDENCY_FIXES.md" << EOL
# Dependency Management Guidelines

## Overview

The AUSTA SuperApp uses a comprehensive approach to dependency management to ensure consistency, security, and reliability across all components of the application.

## Tools and Scripts

The following tools and scripts are available for dependency management:

| Script | Description |
|--------|-------------|
| \`yarn deps:analyze\` | Analyzes dependencies across the project and identifies inconsistencies |
| \`yarn deps:fix-security\` | Fixes known security vulnerabilities in dependencies |
| \`yarn deps:audit\` | Runs a security audit on dependencies |
| \`yarn deps:audit-fix\` | Attempts to automatically fix security issues |
| \`yarn deps:update\` | Interactive tool to update dependencies |
| \`yarn deps:check-consistency\` | Checks for version consistency across packages |

## Security Fixes

The project uses package resolutions and overrides to enforce secure versions of critical dependencies:

- axios: 1.6.8 (fixes GHSA-cxv2-3pj6-hg5h)
- follow-redirects: 1.15.4 (fixes GHSA-3xh2-7cq6-gw52)
- postcss: 8.4.31 (fixes GHSA-7fh5-64p2-3v2j)
- semver: 7.5.4 (fixes GHSA-c2qf-rxjj-qqgw)
- word-wrap: 1.2.4 (fixes GHSA-j8xg-fqg3-53r7)
- tough-cookie: 4.1.3 (fixes GHSA-72xf-g2v4-qvf3)

## Automated Dependency Updates

The project uses GitHub Dependabot to automatically create pull requests for dependency updates:

- Frontend dependencies are checked weekly on Mondays
- Backend dependencies are checked weekly on Wednesdays
- GitHub Actions are checked monthly

## Best Practices

1. **Pin Versions**: Avoid using version ranges (^, ~) for production dependencies
2. **Centralize Common Dependencies**: Use resolutions in the root package.json for critical packages
3. **Regular Audits**: Run \`yarn deps:audit\` before merging new dependencies
4. **Review Updates**: Always review Dependabot PRs carefully before merging
5. **Test Thoroughly**: Ensure thorough testing after dependency updates

## Environment-Safe Code

For code that needs to run in both Node.js and browser environments:

1. Use the safe environment variable getter in \`src/web/shared/constants/api.ts\`
2. Check for environment objects before using them
3. Use cross-environment compatible libraries when possible
EOL

echo "✅ Created dependency management documentation"

# Run security and consistency checks
echo "🔍 Running initial dependency scans..."
node "$SCRIPT_DIR/analyze-dependencies.js"
node "$SCRIPT_DIR/fix-security-vulnerabilities.js"

echo "
🎉 Dependency validation setup complete!

The following tools are now available:
- yarn deps:analyze - Analyze dependencies for inconsistencies
- yarn deps:fix-security - Fix known security vulnerabilities
- yarn deps:audit - Run security audit on dependencies
- yarn deps:check-consistency - Check version consistency

For more information, see DEPENDENCY_FIXES.md
"
#!/bin/bash

# Script to set up dependency validation infrastructure

# Create necessary directories for Yarn
mkdir -p /Users/rodrigo/Git\ Repositories/Super-APP\ gamification/healthcare-super-app--w-gamification--tgfzl7/src/web/.yarn/plugins
mkdir -p /Users/rodrigo/Git\ Repositories/Super-APP\ gamification/healthcare-super-app--w-gamification--tgfzl7/src/web/.yarn/releases

# Install glob package required for validation script
npm install -g glob

# Make the validation script executable
chmod +x /Users/rodrigo/Git\ Repositories/Super-APP\ gamification/healthcare-super-app--w-gamification--tgfzl7/scripts/validate-package-json.js

# Make the Husky pre-commit hook executable
chmod +x /Users/rodrigo/Git\ Repositories/Super-APP\ gamification/healthcare-super-app--w-gamification--tgfzl7/.husky/pre-commit

echo "Dependency validation infrastructure has been set up successfully!"
echo "To test the setup, run: node scripts/validate-package-json.js"
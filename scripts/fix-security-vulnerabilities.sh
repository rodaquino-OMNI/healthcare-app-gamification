#!/bin/bash

# Script to check and fix security vulnerabilities in the project
# To be run from the project root directory

echo "🔒 Starting security vulnerability remediation..."

# Update dependencies with known vulnerabilities
update_dependencies() {
  local dir=$1
  echo "📦 Checking dependencies in $dir..."
  
  if [ -f "$dir/package.json" ]; then
    # Force resolution of common vulnerable dependencies
    npx npm-force-resolutions
    
    # Apply specific fixes for known vulnerabilities
    cd "$dir"
    # Apply patches for axios vulnerabilities
    if [ -f "./tools/scripts/patch-axios.js" ]; then
      node ./tools/scripts/patch-axios.js
    fi
    cd - > /dev/null
  fi
}

# Run security checks through the project
check_project() {
  echo "🔍 Checking root directory..."
  update_dependencies "."
  
  echo "🔍 Checking backend directory..."
  update_dependencies "./src/backend"
  
  echo "🔍 Checking web directory..."
  update_dependencies "./src/web"
  
  # Check each workspace in backend
  if [ -d "./src/backend" ]; then
    for service in ./src/backend/*/; do
      if [ -d "$service" ]; then
        update_dependencies "$service"
      fi
    done
  fi
  
  # Check each workspace in web
  if [ -d "./src/web" ]; then
    for app in ./src/web/*/; do
      if [ -d "$app" ]; then
        update_dependencies "$app"
      fi
    done
  fi
}

# Install audit and remediation tools
echo "⚙️ Installing security tools..."
npm install -g npm-force-resolutions > /dev/null

# Run checks on the project
check_project

echo "✅ Security vulnerability remediation complete!"
echo "Ensure to run 'npm install' or 'yarn install' to apply the fixed dependencies."
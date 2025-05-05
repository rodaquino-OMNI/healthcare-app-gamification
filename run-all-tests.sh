#!/bin/bash

# Script to run tests in all workspaces and continue even if some fail
# Removed gamification-engine from skip list since we fixed the issues

MONOREPO_ROOT="/Users/rodrigo/Git Repositories/Super-APP gamification/healthcare-super-app--w-gamification--tgfzl7"
SKIP_WORKSPACES=()  # Emptied the skip list

# Get workspace locations
cd "$MONOREPO_ROOT"
WORKSPACES=$(yarn workspaces info --json | grep "location" | sed 's/.*: "\(.*\)",/\1/')

# Run tests for each workspace
for WORKSPACE_PATH in $WORKSPACES; do
  WORKSPACE_NAME=$(basename "$WORKSPACE_PATH")
  
  # Check if workspace is in skip list
  SKIP=false
  for SKIP_WS in "${SKIP_WORKSPACES[@]}"; do
    if [[ "$WORKSPACE_PATH" == *"$SKIP_WS"* ]]; then
      SKIP=true
      break
    fi
  done
  
  if [ "$SKIP" = true ]; then
    echo "⏩ Skipping tests for workspace: $WORKSPACE_PATH"
    continue
  fi
  
  echo "🧪 Running tests for workspace: $WORKSPACE_PATH"
  cd "$MONOREPO_ROOT/$WORKSPACE_PATH"
  
  # Check if package.json exists and has a test script
  if [ -f "package.json" ]; then
    HAS_TEST=$(grep -c "\"test\":" package.json || echo "0")
    if [ "$HAS_TEST" -gt "0" ]; then
      echo "Running tests with --passWithNoTests flag..."
      yarn test --passWithNoTests || echo "Tests failed but continuing with next workspace"
    else
      echo "No test script found in package.json"
    fi
  else
    echo "No package.json found"
  fi
  
  echo "✅ Finished workspace: $WORKSPACE_PATH"
  echo ""
done

echo "All workspaces processed!"
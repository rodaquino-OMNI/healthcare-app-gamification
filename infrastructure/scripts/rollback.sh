#!/usr/bin/env bash
set -euo pipefail

# ==========================================
# AUSTA Healthcare SuperApp - Rollback Script
# ==========================================

STACK_NAME="austa"
SERVICE="${STACK_NAME}_laravel-api"

echo "==> Rolling back service: ${SERVICE}"
docker service rollback "${SERVICE}"

echo "==> Waiting for rollback to complete..."
sleep 10

echo "==> Current service status:"
docker service ps "${SERVICE}" --no-trunc --filter "desired-state=running"

echo "==> Checking health..."
if curl -sf "http://localhost/api/health" > /dev/null 2>&1; then
    echo "==> Rollback successful - health check passed"
    exit 0
else
    echo "==> WARNING: Health check failed after rollback"
    docker service logs "${SERVICE}" --tail 20
    exit 1
fi

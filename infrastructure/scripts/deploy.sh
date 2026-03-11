#!/usr/bin/env bash
set -euo pipefail

# ==========================================
# AUSTA Healthcare SuperApp - Deploy Script
# ==========================================

STACK_NAME="austa"
REGISTRY="ghcr.io/austa/healthcare-app"
HEALTH_URL="http://localhost/api/health"
HEALTH_RETRIES=30
HEALTH_INTERVAL=10

# ── Validate Arguments ────────────────────────────────────────────────────

if [ -z "${1:-}" ]; then
    echo "Usage: $0 <IMAGE_TAG>"
    echo "  Example: $0 v1.2.3"
    exit 1
fi

IMAGE_TAG="$1"
echo "==> Deploying ${REGISTRY}:${IMAGE_TAG}"

# ── Pull Image ────────────────────────────────────────────────────────────

echo "==> Pulling image from registry..."
docker pull "${REGISTRY}:${IMAGE_TAG}"

# ── Deploy Stack ──────────────────────────────────────────────────────────

echo "==> Deploying stack '${STACK_NAME}'..."
export IMAGE_TAG
docker stack deploy \
    --compose-file "$(dirname "$0")/../docker-swarm/docker-stack.yml" \
    --with-registry-auth \
    "${STACK_NAME}"

# ── Wait for Health Check ─────────────────────────────────────────────────

echo "==> Waiting for services to become healthy..."
for i in $(seq 1 "${HEALTH_RETRIES}"); do
    if curl -sf "${HEALTH_URL}" > /dev/null 2>&1; then
        echo "==> Health check passed on attempt ${i}/${HEALTH_RETRIES}"
        echo "==> Deployment successful!"
        exit 0
    fi
    echo "    Attempt ${i}/${HEALTH_RETRIES} - waiting ${HEALTH_INTERVAL}s..."
    sleep "${HEALTH_INTERVAL}"
done

# ── Failure ───────────────────────────────────────────────────────────────

echo "==> ERROR: Health check failed after ${HEALTH_RETRIES} attempts"
echo "==> Checking service status..."
docker stack services "${STACK_NAME}"
docker service logs "${STACK_NAME}_laravel-api" --tail 50
exit 1

#!/usr/bin/env bash
set -euo pipefail

# ==========================================
# AUSTA Healthcare SuperApp - Health Check
# ==========================================

HEALTH_URL="${HEALTH_URL:-http://localhost/api/health}"
TIMEOUT="${TIMEOUT:-5}"

response=$(curl -sf --max-time "${TIMEOUT}" "${HEALTH_URL}" 2>/dev/null) || {
    echo "UNHEALTHY: Failed to reach ${HEALTH_URL}"
    exit 1
}

echo "HEALTHY: ${response}"
exit 0

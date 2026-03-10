#!/usr/bin/env bash
# ============================================================
# AUSTA Healthcare SuperApp — Infrastructure Validation Script
# ============================================================
# Validates connectivity and configuration for all required
# infrastructure components after provisioning.
#
# Usage: ./scripts/validate-infrastructure.sh
# Exit codes: 0 = all checks pass, 1 = one or more checks failed
# ============================================================

set -euo pipefail

# ---- Colors & Formatting ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

pass() {
  echo -e "  ${GREEN}[PASS]${NC} $1"
  PASS_COUNT=$((PASS_COUNT + 1))
}

fail() {
  echo -e "  ${RED}[FAIL]${NC} $1"
  FAIL_COUNT=$((FAIL_COUNT + 1))
}

warn() {
  echo -e "  ${YELLOW}[WARN]${NC} $1"
  WARN_COUNT=$((WARN_COUNT + 1))
}

section() {
  echo ""
  echo -e "${CYAN}${BOLD}=== $1 ===${NC}"
}

# ---- Load .env if present ----
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

if [ -f "${PROJECT_ROOT}/.env" ]; then
  echo -e "${CYAN}Loading .env from ${PROJECT_ROOT}/.env${NC}"
  set -a
  # shellcheck disable=SC1091
  source "${PROJECT_ROOT}/.env"
  set +a
else
  echo -e "${YELLOW}No .env file found at ${PROJECT_ROOT}/.env — using existing environment${NC}"
fi

# ============================================================
# 1. Required Environment Variables
# ============================================================
section "Required Environment Variables"

check_env_var() {
  local var_name="$1"
  local description="$2"
  local required="${3:-true}"

  if [ -n "${!var_name:-}" ]; then
    # Mask secrets — show only first 4 chars
    local value="${!var_name}"
    if [[ "$var_name" == *SECRET* || "$var_name" == *PASSWORD* || "$var_name" == *KEY* || "$var_name" == *TOKEN* ]]; then
      local masked="${value:0:4}****"
      pass "$var_name is set ($masked) — $description"
    else
      pass "$var_name is set — $description"
    fi
  else
    if [ "$required" = "true" ]; then
      fail "$var_name is NOT set — $description"
    else
      warn "$var_name is not set (optional) — $description"
    fi
  fi
}

# Core required vars
check_env_var "NODE_ENV" "Runtime environment"
check_env_var "DATABASE_URL" "Primary PostgreSQL connection string"
check_env_var "JWT_SECRET" "JWT signing secret"
check_env_var "REDIS_URL" "Redis connection URL" "false"
check_env_var "KAFKA_BROKERS" "Kafka broker addresses" "false"
check_env_var "S3_BUCKET" "S3 storage bucket" "false"
check_env_var "S3_ACCESS_KEY_ID" "S3 access key" "false"
check_env_var "S3_SECRET_ACCESS_KEY" "S3 secret key" "false"

# Service-specific
check_env_var "AUTH_DATABASE_URL" "Auth service DB connection" "false"
check_env_var "CARE_SERVICE_DATABASE_URL" "Care service DB connection" "false"

# ============================================================
# 2. PostgreSQL Connectivity
# ============================================================
section "PostgreSQL Connectivity"

check_postgres() {
  local label="$1"
  local url="$2"

  if [ -z "$url" ]; then
    warn "$label — connection URL not set, skipping"
    return
  fi

  # Extract host and port from DATABASE_URL
  # Format: postgresql://user:pass@host:port/dbname
  local host port
  host=$(echo "$url" | sed -E 's|.*@([^:/]+).*|\1|')
  port=$(echo "$url" | sed -E 's|.*:([0-9]+)/.*|\1|')
  port="${port:-5432}"

  if command -v pg_isready &>/dev/null; then
    if pg_isready -h "$host" -p "$port" -t 5 &>/dev/null; then
      pass "$label — PostgreSQL at $host:$port is accepting connections"
    else
      fail "$label — PostgreSQL at $host:$port is NOT reachable"
    fi
  elif command -v psql &>/dev/null; then
    if psql "$url" -c "SELECT 1" &>/dev/null 2>&1; then
      pass "$label — PostgreSQL at $host:$port is accepting connections"
    else
      fail "$label — PostgreSQL at $host:$port is NOT reachable"
    fi
  else
    # Fallback: use TCP check
    if check_tcp "$host" "$port"; then
      pass "$label — TCP connection to $host:$port succeeded"
    else
      fail "$label — TCP connection to $host:$port failed"
    fi
  fi
}

check_tcp() {
  local host="$1"
  local port="$2"

  if command -v nc &>/dev/null; then
    nc -z -w 5 "$host" "$port" &>/dev/null 2>&1
  elif command -v bash &>/dev/null; then
    (echo >/dev/tcp/"$host"/"$port") &>/dev/null 2>&1
  else
    return 1
  fi
}

check_postgres "Primary DB" "${DATABASE_URL:-}"
check_postgres "Auth DB" "${AUTH_DATABASE_URL:-}"
check_postgres "Care DB" "${CARE_SERVICE_DATABASE_URL:-}"

# ============================================================
# 3. Redis Connectivity
# ============================================================
section "Redis Connectivity"

check_redis() {
  local label="$1"
  local url="$2"

  if [ -z "$url" ]; then
    warn "$label — Redis URL not set, skipping"
    return
  fi

  # Extract host and port from redis://[:password@]host:port[/db]
  local host port
  host=$(echo "$url" | sed -E 's|redis://([^:@]+:)?([^@]+@)?([^:/]+).*|\3|')
  port=$(echo "$url" | sed -E 's|.*:([0-9]+)(/[0-9]+)?$|\1|')
  port="${port:-6379}"

  if command -v redis-cli &>/dev/null; then
    if redis-cli -u "$url" ping 2>/dev/null | grep -q "PONG"; then
      pass "$label — Redis at $host:$port responded with PONG"
    else
      fail "$label — Redis at $host:$port did NOT respond to PING"
    fi
  else
    if check_tcp "$host" "$port"; then
      pass "$label — TCP connection to Redis at $host:$port succeeded"
    else
      fail "$label — TCP connection to Redis at $host:$port failed"
    fi
  fi
}

check_redis "Primary Redis" "${REDIS_URL:-}"
check_redis "Care Redis" "${CARE_SERVICE_REDIS_URL:-}"

# ============================================================
# 4. Kafka Connectivity
# ============================================================
section "Kafka Connectivity"

check_kafka() {
  local brokers="$1"

  if [ -z "$brokers" ]; then
    warn "Kafka — KAFKA_BROKERS not set, skipping"
    return
  fi

  IFS=',' read -ra BROKER_LIST <<< "$brokers"
  local any_reachable=false

  for broker in "${BROKER_LIST[@]}"; do
    local host port
    host=$(echo "$broker" | cut -d: -f1)
    port=$(echo "$broker" | cut -d: -f2)
    port="${port:-9092}"

    if check_tcp "$host" "$port"; then
      pass "Kafka broker $host:$port is reachable"
      any_reachable=true
    else
      fail "Kafka broker $host:$port is NOT reachable"
    fi
  done

  if [ "$any_reachable" = false ]; then
    fail "No Kafka brokers are reachable"
  fi
}

check_kafka "${KAFKA_BROKERS:-}"

# ============================================================
# 5. S3 / Object Storage Connectivity
# ============================================================
section "S3 / Object Storage"

check_s3() {
  local bucket="${S3_BUCKET:-}"
  local region="${S3_REGION:-sa-east-1}"
  local endpoint="${S3_ENDPOINT:-}"

  if [ -z "$bucket" ]; then
    warn "S3 — S3_BUCKET not set, skipping"
    return
  fi

  if command -v aws &>/dev/null; then
    local aws_args=("s3api" "head-bucket" "--bucket" "$bucket" "--region" "$region")
    if [ -n "$endpoint" ]; then
      aws_args+=("--endpoint-url" "$endpoint")
    fi

    if aws "${aws_args[@]}" 2>/dev/null; then
      pass "S3 bucket '$bucket' in $region is accessible"
    else
      fail "S3 bucket '$bucket' in $region is NOT accessible"
    fi
  else
    # Fallback: DNS check for S3 endpoint
    local s3_host
    if [ -n "$endpoint" ]; then
      s3_host=$(echo "$endpoint" | sed -E 's|https?://||' | cut -d/ -f1 | cut -d: -f1)
    else
      s3_host="${bucket}.s3.${region}.amazonaws.com"
    fi

    if check_dns "$s3_host"; then
      pass "S3 endpoint $s3_host resolves via DNS"
    else
      fail "S3 endpoint $s3_host does NOT resolve via DNS"
    fi
  fi
}

check_s3

# ============================================================
# 6. DNS Resolution
# ============================================================
section "DNS Resolution"

check_dns() {
  local hostname="$1"

  if [ -z "$hostname" ]; then
    return 1
  fi

  if command -v dig &>/dev/null; then
    dig +short "$hostname" 2>/dev/null | head -1 | grep -q .
  elif command -v nslookup &>/dev/null; then
    nslookup "$hostname" 2>/dev/null | grep -q "Address:"
  elif command -v host &>/dev/null; then
    host "$hostname" 2>/dev/null | grep -q "has address"
  elif command -v getent &>/dev/null; then
    getent hosts "$hostname" &>/dev/null
  else
    # Fallback: ping with timeout
    ping -c 1 -W 3 "$hostname" &>/dev/null
  fi
}

check_dns_entry() {
  local label="$1"
  local hostname="$2"

  if [ -z "$hostname" ]; then
    warn "$label — hostname not configured, skipping"
    return
  fi

  # Strip protocol and path
  hostname=$(echo "$hostname" | sed -E 's|https?://||' | cut -d/ -f1 | cut -d: -f1)

  # Skip localhost
  if [[ "$hostname" == "localhost" || "$hostname" == "127.0.0.1" ]]; then
    pass "$label — $hostname (localhost, no DNS needed)"
    return
  fi

  if check_dns "$hostname"; then
    pass "$label — $hostname resolves"
  else
    fail "$label — $hostname does NOT resolve"
  fi
}

# Check DNS for service endpoints
check_dns_entry "Auth Service" "${AUTH_SERVICE_URL:-}"
check_dns_entry "Health Service" "${HEALTH_SERVICE_URL:-}"
check_dns_entry "Care Service" "${CARE_SERVICE_URL:-}"
check_dns_entry "Plan Service" "${PLAN_SERVICE_URL:-}"
check_dns_entry "Gamification Service" "${GAMIFICATION_SERVICE_URL:-}"
check_dns_entry "Notification Service" "${NOTIFICATION_SERVICE_URL:-}"
check_dns_entry "FHIR API" "${FHIR_API_URL:-}"
check_dns_entry "Insurance API" "${INSURANCE_API_BASE_URL:-}"

# ============================================================
# 7. Required Tools Check
# ============================================================
section "Required CLI Tools"

check_tool() {
  local tool="$1"
  local required="${2:-false}"

  if command -v "$tool" &>/dev/null; then
    local version
    version=$("$tool" --version 2>/dev/null | head -1 || echo "version unknown")
    pass "$tool is installed ($version)"
  else
    if [ "$required" = "true" ]; then
      fail "$tool is NOT installed"
    else
      warn "$tool is not installed (optional)"
    fi
  fi
}

check_tool "node" "true"
check_tool "npm" "true"
check_tool "npx" "true"
check_tool "psql" "false"
check_tool "redis-cli" "false"
check_tool "aws" "false"
check_tool "docker" "false"
check_tool "kubectl" "false"

# ============================================================
# 8. Node.js Version Check
# ============================================================
section "Runtime Version Check"

if command -v node &>/dev/null; then
  NODE_VERSION=$(node --version | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 20 ]; then
    pass "Node.js $NODE_VERSION (>= 20 required)"
  else
    fail "Node.js $NODE_VERSION (>= 20 required)"
  fi
fi

# ============================================================
# Summary
# ============================================================
echo ""
echo -e "${BOLD}============================================================${NC}"
echo -e "${BOLD}                   VALIDATION SUMMARY${NC}"
echo -e "${BOLD}============================================================${NC}"
echo -e "  ${GREEN}PASS:${NC} $PASS_COUNT"
echo -e "  ${RED}FAIL:${NC} $FAIL_COUNT"
echo -e "  ${YELLOW}WARN:${NC} $WARN_COUNT"
echo -e "${BOLD}============================================================${NC}"

if [ "$FAIL_COUNT" -gt 0 ]; then
  echo -e ""
  echo -e "${RED}${BOLD}Infrastructure validation FAILED with $FAIL_COUNT error(s).${NC}"
  echo -e "${RED}Fix the issues above before proceeding with deployment.${NC}"
  exit 1
else
  echo -e ""
  echo -e "${GREEN}${BOLD}Infrastructure validation PASSED.${NC}"
  if [ "$WARN_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}Review $WARN_COUNT warning(s) above for optional improvements.${NC}"
  fi
  exit 0
fi

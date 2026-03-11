#!/usr/bin/env bash
set -euo pipefail

# ==========================================
# AUSTA Healthcare SuperApp - PostgreSQL Backup
# ==========================================

BACKUP_DIR="${BACKUP_DIR:-/var/backups/postgres}"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/austa_${TIMESTAMP}.sql.gz"

DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-austa}"
DB_USER="${DB_USER:-austa}"

S3_BUCKET="${S3_BUCKET:-}"
S3_PREFIX="${S3_PREFIX:-backups/postgres}"

# ── Create Backup Directory ───────────────────────────────────────────────

mkdir -p "${BACKUP_DIR}"

# ── Perform Backup ────────────────────────────────────────────────────────

echo "==> Starting PostgreSQL backup: ${BACKUP_FILE}"
pg_dump \
    -h "${DB_HOST}" \
    -p "${DB_PORT}" \
    -U "${DB_USER}" \
    -d "${DB_NAME}" \
    --no-owner \
    --no-privileges \
    --format=custom \
    | gzip > "${BACKUP_FILE}"

BACKUP_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
echo "==> Backup completed: ${BACKUP_FILE} (${BACKUP_SIZE})"

# ── Rotate Old Backups ────────────────────────────────────────────────────

echo "==> Removing backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "austa_*.sql.gz" -mtime +${RETENTION_DAYS} -delete
REMAINING=$(find "${BACKUP_DIR}" -name "austa_*.sql.gz" | wc -l)
echo "==> ${REMAINING} backup(s) remaining"

# ── Upload to S3 (optional) ──────────────────────────────────────────────

if [ -n "${S3_BUCKET}" ]; then
    echo "==> Uploading to S3: s3://${S3_BUCKET}/${S3_PREFIX}/"
    if command -v aws &> /dev/null; then
        aws s3 cp "${BACKUP_FILE}" "s3://${S3_BUCKET}/${S3_PREFIX}/$(basename "${BACKUP_FILE}")"
        echo "==> S3 upload completed"
    else
        echo "==> WARNING: AWS CLI not found, skipping S3 upload"
    fi
else
    echo "==> S3_BUCKET not set, skipping S3 upload"
fi

echo "==> Backup process finished successfully"

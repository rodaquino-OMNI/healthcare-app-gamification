# ADR-004: LGPD Compliance Architecture

## Status

Accepted (legally required)

## Date

2026-02-23

## Context

AUSTA operates in Brazil under the **Lei Geral de Protecao de Dados Pessoais (LGPD -- Lei n. 13.709/2018)**, the country's comprehensive data protection law. As a healthcare application, AUSTA processes **Protected Health Information (PHI)** which receives additional protections under **Article 11** (sensitive personal data) and must comply with healthcare-specific regulations from the **Conselho Federal de Medicina (CFM)** and the **Agencia Nacional de Saude Suplementar (ANS)**.

Key legal pressures:

- **Fines**: Up to 2% of gross revenue per infraction, capped at R$50 million per violation (Article 52).
- **Sensitive data**: Health data requires explicit, specific consent for each processing purpose (Article 11, Section I).
- **Data subject rights**: Users must be able to access, correct, delete, and port their data (Articles 17-22).
- **Data Protection Officer (DPO/Encarregado)**: Required for organizations processing health data at scale (Article 41).
- **Breach notification**: The Autoridade Nacional de Protecao de Dados (ANPD) must be notified within a reasonable timeframe for incidents that may cause significant risk (Article 48).
- **Healthcare retention**: Medical records must be retained for a minimum of 20 years per CFM Resolution 1.821/2007.

## Decision

### 1. Consent Management (Articles 7 and 11)

- **Prisma model**: `ConsentRecord` tracks per-user, per-purpose consent with explicit status (`ACTIVE`, `REVOKED`, `EXPIRED`).
- **6 consent types**: `DATA_PROCESSING`, `HEALTH_DATA_SHARING`, `MARKETING`, `RESEARCH`, `TELEMEDICINE`, `THIRD_PARTY_SHARING`.
- **Granular data categories**: Each consent record specifies which data categories it covers (e.g., `["vital_signs", "medication_history"]`).
- **Versioned consent**: Consent records include a `version` field; policy updates require re-consent.
- **Revocation**: Users can revoke consent at any time via Settings; revocation timestamp and reason are recorded.

### 2. Data Subject Rights (Articles 17-22)

- **Access (portabilidade)**: API endpoint exports all user data in a machine-readable format (JSON).
- **Rectification**: Users can correct personal data through profile screens; changes are audit-logged.
- **Deletion (right to be forgotten)**: Soft-delete with a 30-day grace period, then hard-delete of non-retention-mandated data. PHI under CFM retention rules is anonymized rather than deleted.
- **Data portability**: Export includes health metrics, appointments, prescriptions, and consent history.
- **SLA tracking**: Each DSR request is tracked with creation timestamp, processing deadline, and completion status.

### 3. PHI Encryption

- **At rest**: AES-256-GCM encryption for all PHI fields in the database. Encryption keys stored in AWS KMS, not in the application.
- **In transit**: TLS 1.3 enforced for all API communication; HTTP Strict Transport Security (HSTS) enabled.
- **Key rotation**: Encryption keys rotated every 90 days with automatic re-encryption of affected records.
- **Field-level encryption**: Sensitive fields (diagnosis, prescriptions, lab results) are encrypted individually, enabling access control at the field level.

### 4. Data Retention

| Data Category | Retention Period | Legal Basis |
|---|---|---|
| Medical records (PHI) | 20 years | CFM Resolution 1.821/2007 |
| Financial/billing records | 5 years | CTN Art. 173 (tax code) |
| Consent logs | Indefinite | LGPD Art. 8, S 5 (proof of compliance) |
| Audit logs | 5 years | Internal policy + LGPD Art. 37 |
| Marketing preferences | Until revocation | LGPD Art. 15, III |
| Session/analytics data | 2 years | Internal policy |

### 5. Access Control

- **RBAC**: Role-based access for standard operations (patient, doctor, nurse, admin).
- **ABAC**: Attribute-based policies for PHI access (e.g., only the treating physician can view a patient's full record during an active appointment).
- **Audit trail**: Every PHI access is logged in the `AuditLog` model with `userId`, `action`, `resourceType`, `resourceId`, `ipAddress`, and `metadata` (indexed by user, resource, and timestamp).

### 6. Incident Response

- **72-hour notification**: Security incidents affecting data subjects are reported to ANPD within 72 hours as recommended by ANPD guidelines.
- **User notification**: Affected users are notified via in-app notification and email with plain-language description of the incident, data affected, and remediation steps.
- **Post-incident review**: Mandatory root cause analysis with findings stored in the audit system.

## Consequences

### Positive

- **Legal compliance**: Meets all LGPD requirements for sensitive health data processing, avoiding fines up to R$50M.
- **Patient trust**: Granular consent and transparent data handling build confidence in the platform.
- **Competitive advantage**: LGPD compliance certification differentiates AUSTA in the Brazilian health-tech market.
- **Audit readiness**: Comprehensive logging enables rapid response to ANPD inquiries or audits.

### Negative

- **Operational overhead**: Consent management adds friction to user onboarding (multiple consent screens).
- **Storage costs**: 20-year PHI retention with encryption and audit logging increases storage requirements significantly.
- **Development complexity**: Field-level encryption and ABAC policies add complexity to every feature that touches PHI.
- **Performance impact**: Encryption/decryption overhead on PHI fields; mitigated by caching decrypted data in memory during active sessions.

## References

- `src/backend/shared/prisma/schema.prisma` — `ConsentRecord` model (lines 688-708), `AuditLog` model (lines 651-667)
- [LGPD Full Text (Lei n. 13.709/2018)](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [CFM Resolution 1.821/2007](https://sistemas.cfm.org.br/normas/visualizar/resolucoes/BR/2007/1821) — Medical record retention
- [ANPD Security Incident Guide](https://www.gov.br/anpd/pt-br) — Breach notification procedures
- `infrastructure/monitoring/sentry.yml` — Monitoring configuration (anonymized user context)

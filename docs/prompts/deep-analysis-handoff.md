# DEEP REPOSITORY ANALYSIS — Agent Handoff Prompt
# AUSTA SuperApp (healthcare-super-app--w-gamification--tgfzl7)

**Handoff Date:** 2026-02-19  
**Prepared By:** Architect Agent (Session Bootstrap complete)  
**Target Agent Role:** Senior Technical Analyst + Quality Auditor  
**Estimated Duration:** 4–6 hours (swarm-parallelized)  
**ADR Compliance:** ADR-013 mandatory (Memory-First, DELEGATE DO NOT CODE)

---

## AGENT IDENTITY CONTRACT

You are a **Senior Technical Analyst and Quality Auditor** — not a coder.  
Your outputs are **analysis reports stored in memory + a final markdown report**.  
You do NOT modify source files. You do NOT write new code.  
You READ, ANALYZE, MEASURE, and REPORT.

---

## MISSION

Perform a deep, multi-dimensional technical analysis of the AUSTA SuperApp repository.  
Produce structured findings across 5 dimensions. Store all intermediate findings in  
claude-flow memory. Produce a final consolidated report at:

```
docs/analysis/REPOSITORY_DEEP_ANALYSIS.md
```

---

## SESSION BOOTSTRAP (Execute First — Before Any Analysis)

```bash
# 1. Verify system state
npx @claude-flow/cli@latest doctor
npx @claude-flow/cli@latest hive-mind status
npx @claude-flow/cli@latest memory stats

# 2. Pre-task hook
npx @claude-flow/cli@latest hooks pre-task \
  --description "Deep repository analysis — 5 dimensions" \
  --task-id "deep-analysis-001" \
  --namespace austa-analysis

# 3. Index all documentation into vector store for semantic retrieval
npx @claude-flow/cli@latest vector index \
  --source "docs/" \
  --namespace austa-analysis \
  --algorithm hnsw \
  --dimensions 768

# 4. Index source code patterns
npx @claude-flow/cli@latest vector index \
  --source "src/" \
  --namespace austa-analysis \
  --algorithm hnsw \
  --dimensions 768

# 5. Store analysis scope in memory
npx @claude-flow/cli@latest memory store \
  --key "analysis-scope" \
  --value "5-dimension deep analysis: purpose, plan quality, plan adherence, build quality, security" \
  --namespace austa-analysis
```

---

## REPOSITORY MAP (Pre-Analyzed by Architect — Use as Starting Context)

```
WORKSPACE: /Users/rodrigo/claude-projects/healthcare-super-app--w-gamification--tgfzl7

BACKEND  (src/backend/)   — NestJS monorepo, TypeScript, 252 .ts source files
  Services:
    - api-gateway         GraphQL Federation gateway, middleware, guards
    - auth-service        JWT, OAuth2, RBAC, permissions, roles, users
    - health-service      Devices, insights, integrations, health records, types
    - care-service        Appointments, telemedicine, medications, providers,
                          symptom-checker, treatments
    - plan-service        Insurance plans, claims, documents, cost-simulator,
                          auth, constants, DTOs
    - gamification-engine Achievements, leaderboard, profiles, quests, rewards,
                          rules, events — Prisma ORM
    - notification-service Channels, notifications, preferences, templates,
                           websockets
    - shared/             Shared backend utilities
    - packages/auth       Auth package
    - packages/shared     Shared package

  Infrastructure:
    - Kafka (kafkajs)
    - Redis (ioredis)
    - PostgreSQL (pg + TypeORM + Prisma)
    - GraphQL (Apollo Federation + graphql-ws)
    - OpenTelemetry (tracing)
    - Firebase Admin
    - SendGrid + Twilio + Nodemailer (notifications)
    - Agora (video/RTC)
    - FHIR (fhir-kit-client)
    - Passport (JWT + Local + OAuth2)

FRONTEND (src/web/)       — Yarn workspaces, TypeScript, 415 .ts/.tsx files
  Packages:
    - web/                Next.js 14 app (pages, components, hooks, i18n, api,
                          context, layouts, styles, types, utils)
    - mobile/             React Native app (screens, navigation, components,
                          hooks, i18n, api, context, assets)
    - design-system/      Shared component library
    - shared/             Cross-platform shared logic

  Key Dependencies:
    Apollo Client, React Query, React Hook Form, Styled Components,
    React Navigation, Sentry, i18next, Zod/Yup, Victory Native,
    react-native-biometrics, react-native-vision-camera, Agora RTC

DOCUMENTATION
  docs/specifications/    8 files (functional reqs, non-functional reqs,
                          user stories, acceptance criteria, system analysis,
                          integration requirements, technical constraints,
                          UI/UX requirements)
  docs/design/            10 files (system architecture, component architecture,
                          data flow, deployment infrastructure, API gateway/
                          service mesh, gamification engine, security/error
                          handling, service pseudocode, test strategy,
                          healthcare research insights 2024)
  docs/ADRs/              1 file (ADR-013: swarm intelligence best practices)
  docs/original/          Input Prompt, Project Guide, Technical Specifications

INFRASTRUCTURE
  infrastructure/kubernetes/   Deployments, services, ingress, HPA for all services
  infrastructure/terraform/    Providers, modules, environments, variables

TESTS: Only 3 test files found (CRITICAL GAP — ratio 3:667 source files)
```

---

## ANALYSIS DIMENSIONS

### DIMENSION 1 — Repository Purpose & Problem Definition

**Objective:** Fully understand what this system is, who it serves, and what problem it solves.

**Tools to use:**
```bash
# Semantic search across all documentation
npx @claude-flow/cli@latest vector search \
  --query "healthcare super app purpose problem statement target users" \
  --namespace austa-analysis --top-k 10

npx @claude-flow/cli@latest vector search \
  --query "gamification health engagement patient journey" \
  --namespace austa-analysis --top-k 10

npx @claude-flow/cli@latest vector search \
  --query "AUSTA business context stakeholders market" \
  --namespace austa-analysis --top-k 5
```

**Files to read (priority order):**
1. `docs/original documentation/Input Prompt.md`
2. `docs/original documentation/Project Guide.md`
3. `docs/original documentation/Technical Specifications_*.md`
4. `docs/specifications/FUNCTIONAL_REQUIREMENTS.md`
5. `docs/specifications/USER_STORIES.md`
6. `docs/specifications/SYSTEM_ANALYSIS.md`

**Questions to answer:**
- What is the primary problem this application solves?
- Who are the target users (patient personas, roles, demographics)?
- What are the 3 core "journeys" (Health, Care, Plan) and how do they interconnect?
- What role does gamification play — is it cosmetic or structural?
- What regulatory/compliance context exists (HIPAA, LGPD, ANS Brazil)?
- What is the intended market (Brazil, LATAM, global)?

**Store findings:**
```bash
npx @claude-flow/cli@latest memory store \
  --key "dim1-purpose-summary" \
  --value "<findings>" \
  --namespace austa-analysis
```

---

### DIMENSION 2 — Quality of Plan (Documentation & Architecture)

**Objective:** Assess the completeness, consistency, and professional quality of all planning artifacts.

**Tools to use:**
```bash
# Cross-reference specs for internal consistency
npx @claude-flow/cli@latest vector search \
  --query "acceptance criteria completeness testability measurable" \
  --namespace austa-analysis --top-k 8

npx @claude-flow/cli@latest vector search \
  --query "architecture decision record rationale tradeoff" \
  --namespace austa-analysis --top-k 8

# Use SONA pattern analysis for documentation quality
npx @claude-flow/cli@latest hooks intelligence stats
```

**Files to read (all — this is the full plan corpus):**
```
docs/specifications/ACCEPTANCE_CRITERIA.md
docs/specifications/FUNCTIONAL_REQUIREMENTS.md
docs/specifications/NON_FUNCTIONAL_REQUIREMENTS.md
docs/specifications/INTEGRATION_REQUIREMENTS.md
docs/specifications/TECHNICAL_CONSTRAINTS.md
docs/specifications/UI_UX_REQUIREMENTS.md
docs/specifications/USER_STORIES.md
docs/specifications/SYSTEM_ANALYSIS.md
docs/design/SYSTEM_ARCHITECTURE.md
docs/design/COMPONENT_ARCHITECTURE.md
docs/design/DATA_FLOW_ARCHITECTURE.md
docs/design/API_GATEWAY_SERVICE_MESH.md
docs/design/GAMIFICATION_ENGINE_ARCHITECTURE.md
docs/design/DEPLOYMENT_INFRASTRUCTURE.md
docs/design/SECURITY_ERROR_HANDLING.md
docs/design/SERVICE_PSEUDOCODE.md
docs/design/TEST_STRATEGY.md
docs/design/HEALTHCARE_RESEARCH_INSIGHTS_2024.md
```

**Scoring rubric (rate each 1–5):**
| Artifact | Completeness | Internal Consistency | Measurability | Technical Depth | ADR Coverage |
|---|---|---|---|---|---|
| Functional Requirements | ? | ? | ? | ? | ? |
| Non-Functional Requirements | ? | ? | ? | ? | ? |
| Acceptance Criteria | ? | ? | ? | ? | ? |
| System Architecture | ? | ? | ? | ? | ? |
| Component Architecture | ? | ? | ? | ? | ? |
| Data Flow | ? | ? | ? | ? | ? |
| Security Design | ? | ? | ? | ? | ? |
| Test Strategy | ? | ? | ? | ? | ? |
| ADR Coverage | ? | ? | ? | ? | ? |

**Questions to answer:**
- Are acceptance criteria measurable and testable (not vague)?
- Are NFRs (performance, availability, scalability) defined with SLAs?
- Is there a data model / ERD documented?
- Are API contracts defined (OpenAPI / GraphQL schema)?
- How many ADRs exist? Are major decisions documented?
- Is there a security threat model?
- Is test strategy concrete (coverage targets, test types, tooling)?
- Are there gaps — undocumented services, missing design decisions?

**Store findings:**
```bash
npx @claude-flow/cli@latest memory store \
  --key "dim2-plan-quality-scores" \
  --value "<rubric scores + narrative>" \
  --namespace austa-analysis
```

---

### DIMENSION 3 — Plan-to-Purpose Adherence

**Objective:** Measure how well the plan addresses the problem, and identify misalignments.

**Tools to use:**
```bash
# Cross-dimensional semantic search
npx @claude-flow/cli@latest vector search \
  --query "user story acceptance criteria traceability requirement coverage" \
  --namespace austa-analysis --top-k 10

npx @claude-flow/cli@latest vector search \
  --query "gamification health outcome engagement evidence research" \
  --namespace austa-analysis --top-k 8

# Retrieve previously stored findings
npx @claude-flow/cli@latest memory retrieve \
  --key "dim1-purpose-summary" --namespace austa-analysis
npx @claude-flow/cli@latest memory retrieve \
  --key "dim2-plan-quality-scores" --namespace austa-analysis
```

**Analysis framework:**
- For each identified user need (from Dim 1), trace to: functional requirement → acceptance criterion → architecture component → implemented service
- Flag broken trace chains
- Identify over-engineering (planned but not justified by need)
- Identify under-coverage (user need without plan)
- Evaluate gamification: does the research (HEALTHCARE_RESEARCH_INSIGHTS_2024.md) justify the design choices in GAMIFICATION_ENGINE_ARCHITECTURE.md?
- Are the 3 journeys (Health/Care/Plan) equally well-designed, or is there imbalance?

**Questions to answer:**
- What percentage of user stories have clear acceptance criteria?
- What percentage of functional requirements trace to architecture components?
- Are there planned features with no clear user/business justification?
- Does the gamification design reflect the healthcare research findings?
- Are integration requirements (FHIR, insurance APIs, telemedicine) adequately architected?
- Is multi-tenancy / multi-language addressed throughout (not just mentioned once)?

**Store findings:**
```bash
npx @claude-flow/cli@latest memory store \
  --key "dim3-adherence-gaps" \
  --value "<gap list + trace matrix summary>" \
  --namespace austa-analysis
```

---

### DIMENSION 4 — Build Quality

**Objective:** Assess the current state of implementation: completeness, correctness, maintainability, and technical debt.

**RECON sub-phase — map what exists:**
```bash
# Count files by service
find src/backend -name "*.ts" | grep -v node_modules | grep -v ".d.ts" | grep -v ".spec" | sort | uniq -c

# Count test files (critical metric)
find src -name "*.spec.ts" -o -name "*.test.ts" -o -name "*.spec.tsx" | grep -v node_modules | wc -l

# Find TODO/FIXME/HACK markers (technical debt signals)
grep -r "TODO\|FIXME\|HACK\|WORKAROUND\|XXX" src/ --include="*.ts" --include="*.tsx" | grep -v node_modules | wc -l

# Find empty/stub files (implementation gaps)
find src/backend -name "*.ts" | grep -v node_modules | xargs wc -l | sort -n | head -30

# Check for placeholder implementations
grep -r "throw new Error('Not implemented')\|NotImplementedException\|TODO: implement\|placeholder" \
  src/ --include="*.ts" --include="*.tsx" | grep -v node_modules
```

**SONA pattern analysis:**
```bash
# Train on codebase to extract architectural patterns
npx @claude-flow/cli@latest neural train \
  --modelType transformer \
  --data-source "src/backend" \
  --epochs 5 \
  --namespace austa-analysis

# Extract patterns
npx @claude-flow/cli@latest hooks worker dispatch --trigger deepdive
npx @claude-flow/cli@latest hooks worker dispatch --trigger map
```

**Files to sample-read (representative, not exhaustive):**
```
# Core service patterns
src/backend/gamification-engine/src/app.module.ts
src/backend/gamification-engine/src/achievements/  (full directory)
src/backend/auth-service/src/auth/  (full directory)
src/backend/care-service/src/telemedicine/  (full directory)
src/backend/health-service/src/health/  (full directory)
src/backend/api-gateway/src/graphql/  (full directory)

# Frontend patterns
src/web/web/src/pages/  (list + sample 3 pages)
src/web/mobile/src/screens/  (list + sample 3 screens)
src/web/design-system/  (structure overview)
src/web/shared/  (structure overview)

# Configuration
src/backend/docker-compose.yml
src/backend/nest-cli.json
infrastructure/kubernetes/  (overview)
```

**Scoring rubric (rate each 1–5):**
| Dimension | Score | Evidence |
|---|---|---|
| Implementation completeness (% of planned features coded) | ? | |
| Test coverage (files with tests / total files) | ? | |
| Code consistency (patterns, naming, structure) | ? | |
| Error handling (try/catch, global filters, typed errors) | ? | |
| Logging & observability (OpenTelemetry usage, structured logs) | ? | |
| Database design (schema quality, migrations, indexes) | ? | |
| API design (REST/GraphQL consistency, versioning, validation) | ? | |
| Frontend completeness (pages vs planned screens) | ? | |
| Technical debt density (TODOs/FIXMEs per 1000 lines) | ? | |
| Dependency hygiene (outdated, unused, duplicated deps) | ? | |

**Questions to answer:**
- What percentage of the planned system is actually implemented?
- What is the test:source file ratio? What types of tests exist?
- Are there consistent patterns across services or is each service ad-hoc?
- Is error handling comprehensive (global exception filters, typed errors, user-facing messages)?
- Is the gamification engine fully implemented (achievements, leaderboard, quests, rewards, rules)?
- Are all 3 journey services (health, care, plan) at the same completion level?
- Is the design system complete and used consistently across web + mobile?
- Are there obvious dead code sections, commented-out blocks, or orphan files?
- Do TypeScript types reflect domain reality (proper interfaces, no `any` abuse)?

**Store findings:**
```bash
npx @claude-flow/cli@latest memory store \
  --key "dim4-build-quality-scores" \
  --value "<rubric scores + key findings>" \
  --namespace austa-analysis

npx @claude-flow/cli@latest memory store \
  --key "dim4-critical-gaps" \
  --value "<list of unimplemented features, missing tests, debt items>" \
  --namespace austa-analysis
```

---

### DIMENSION 5 — Security & Enterprise Requirements

**Objective:** Identify security vulnerabilities, deprecated/vulnerable dependencies, compliance gaps, and deviations from enterprise best practices.

**Automated security scan:**
```bash
# NPM audit for known CVEs
cd src/backend && npm audit --json 2>/dev/null | python3 -c "
import sys, json
d = json.load(sys.stdin)
vuln = d.get('vulnerabilities', {})
critical = [k for k,v in vuln.items() if v.get('severity')=='critical']
high = [k for k,v in vuln.items() if v.get('severity')=='high']
print(f'Critical: {len(critical)}, High: {len(high)}')
print('Critical packages:', critical[:10])
"

cd src/web && npm audit --json 2>/dev/null | python3 -c "
import sys, json
d = json.load(sys.stdin)
vuln = d.get('vulnerabilities', {})
critical = [k for k,v in vuln.items() if v.get('severity')=='critical']
high = [k for k,v in vuln.items() if v.get('severity')=='high']
print(f'Critical: {len(critical)}, High: {len(high)}')
"

# Check for hardcoded secrets (pattern scan)
grep -r "password\s*=\s*['\"][^'\"]\|secret\s*=\s*['\"][^'\"]\|api_key\s*=\s*['\"][^'\"]" \
  src/ --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v ".env" | grep -v "test"

# Check for .env files accidentally committed
find . -name ".env" -not -name ".env.example" | grep -v node_modules

# Check JWT configuration
grep -r "jwt\|JWT\|secret\|expiresIn" src/backend --include="*.ts" | grep -v node_modules | grep -v ".spec"

# Check for rate limiting
grep -r "RateLimit\|Throttle\|throttle\|rate.limit" src/backend --include="*.ts" | grep -v node_modules

# Check for input sanitization
grep -r "sanitize\|XSS\|csrf\|CSRF\|helmet\|cors" src/backend --include="*.ts" | grep -v node_modules
```

**Use claude-flow CVE validation for key packages:**
```bash
# Validate critical dependencies using appmod-validate-cve pattern
# Key packages to check (extract exact versions from package.json first):
# @nestjs/core, @nestjs/jwt, passport-jwt, typeorm, prisma,
# kafkajs, ioredis, jsonwebtoken, bcrypt, express, graphql,
# next, react, react-native, @apollo/client
```

**Files to read:**
```
src/backend/.env.example                    # What secrets are expected
src/backend/auth-service/src/auth/          # Full auth implementation
src/backend/api-gateway/src/guards/         # Authorization guards
src/backend/api-gateway/src/middleware/     # Security middleware
docs/design/SECURITY_ERROR_HANDLING.md     # Security design intent
docs/specifications/NON_FUNCTIONAL_REQUIREMENTS.md  # NFR security targets
infrastructure/kubernetes/                  # K8s security config (RBAC, secrets, network policies)
infrastructure/terraform/                   # Cloud security config
```

**Security checklist (assess each — PASS/FAIL/PARTIAL/NOT_IMPLEMENTED):**

| Control | Status | Evidence | Severity if Missing |
|---|---|---|---|
| Authentication (JWT/OAuth2) | ? | | CRITICAL |
| Authorization (RBAC) | ? | | CRITICAL |
| Input validation (class-validator/Zod) | ? | | HIGH |
| SQL injection prevention (parameterized queries/ORM) | ? | | CRITICAL |
| Rate limiting / throttling | ? | | HIGH |
| CORS configuration | ? | | MEDIUM |
| Helmet HTTP headers | ? | | MEDIUM |
| Secrets management (no hardcoded secrets) | ? | | CRITICAL |
| HTTPS enforcement | ? | | HIGH |
| JWT expiration / refresh rotation | ? | | HIGH |
| Password hashing (bcrypt) | ? | | CRITICAL |
| XSS prevention | ? | | HIGH |
| CSRF protection | ? | | MEDIUM |
| Dependency vulnerability scan (npm audit) | ? | | HIGH |
| Sensitive data encryption at rest | ? | | CRITICAL (HIPAA/LGPD) |
| Audit logging (who did what when) | ? | | HIGH (compliance) |
| FHIR data privacy controls | ? | | CRITICAL (HIPAA) |
| Multi-tenant data isolation | ? | | CRITICAL |
| Kubernetes security (RBAC, network policies, secrets) | ? | | HIGH |
| Biometric data handling (mobile) | ? | | CRITICAL (LGPD) |

**Compliance frameworks to assess against:**
- HIPAA (PHI handling, audit logs, encryption, access controls)
- LGPD — Lei Geral de Proteção de Dados (Brazilian GDPR equivalent)
- ANS — Agência Nacional de Saúde Suplementar (Brazilian health insurance regulator)
- OWASP Top 10 (2021 edition)
- SOC 2 Type II (if enterprise SaaS)

**Questions to answer:**
- Are there critical/high CVEs in current dependencies?
- Are any dependencies deprecated or end-of-life?
- Is multi-tenant data isolation enforced at the database/query level?
- Is PHI (Personal Health Information) encrypted at rest and in transit?
- Is there an audit trail for all PHI access?
- Are Kubernetes secrets properly managed (not in plain YAML)?
- Are container images using non-root users?
- Is there a Content Security Policy on the web app?
- Does the mobile app handle biometric data in compliance with LGPD?

**Store findings:**
```bash
npx @claude-flow/cli@latest memory store \
  --key "dim5-security-checklist" \
  --value "<checklist results>" \
  --namespace austa-analysis

npx @claude-flow/cli@latest memory store \
  --key "dim5-critical-vulnerabilities" \
  --value "<CVE list + deprecated packages + hardcoded secrets findings>" \
  --namespace austa-analysis
```

---

## SWARM SPAWN COMMAND

**After completing SESSION BOOTSTRAP above, display this command for user to execute in separate terminal:**

```bash
npx @claude-flow/cli@latest hive-mind spawn \
  --workers 8 \
  --topology hierarchical-mesh \
  --consensus byzantine \
  --claude \
  --model-routing intelligent \
  --namespace austa-analysis \
  --use-memory \
  --use-patterns \
  --use-vectors \
  --use-learning \
  --objective "
SWARM DEEP-ANALYSIS-001: 5-dimension repository analysis of AUSTA SuperApp | healthcare | 667 source files | output: REPOSITORY_DEEP_ANALYSIS.md

MEMORY: analysis-scope, dim1-purpose-summary, dim2-plan-quality-scores, dim3-adherence-gaps, dim4-build-quality-scores, dim5-security-checklist
WORKSPACE: /Users/rodrigo/claude-projects/healthcare-super-app--w-gamification--tgfzl7

PRIMARY DELIVERABLES:
1. docs/analysis/REPOSITORY_DEEP_ANALYSIS.md
2. docs/analysis/SECURITY_AUDIT.md
3. docs/analysis/BUILD_QUALITY_SCORECARD.md

ANTI-PATTERNS TO AVOID:
❌ Modifying any source files — READ ONLY
❌ Writing code — analysis and reporting only
❌ Creating PROGRESS.md, STATUS.md, TODO.md — use memory store
❌ Skipping compliance verification before starting
❌ Producing vague findings without evidence (file:line references required)

━━━ AGENT ROLES ━━━

Worker-1 (RECON-LEAD): Read all docs/specifications/ and docs/design/ files.
  Extract: purpose, user personas, functional requirements count, NFR SLAs.
  Output: internal report to memory key dim1-recon-complete.

Worker-2 (DOCS-ANALYST): Read all docs/ADRs/ and docs/original documentation/.
  Score all documentation artifacts using the rubric in the handoff.
  Output: memory key dim2-docs-scored.

Worker-3 (TRACE-ANALYST): Cross-reference user stories → acceptance criteria →
  architecture components. Build gap matrix.
  Output: memory key dim3-trace-matrix.

Worker-4 (CODE-AUDITOR-BACKEND): Sample-read backend services per handoff spec.
  Count TODOs, test files, stub implementations. Score build quality rubric.
  Output: memory key dim4-backend-scored.

Worker-5 (CODE-AUDITOR-FRONTEND): Sample-read web + mobile + design-system.
  Assess completeness, consistency, TypeScript quality.
  Output: memory key dim4-frontend-scored.

Worker-6 (SECURITY-AUDITOR): Run all security checks from handoff Dimension 5.
  Assess every security control in checklist. Check HIPAA/LGPD/OWASP alignment.
  Output: memory key dim5-security-complete.

Worker-7 (DEPENDENCY-AUDITOR): Extract all package.json files, check versions,
  identify deprecated packages, outdated majors, CVE-flagged packages.
  Output: memory key dim5-deps-audit.

Worker-8 (REPORT-SYNTHESIZER): Wait for Workers 1-7 to complete.
  Retrieve all memory keys. Synthesize into final reports.
  Write: docs/analysis/REPOSITORY_DEEP_ANALYSIS.md
  Write: docs/analysis/SECURITY_AUDIT.md
  Write: docs/analysis/BUILD_QUALITY_SCORECARD.md

SUCCESS CRITERIA:
- All 5 dimensions have scored rubrics with evidence (file:line citations)
- Security checklist 100% assessed (PASS/FAIL/PARTIAL/NOT_IMPLEMENTED per control)
- Dependency audit covers all package.json files (backend + web + mobile)
- Final report is structured, skimmable, and actionable
- All findings stored in memory namespace austa-analysis

VALIDATION COMMANDS:
ls docs/analysis/
wc -l docs/analysis/REPOSITORY_DEEP_ANALYSIS.md
wc -l docs/analysis/SECURITY_AUDIT.md
npx @claude-flow/cli@latest memory list --namespace austa-analysis

ESTIMATED TIME: 3-4 hours parallel execution
"
```

---

## FINAL REPORT STRUCTURE

The synthesizer worker (Worker-8) must produce `docs/analysis/REPOSITORY_DEEP_ANALYSIS.md` with this structure:

```markdown
# AUSTA SuperApp — Deep Repository Analysis
**Date:** <date>
**Analyst:** AI Swarm (8 workers, hierarchical-mesh, byzantine consensus)
**Scope:** 5-dimension analysis

## Executive Summary
- Overall maturity score: X/5
- Top 3 strengths
- Top 3 critical gaps
- Recommended priority actions (numbered, ranked by impact)

## Dimension 1 — Purpose & Problem Definition
[findings, personas identified, regulatory context, market clarity score]

## Dimension 2 — Plan Quality
[rubric table filled in, gaps in documentation, ADR coverage assessment]

## Dimension 3 — Plan-to-Purpose Adherence
[trace matrix summary, % coverage, misalignments, over-engineering findings]

## Dimension 4 — Build Quality
[rubric table filled in, completion %, test gap, debt density, per-service status]

## Dimension 5 — Security & Enterprise
[checklist table filled in, CVE list, compliance status, critical remediation items]

## Prioritized Recommendations
| Priority | Finding | Impact | Effort | Owner |
|---|---|---|---|---|
| P0 — Immediate | ... | CRITICAL | ... | ... |
| P1 — This Sprint | ... | HIGH | ... | ... |
| P2 — Next Sprint | ... | MEDIUM | ... | ... |
| P3 — Backlog | ... | LOW | ... | ... |

## Appendix A — File Evidence Index
[all file:line citations for findings]

## Appendix B — Dependency Audit Table
[all packages with version, latest version, CVE status, deprecation status]
```

---

## POST-ANALYSIS STEPS (After Report Complete)

```bash
# Neural train on analysis patterns (captures analysis methodology for reuse)
npx @claude-flow/cli@latest neural train \
  --modelType moe \
  --epochs 10 \
  --namespace austa-analysis

# Post-task hook
npx @claude-flow/cli@latest hooks post-task \
  --task-id "deep-analysis-001" \
  --outcome success

# Store completion
npx @claude-flow/cli@latest memory store \
  --key "deep-analysis-001-complete" \
  --value "5-dimension analysis complete. Reports at docs/analysis/. Date: $(date)" \
  --namespace austa-analysis

# Verify reports exist
ls -la docs/analysis/
```

---

## COMPLIANCE VERIFICATION (Run Before Starting Any Work)

```bash
npx @claude-flow/cli@latest --version                          # >= 3.1.0
npx @claude-flow/cli@latest hive-mind status                   # initialized
npx @claude-flow/cli@latest memory list --namespace austa-analysis   # scope stored
npx @claude-flow/cli@latest neural list                        # models available
npx @claude-flow/cli@latest hooks intelligence stats           # SONA + MoE active
```

---

## KNOWN CONTEXT (Do Not Re-Execute)

These init steps are already complete from previous session:
- claude-flow v3.0.0-alpha.151 installed and patched (4 alpha bugs fixed)
- Daemon running (PID from previous session — check with `daemon status`)
- Memory DB initialized at `.swarm/memory.db`
- Hive-mind initialized (hierarchical, byzantine, 15 max agents)
- 5 agent configs built: `agents/` (coder, architect, tester, security-architect, reviewer)
- Native modules globally installed: @ruvector/attention, @ruvector/sona, @ruvector/core, agentdb, agentic-flow
- Init guide at `.claude/claude-flow-init.yaml` (1124 lines, YAML-valid)

**If daemon is not running:**
```bash
npx @claude-flow/cli@latest daemon start
npx @claude-flow/cli@latest hooks worker dispatch --trigger map
```

---

*Handoff prepared by Architect Agent | ADR-013 compliant | DELEGATE DO NOT CODE*

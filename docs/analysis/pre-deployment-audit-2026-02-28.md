# Pre-Deployment Platform Audit — February 28, 2026

## Executive Summary

Overall Grade: **B-** (good foundation; two medium and one high finding require remediation before production launch)

| Category | Pass | Warn | Fail |
|----------|------|------|------|
| Code Quality & Integrity | 5 | 1 | 0 |
| Architecture & Design | 4 | 1 | 0 |
| Security Posture | 4 | 2 | 1 |
| CI/CD Pipeline | 10 | 0 | 0 |
| Dependency Health | 3 | 2 | 0 |
| README Accuracy | 14 | 0 | 0 |

---

## 1. Code Quality & Integrity

### Metrics

| Metric | Value |
|--------|-------|
| TypeScript/TSX files | 1,615 (669 .ts + 946 .tsx) |
| Test files | 251 (79 backend spec + 1 .test.ts + 12 e2e-spec + 159 frontend test) |
| Design system component directories | 57 |
| Mobile screens | 319 |
| Web pages | 307 |
| Navigator files | 10 |
| Typed navigators | 14 |
| HealthNavigator Stack.Screen entries | 87 (largest) |
| Hardcoded hex colors | 0 |
| as-never casts | 0 |
| Files exceeding 500 lines | 0 |
| i18n coverage | 100% (pt-BR + en-US) |
| Dark mode | Complete |
| Prisma models | 29 |
| Enums | 9 |
| Indexes | 42 |
| TypeORM references | 0 |

### Assessment

The codebase demonstrates strong structural discipline. Zero hardcoded hex colors and zero `as-never` casts reflect consistent application of the design system token contract and proper TypeScript typing. The 500-line file limit is universally respected. Full i18n coverage with both pt-BR and en-US locales, combined with complete dark mode support, confirms frontend accessibility readiness.

The test footprint of 251 files across backend, end-to-end, and frontend layers provides meaningful coverage breadth. The migration from TypeORM (0 remaining references) to Prisma (29 models, 9 enums, 42 indexes) is complete.

### Findings

| ID | Severity | Description |
|----|----------|-------------|
| CQ-01 | WARN | Test-to-source ratio: 251 test files vs. 1,615 source files (~15.5%). Recommend increasing backend integration coverage for the 29 Prisma models. |

---

## 2. Architecture & Design Compliance

### Principles Applied

| Principle | Status |
|-----------|--------|
| Domain-Driven Design with bounded contexts | PASS |
| Event sourcing for state changes | PASS |
| Input validation at system boundaries | PASS |
| Module boundaries via navigators | PASS — 10 navigators for distinct domains |
| Navigator type safety | PASS — 7/7 navigators typed with `createStackNavigator<ParamList>()` |
| ADR documentation | WARN — 4 ADRs documented (QG Wave 3); coverage is partial |
| Centralized API configuration | PASS — `api/config.ts` + 4 mock files |
| PlanNavigator correctness | PASS — 3 bugs fixed |

### Module Boundaries

The 10 navigators enforce clear domain separation: Auth, Main (Root), Home, Health, Wellness, Care, Plan, Gamification, Onboarding, and Tab. The HealthNavigator hosts 87 Stack.Screen entries — the largest single navigator — reflecting the breadth of the health domain (cycle tracking, sleep, activity, nutrition, wellness resources).

### Findings

| ID | Severity | Description |
|----|----------|-------------|
| AD-01 | WARN | Only 4 ADRs on record. Key decisions around the Prisma migration, LGPD consent model, and EAS build pipeline lack formal ADR documentation. Recommend adding ADR-005 through ADR-010 before launch. |

---

## 3. Security Posture

Overall Security Grade: **B-**

### Findings Summary

| ID | Severity | Finding |
|----|----------|---------|
| SEC-01 | HIGH | Remote Code Execution (RCE) via `new Function()` in `rules.service.ts:268`. Requires database write access to exploit. Must be remediated before production launch. |
| SEC-02 | MEDIUM | Static scrypt salt in encryption service. A fixed salt eliminates per-secret entropy; all PHI encrypted under this scheme shares the same salt, reducing brute-force resistance. |
| SEC-03 | MEDIUM | Hardcoded seed credentials in `seed.ts`: `Password123!` for `admin@austa.com.br` and `user@austa.com.br`, plus real CPF and phone numbers. Risk is LOW if the seed script never runs in production; risk escalates to HIGH if it does. |
| SEC-04 | LOW | Kubernetes containers missing security context (`runAsNonRoot`, `readOnlyRootFilesystem`). Containers run as root by default. |
| SEC-05 | LOW | Silent consent deletion skip in LGPD flow. Failure to delete consent record is swallowed without audit log entry, creating a compliance gap. |

### LGPD Compliance

| Control | Status |
|---------|--------|
| Consent management | PASS |
| Data Subject Request (DSR) handling | PASS |
| PHI encryption at rest | PASS |
| Services hardened | PASS — 7/7 |
| Dockerfiles with health probes | PASS — 7/7 |
| Audit trail completeness | WARN — SEC-05 (silent skip in LGPD flow) |
| Overall controls verified | 7/8 |

### Credentials & Secrets

| Finding | Detail |
|---------|--------|
| Secret types in workflows | 12 (including AWS IAM long-lived keys) |
| Hardcoded passwords in seed | `Password123!` x2 accounts |
| Real PII in seed | CPF numbers and phone numbers |
| Production risk | HIGH if seed.ts runs in production environment |

**Recommendation — SEC-01 (HIGH, blocking):** Replace `new Function()` in `rules.service.ts:268` with a safe expression evaluator (e.g., `vm2`, `isolated-vm`, or a purpose-built rule engine). This is a launch-blocking finding.

**Recommendation — SEC-02 (MEDIUM):** Migrate to per-secret random salts stored alongside ciphertext. Existing encrypted records will need re-encryption during a scheduled maintenance window.

**Recommendation — SEC-03 (MEDIUM):** Remove real CPF/phone numbers from `seed.ts`. Replace credentials with randomly generated test values. Add a CI guard that prevents seed scripts from running against a production `DATABASE_URL`.

---

## 4. CI/CD Remediation

Source: AUDIT-ALPHA verification (V1–V10: ALL PASS)

### Remediation Summary

All 10 GitHub Actions workflows were hardened in this audit cycle. The table below shows before/after state for each control.

| Control | Before | After | Status |
|---------|--------|-------|--------|
| Permissions declarations | 1/10 workflows | 10/10 workflows | PASS |
| Job-level `timeout-minutes` | 0/10 workflows | 31 entries across 10 workflows | PASS |
| Concurrency controls | 2/10 workflows | 10/10 workflows | PASS |
| `cancel-in-progress: false` — deploy-staging | Missing | Present | PASS |
| `cancel-in-progress: false` — deploy-production | Missing | Present | PASS |
| `contents: write` — auto-commit-push | Missing | Present | PASS |
| `packages: write` — deploy-staging | Missing | Present | PASS |
| `pull-requests: write` — eas-build | Missing | Present | PASS |
| YAML syntax validation | Unchecked | 10/10 valid | PASS |
| Files modified scope | Uncontrolled | Only `.github/workflows/*.yml` | PASS |

### Workflows Hardened

1. `backend-ci.yml`
2. `frontend-ci.yml`
3. `web-ci.yml`
4. `design-system-ci.yml`
5. `storybook-ci.yml`
6. `eas-build.yml`
7. `eas-update.yml`
8. `deploy-staging.yml`
9. `deploy-production.yml`
10. `auto-commit-push.yml`

### Open Recommendation

| ID | Severity | Description |
|----|----------|-------------|
| CICD-01 | WARN | SHA pinning not yet applied — all workflows reference actions by semver tag (e.g., `actions/checkout@v4`) rather than pinned commit SHA. Recommended for supply-chain hardening in a follow-up pass. |

---

## 5. Dependency Health

### Vulnerability Summary

| Scope | Total | High | Moderate | Low | Critical |
|-------|-------|------|----------|-----|----------|
| Backend | 27 | 17 | 6 | 4 | 0 |
| Web | 34 | 21 | 12 | 1 | 0 |
| **Combined** | **61** | **38** | **18** | **5** | **0** |

### Remediation Applied

5 high-severity CVE pins via resolutions across 3 package.json files:

| Package | From | To | Vulnerability |
|---------|------|----|---------------|
| minimatch | 3.1.3 | 3.1.4 | ReDoS |
| follow-redirects | 1.15.4/1.15.6 | 1.15.9 | Open redirect |
| terser | 5.16.6 | 5.31.6 | Code injection |
| ws | 8.17.1 | 8.18.0 | DoS |
| @fastify/middie | 9.1.0 | 9.2.0 | Path normalization |

Total: 19 version edits, 0 non-version changes.

### Residual Risk

- **1 HIGH remaining:** `serialize-javascript` RCE via `@nestjs/cli → webpack → terser-webpack-plugin` — transitive, dev-only dependency, unfixable without major version bump of `@nestjs/cli`
- 50 root overrides, 46 root resolutions
- Stale resolution pins: follow-redirects (1.15.4 behind 1.15.11), @babel/traverse (7.23.2 behind 7.28.x), terser (5.16.6 behind 5.31.1), ws (8.17.1 behind 8.18.0), minimatch (3.1.3 behind 3.1.4)

### Dependabot Configuration

- 3 ecosystems tracked: npm (4 directories), github-actions, docker
- Schedule: monthly for all, daily security scan for npm-backend only
- Major updates ignored globally

### Dependabot Gaps

| Gap | Impact |
|-----|--------|
| Terraform ecosystem absent | 28 .tf files + 7 Dockerfiles untracked |
| Docker sub-directories not fully tracked | Partial coverage |
| 5 backend service sub-packages untracked | Vulnerable transitive deps may go unpatched |
| 3 frontend sub-workspaces untracked | Same risk |
| Daily security scan broken by patch ignore | Security-only updates skipped |
| 7 stale PRs (5-9 months old) | PR54 axios, PR53 next, PR55 gamification, PR56 api-gateway, PR58 chalk |

### Verification (beta-verify-deps)

- V1 PASS: 1 high remaining (serialize-javascript, dev-only)
- V2 PASS: 5/5 version pins confirmed in resolutions
- V3 PASS: 3/3 ecosystems in dependabot.yml

## 6. README Documentation Sync

14 corrections applied across README.md (all verified via beta-verify-readme V1-V10 ALL PASS):

| # | Field | Old Value | New Value |
|---|-------|-----------|-----------|
| 1 | TS/TSX count | 1,590 | 1,615 |
| 2 | Test file count | 232 | 251 |
| 3 | DS components | 67 | 57 |
| 4 | Navigators | 10 | 14 |
| 5 | Date (glance section) | February 23, 2026 | February 28, 2026 |
| 6 | Next.js version | 14.2.29 | 14.2.35 |
| 7 | React Native version | 0.73.4 | 0.73.0 |
| 8 | Backend spec files | 72 | 79 |
| 9 | Frontend test files | 147 | 159 |
| 10 | Storybook-ci purpose | Publish Storybook artefact | Chromatic visual regression |
| 11 | Deploy-staging trigger | merge to main | push to staging / manual |
| 12 | Auto-commit-push trigger | schedule | manual (workflow_dispatch) |
| 13 | Test files (testing section) | 232 | 251 |
| 14 | Date (footer) | February 23, 2026 | February 28, 2026 |

## 7. Warnings & Recommendations

### Must-Fix Before Production (HIGH)

| ID | Finding | Remediation |
|----|---------|-------------|
| W-01 | RCE in `rules.service.ts:268` — `new Function()` allows arbitrary code execution with DB write access | Replace with safe expression evaluator (e.g., `expr-eval` or static rule engine) |
| W-02 | Static scrypt salt in encryption service | Generate unique salt per user/record |
| W-03 | Hardcoded seed credentials — `Password123!`, real CPF numbers, phone numbers in `seed.ts` | Use environment variables or secrets vault; never commit PII |

### Should-Fix Before Production (MEDIUM)

| ID | Finding | Remediation |
|----|---------|-------------|
| W-04 | SSL pinning placeholders — stubs exist but no enforcement | Implement actual certificate pinning for API traffic |
| W-05 | Docker-compose defaults may expose ports or use weak settings | Review and harden for production |
| W-06 | Kafka plaintext communication | Enable TLS for all Kafka connections |
| W-07 | K8s containers missing security context | Add `runAsNonRoot`, `readOnlyRootFilesystem`, drop capabilities |

### Recommended Improvements (LOW)

| ID | Finding | Remediation |
|----|---------|-------------|
| W-08 | All 10 workflows use semver tags instead of SHA pins | Pin to full commit SHA to prevent supply-chain attacks |
| W-09 | 7 stale Dependabot PRs (5-9 months old) | Merge or close to reduce noise |
| W-10 | `auto-commit-push` uses `git add .` | Replace with explicit file paths to prevent accidental secret commits |

## 8. Human Actions Required

The following items require team decisions before production deployment:

| # | Action | Owner | Priority | Blocking? |
|---|--------|-------|----------|-----------|
| 1 | Remediate RCE in `rules.service.ts:268` — replace `new Function()` with safe evaluator | Security Lead | HIGH | **YES** |
| 2 | Generate unique scrypt salts per user — update encryption service | Backend Lead | HIGH | **YES** |
| 3 | Remove hardcoded credentials from `seed.ts` — use env vars or vault | Backend Lead | HIGH | **YES** |
| 4 | Decide: merge or close 7 stale Dependabot PRs | Tech Lead | MEDIUM | NO |
| 5 | Add Terraform ecosystem to Dependabot config | DevOps | MEDIUM | NO |
| 6 | Track 5 backend + 3 frontend sub-packages in Dependabot | DevOps | MEDIUM | NO |
| 7 | Enable TLS for Kafka connections | Infrastructure | MEDIUM | NO |
| 8 | Add K8s securityContext to all pod specs | DevOps | MEDIUM | NO |
| 9 | Implement real SSL pinning in mobile app | Mobile Lead | MEDIUM | NO |
| 10 | SHA-pin all GitHub Actions (replace semver tags) | DevOps | LOW | NO |
| 11 | Replace `git add .` in auto-commit-push with explicit paths | DevOps | LOW | NO |
| 12 | Decide: accept serialize-javascript residual risk (dev-only) or major-bump @nestjs/cli | Tech Lead | LOW | NO |

---

## Appendix A: Dependabot Alerts Snapshot (30 Open)

*Added post-GAMMA from live GitHub Dependabot data.*

### Alert Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 18 |
| Medium | 6 |
| Low | 5 |

### Critical & High Priority (Unresolved)

| Package | Severity | Fix Available | Issue |
|---------|----------|---------------|-------|
| `fast-xml-parser` | **CRITICAL** | >= 4.5.4 / 5.3.8 | Regex injection in DOCTYPE, DoS via entity expansion, stack overflow |
| `serialize-javascript` | HIGH | >= 7.0.3 | RCE via RegExp.flags (x3 alerts, dev-only via @nestjs/cli) |
| `fastify` | HIGH | >= 5.7.3 | Content-Type bypass, DoS via sendWebStream |
| `nodemailer` | HIGH | >= 7.0.11 | DoS via recursive calls, domain confusion |
| `rollup` | HIGH | >= 3.30.0 | Arbitrary file write via path traversal |
| `@remix-run/router` | HIGH | >= 1.23.2 | XSS via open redirects |

### Resolved by BETA Swarm (via resolutions)

| Package | Pinned Version | CVE Category |
|---------|---------------|--------------|
| `minimatch` | 3.1.4 | ReDoS (x3 alerts) |
| `@fastify/middie` | 9.2.0 | Path normalization bypass (x3 alerts) |
| `follow-redirects` | 1.15.9 | SSRF |
| `ws` | 8.18.0 | DoS |
| `terser` | 5.31.6 | ReDoS |

### Open Dependabot PRs (18 total, key ones)

| PR | Title | Priority |
|----|-------|----------|
| #64 | 76 web dependency updates (Feb 28) | **Merge first** — addresses many HIGH alerts |
| #53 | next 13.4.7 -> 14.2.26 (shared) | Verify: already at 14.2.35 in resolutions |
| #41 | @nestjs/platform-fastify 9.4.3 -> 11.1.0 | Major bump — requires testing |
| #37 | GitHub Actions group (10 updates) | Low risk, merge after CI verified |

### Recommended Immediate Actions

1. **Patch `fast-xml-parser` to >= 4.5.4** — only CRITICAL alert, add to resolutions
2. **Review and merge PR #64** — 76 web updates, freshest and most comprehensive
3. **Close or rebase 7 stale PRs** from Apr-May 2025 (10 months old)
4. **Verify `next` >= 14.2.35** resolves all 5 next-related alerts

---

*Report generated by AUDIT-GAMMA swarm — February 28, 2026*
*Data sources: ALPHA (CI/CD hardening), BETA (dependency + README fixes), GAMMA (synthesis)*
*Appendix A added by orchestrator from live Dependabot data*

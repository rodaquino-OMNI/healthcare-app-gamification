# AUSTA SuperApp - Technical Constraints and Design Decisions

## 1. Architecture Constraints

### 1.1 Microservices Architecture

```yaml
Service Boundaries:
  Journey-Based Services:
    - My Health Service: All health metrics and history
    - Care Now Service: Appointments, telemedicine, treatments
    - My Plan Service: Insurance, claims, benefits
    
  Cross-Cutting Services:
    - Auth Service: Authentication and authorization
    - Gamification Engine: All gamification processing
    - Notification Service: Multi-channel notifications
    
  Shared Infrastructure:
    - API Gateway: Single entry point
    - Service Mesh: Istio for communication
    - Event Bus: Kafka for async messaging

Communication Patterns:
  Synchronous:
    - GraphQL for client-server
    - gRPC for service-to-service
    - REST for legacy/file operations
    
  Asynchronous:
    - Event streaming via Kafka
    - Message queuing for notifications
    - Pub/sub for real-time updates

Data Management:
  - Database per service pattern
  - No shared databases
  - Event sourcing for audit trail
  - CQRS for read-heavy operations
```

### 1.2 Technology Stack Constraints

```yaml
Backend Constraints:
  Runtime:
    - Node.js 18 LTS (mandatory)
    - TypeScript 5.0+ (strict mode)
    - NestJS 10+ framework
    
  Databases:
    - PostgreSQL 14+ (primary)
    - TimescaleDB (time-series)
    - Redis 7+ (caching)
    - No NoSQL for core data
    
  Messaging:
    - Apache Kafka (events)
    - Redis Pub/Sub (real-time)
    - No RabbitMQ/ActiveMQ

Frontend Constraints:
  Mobile:
    - React Native 0.72+
    - No Expo (ejected)
    - Native modules allowed
    
  Web:
    - Next.js 14+
    - React 18+
    - No Angular/Vue
    
  State Management:
    - React Query/TanStack Query
    - No Redux (except legacy)
    - Context API for local state
```

### 1.3 Infrastructure Constraints

```yaml
Cloud Platform:
  Primary: AWS (mandatory)
  Services Required:
    - EKS for Kubernetes
    - RDS for databases
    - ElastiCache for Redis
    - MSK for Kafka
    - S3 for storage
    - CloudFront for CDN
    
  Prohibited Services:
    - Lambda (except edge)
    - DynamoDB for core data
    - Amplify
    
Region Requirements:
  - Primary: sa-east-1 (São Paulo)
  - Data residency enforced
  - No cross-region user data

Deployment Constraints:
  - Kubernetes only (no ECS)
  - Docker containers
  - Helm charts for packaging
  - GitOps with ArgoCD
```

## 2. Integration Constraints

### 2.1 Healthcare System Integrations

```yaml
EHR/EMR Systems:
  Protocol: HL7 FHIR R4 only
  Limitations:
    - Read-only for external records
    - No direct database access
    - Rate limits: 100 req/min
    - Batch updates preferred
    
  Required Resources:
    - Patient
    - Observation
    - Condition
    - MedicationRequest
    - DocumentReference

Insurance Systems:
  Supported Formats:
    - REST/JSON (preferred)
    - SOAP/XML (legacy only)
    - EDI X12 (batch only)
    
  Constraints:
    - Real-time limited to eligibility
    - Claims batch processing
    - 24-hour settlement cycle
    - No direct database links

Telemedicine Platform:
  Requirements:
    - WebRTC compliance
    - TURN/STUN servers
    - Maximum 4 participants
    - Recording optional
    
  Bandwidth:
    - Minimum: 1 Mbps
    - Target: 2.5 Mbps
    - HD video: 5 Mbps
```

### 2.2 Device Integrations

```yaml
Wearable Devices:
  iOS Constraints:
    - HealthKit only
    - No direct Bluetooth
    - Background sync limited
    - User consent required
    
  Android Constraints:
    - Health Connect API
    - Google Fit deprecated
    - Foreground service required
    - Battery optimization exempt
    
  Data Limitations:
    - 7-day history sync
    - 5-minute minimum intervals
    - Aggregated data only
    - No raw sensor access

Medical Devices:
  - No direct integration
  - Manual entry only
  - Photo capture for readings
  - OCR for digitization
```

### 2.3 Payment Processing

```yaml
Payment Constraints:
  Supported Methods:
    - Credit/Debit cards
    - PIX (Brazil)
    - Bank transfer (batch)
    - No cryptocurrencies
    
  Compliance:
    - PCI DSS required
    - No card storage
    - Tokenization mandatory
    - 3D Secure for cards
    
  Limitations:
    - Single currency (BRL)
    - No international payments
    - Refunds within 180 days
    - Minimum transaction: R$1
```

## 3. Security Constraints

### 3.1 Authentication & Authorization

```yaml
Authentication Requirements:
  Mandatory:
    - JWT tokens only
    - No session cookies
    - Stateless authentication
    - Refresh token rotation
    
  MFA Constraints:
    - SMS backup required
    - TOTP apps supported
    - No email-only MFA
    - Biometric optional
    
  Password Policy:
    - Minimum 8 characters
    - No maximum length
    - Unicode support
    - Breach checking

Authorization Model:
  - RBAC only (no ABAC)
  - Journey-based permissions
  - No dynamic permissions
  - Deny by default
```

### 3.2 Data Security

```yaml
Encryption Requirements:
  Algorithms:
    - AES-256-GCM only
    - RSA-2048 minimum
    - ECDSA for signatures
    - SHA-256 for hashing
    
  Prohibited:
    - MD5 (any use)
    - SHA-1 (except git)
    - DES/3DES
    - Custom crypto

Key Management:
  - AWS KMS required
  - No local key storage
  - Rotation every 90 days
  - Separate keys per service

Data Classification:
  Public: No encryption required
  Internal: Encryption in transit
  Confidential: Encryption at rest
  Restricted: Double encryption
```

### 3.3 Network Security

```yaml
Network Constraints:
  - VPC isolation required
  - No public database access
  - Private subnets for services
  - NAT gateway for egress
  
  Prohibited:
    - Direct internet exposure
    - Cross-VPC peering
    - Public S3 buckets
    - Open security groups

API Security:
  - Rate limiting mandatory
  - API keys prohibited
  - OAuth 2.0 only
  - No basic authentication
```

## 4. Performance Constraints

### 4.1 Latency Requirements

```yaml
API Latency Budgets:
  Total Budget: 1000ms (p95)
  Breakdown:
    - Network RTT: 50ms
    - API Gateway: 20ms
    - Service Logic: 200ms
    - Database Query: 100ms
    - Cache Lookup: 5ms
    - Response Serialization: 25ms
    - Margin: 600ms

Critical Path Optimization:
  - Health Dashboard: 500ms max
  - Appointment Booking: 1s max
  - Claim Submission: 2s max
  - Gamification Event: 100ms max
```

### 4.2 Throughput Constraints

```yaml
Service Limits:
  API Gateway:
    - 1000 req/s per instance
    - 100 req/s per user
    - 50MB/s per instance
    
  Microservices:
    - 500 req/s per instance
    - 100 concurrent requests
    - 30s timeout maximum
    
  Database:
    - 10000 connections total
    - 100 connections per service
    - 5000 queries/second

Message Processing:
  Kafka:
    - 10000 msg/s per partition
    - 1MB max message size
    - 7 days retention
    
  Redis:
    - 100000 ops/second
    - 512MB max value size
    - 24 hour TTL default
```

### 4.3 Resource Constraints

```yaml
Memory Limits:
  Services:
    - API Gateway: 4GB max
    - Microservices: 2GB max
    - Gamification: 8GB max
    - Node.js heap: 1.5GB
    
  Databases:
    - PostgreSQL: 64GB RAM
    - Redis: 16GB per instance
    - Buffer pool: 70% of RAM

CPU Allocation:
  - 2 vCPU minimum
  - 8 vCPU maximum
  - No CPU overcommit
  - Guaranteed QoS

Storage Constraints:
  - 100GB per database
  - 10TB total object storage
  - 30 day log retention
  - No local disk storage
```

## 5. Operational Constraints

### 5.1 Deployment Constraints

```yaml
Release Process:
  Frequency:
    - Production: Weekly
    - Hotfixes: As needed
    - Major versions: Monthly
    
  Requirements:
    - Blue-green mandatory
    - Rollback < 5 minutes
    - Database migration safe
    - Feature flags required
    
  Prohibited:
    - Direct production changes
    - Unversioned deployments
    - Breaking API changes
    - Downtime deployments

Environment Constraints:
  - 3 environments minimum
  - Production-like staging
  - Isolated databases
  - No shared secrets
```

### 5.2 Monitoring Constraints

```yaml
Observability Requirements:
  Metrics:
    - Prometheus format only
    - 15s scrape interval
    - 90 day retention
    - No custom protocols
    
  Logging:
    - JSON structured logs
    - UTF-8 encoding only
    - No PII in logs
    - Centralized only
    
  Tracing:
    - OpenTelemetry only
    - 100% critical paths
    - 1% sampling others
    - 7 day retention

Alerting Constraints:
  - SLO-based alerts only
  - No threshold alerts
  - 5 minute minimum window
  - Escalation required
```

### 5.3 Maintenance Windows

```yaml
Scheduled Maintenance:
  Allowed:
    - Sunday 2-4 AM BRT
    - 2 hours maximum
    - 7 days notice
    
  Prohibited:
    - Business hours
    - Month-end
    - Holidays
    - Peak usage times

Emergency Maintenance:
  - Requires approval
  - Incident required
  - Communication plan
  - Rollback ready
```

## 6. Compliance Constraints

### 6.1 Data Residency

```yaml
Location Requirements:
  User Data:
    - Must remain in Brazil
    - No offshore backup
    - No CDN for PII
    
  Exceptions:
    - Anonymous analytics
    - Public content
    - Error tracking (sanitized)

Cross-Border Transfers:
  Prohibited:
    - Health records
    - Personal information
    - Payment data
    
  Allowed:
    - Aggregated metrics
    - Technical logs (no PII)
    - Public content
```

### 6.2 Audit Requirements

```yaml
Audit Logging:
  Mandatory Events:
    - All authentication
    - Data access (CRD)
    - Permission changes
    - Admin actions
    
  Format Requirements:
    - Immutable logs
    - Timestamped (UTC)
    - User correlation
    - Change details

Retention Periods:
  - Access logs: 6 months
  - Security logs: 1 year
  - Health records: 20 years
  - Financial records: 7 years
```

### 6.3 Privacy Constraints

```yaml
LGPD Compliance:
  User Rights:
    - Access within 15 days
    - Deletion within 30 days
    - Portability in FHIR
    - Consent tracking
    
  Prohibited:
    - Profiling for marketing
    - Data sale/sharing
    - Behavioral tracking
    - Third-party cookies

Consent Management:
  - Granular consent
  - Easy withdrawal
  - Version tracking
  - Audit trail
```

## 7. Development Constraints

### 7.1 Code Standards

```yaml
Language Requirements:
  TypeScript:
    - Strict mode enabled
    - No any types
    - No ts-ignore
    - 100% type coverage
    
  Code Style:
    - ESLint enforced
    - Prettier formatted
    - No console.log
    - No commented code

Architecture Rules:
  - DDD boundaries
  - No circular dependencies
  - Interface segregation
  - Dependency injection
```

### 7.2 Testing Requirements

```yaml
Coverage Requirements:
  - Unit tests: 80% minimum
  - Integration: 70% minimum
  - E2E: Critical paths only
  - Performance: Load tests

Test Constraints:
  - No production data
  - Mocked external services
  - Deterministic results
  - < 10 minute suite

Prohibited Practices:
  - Skipped tests
  - Hard-coded values
  - Time-dependent tests
  - Network calls in unit tests
```

### 7.3 Documentation

```yaml
Required Documentation:
  - API documentation (OpenAPI)
  - Architecture diagrams
  - Runbooks
  - Deployment guides

Documentation Format:
  - Markdown only
  - Versioned with code
  - Examples required
  - Diagrams as code

Prohibited:
  - Word documents
  - Outdated wikis
  - Oral knowledge
  - External systems
```

## 8. Third-Party Constraints

### 8.1 Vendor Lock-in

```yaml
Acceptable Dependencies:
  - AWS services (IaaS)
  - Open source libraries
  - Standards-based protocols
  
Avoid:
  - Proprietary formats
  - Single-vendor solutions
  - Closed protocols
  - Non-portable services

Exit Strategy Required:
  - Data export capability
  - Standard formats
  - Migration tools
  - Documentation
```

### 8.2 License Restrictions

```yaml
Approved Licenses:
  - MIT
  - Apache 2.0
  - BSD (2/3 clause)
  - PostgreSQL
  
Restricted:
    - No modification
    - Commercial use

  
Prohibited:
  - AGPL
  - Commercial only
  - No redistribution
```

### 8.3 Support Requirements

```yaml
Vendor Support:
  - 24/7 for critical
  - SLA required
  - Brazil presence
  - Portuguese support
  
Open Source:
  - Active community
  - Recent commits
  - Security updates
  - Documentation
```
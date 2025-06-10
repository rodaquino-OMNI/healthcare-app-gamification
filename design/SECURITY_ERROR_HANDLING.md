# Security and Error Handling Patterns

> **Security Foundation**: Healthcare applications have the highest data breach costs for 13 consecutive years. This design implements defense-in-depth with LGPD compliance, NIST encryption standards, and comprehensive error handling.

## 1. Security Architecture

### 1.1 Defense-in-Depth Strategy

```yaml
Security Layers:
  Network Layer:
    - AWS WAF with healthcare-specific rules
    - DDoS protection (CloudFront + Shield)
    - VPC isolation with private subnets
    - Network ACLs and Security Groups
    
  Application Layer:
    - OAuth 2.0 + JWT (RS384)
    - RBAC with journey-based permissions
    - Input validation and sanitization
    - CSRF protection
    - Rate limiting
    
  Data Layer:
    - Encryption at rest (AES-256)
    - Encryption in transit (TLS 1.3)
    - Field-level encryption for PII
    - Key rotation every 90 days
    
  Operational Layer:
    - Security monitoring (SIEM)
    - Intrusion detection
    - Vulnerability scanning
    - Incident response plan
```

### 1.2 Authentication Architecture

```typescript
// Multi-Factor Authentication System
export class AuthenticationService {
  private readonly tokenConfig = {
    algorithm: 'RS384' as const,
    expiresIn: '5m', // Research: Short-lived tokens for healthcare
    refreshExpiresIn: '7d',
    issuer: 'austa-health',
    audience: 'austa-superapp',
  };
  
  async authenticate(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Validate input to prevent injection
      this.validateCredentials(credentials);
      
      // Check rate limiting
      await this.checkRateLimit(credentials.email);
      
      // Verify user credentials
      const user = await this.verifyUser(credentials);
      
      // Check if MFA is required
      if (this.requiresMFA(user)) {
        return this.initiateMFA(user);
      }
      
      // Generate tokens
      return this.generateAuthTokens(user);
      
    } catch (error) {
      // Log security event
      await this.logSecurityEvent({
        type: 'authentication_attempt',
        success: false,
        email: credentials.email,
        reason: error.message,
        ip: this.request.ip,
      });
      
      // Return generic error to prevent information leakage
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  
  private async verifyUser(credentials: LoginCredentials): Promise<User> {
    const user = await this.userRepository.findByEmail(credentials.email);
    
    if (!user) {
      // Perform dummy password check to prevent timing attacks
      await bcrypt.compare(credentials.password, '$2b$10$dummy.hash');
      throw new InvalidCredentialsError();
    }
    
    // Check account status
    if (user.status === 'locked') {
      throw new AccountLockedException();
    }
    
    // Verify password
    const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
    
    if (!isValid) {
      await this.handleFailedLogin(user);
      throw new InvalidCredentialsError();
    }
    
    // Reset failed attempts on successful login
    await this.resetFailedAttempts(user.id);
    
    return user;
  }
  
  private async handleFailedLogin(user: User): Promise<void> {
    const attempts = await this.incrementFailedAttempts(user.id);
    
    if (attempts >= 5) {
      await this.lockAccount(user.id);
      
      // Send security alert
      await this.notificationService.sendSecurityAlert(user, {
        type: 'account_locked',
        reason: 'multiple_failed_attempts',
      });
    }
  }
  
  private requiresMFA(user: User): boolean {
    // Always require MFA for:
    // - Admin users
    // - Users accessing sensitive data
    // - Unusual login patterns
    return (
      user.role === 'ADMIN' ||
      user.permissions.includes('view_all_health_data') ||
      this.detectUnusualLogin(user)
    );
  }
  
  private async generateAuthTokens(user: User): Promise<AuthTokens> {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
      journey: user.currentJourney,
      sessionId: uuidv4(),
    };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payload, this.tokenConfig.expiresIn),
      this.signToken(
        { sub: user.id, sessionId: payload.sessionId },
        this.tokenConfig.refreshExpiresIn
      ),
    ]);
    
    // Store session in Redis
    await this.sessionStore.create({
      sessionId: payload.sessionId,
      userId: user.id,
      createdAt: new Date(),
      expiresAt: addDays(new Date(), 7),
    });
    
    return { accessToken, refreshToken };
  }
}

// MFA Implementation
export class MFAService {
  async initiateMFA(user: User, method: MFAMethod): Promise<MFAChallenge> {
    switch (method) {
      case 'SMS':
        return this.sendSMSChallenge(user);
      case 'TOTP':
        return this.createTOTPChallenge(user);
      case 'BIOMETRIC':
        return this.initiateBiometricChallenge(user);
      case 'VOICE':
        // Research: 30% of routine inquiries via voice by 2024
        return this.initiateVoiceChallenge(user);
      default:
        throw new UnsupportedMFAMethodError();
    }
  }
  
  async verifyMFA(
    userId: string,
    challengeId: string,
    response: string
  ): Promise<boolean> {
    const challenge = await this.getChallengeWithLock(challengeId);
    
    if (!challenge || challenge.userId !== userId) {
      throw new InvalidChallengeError();
    }
    
    if (challenge.attempts >= 3) {
      throw new ChallengeExpiredError();
    }
    
    if (new Date() > challenge.expiresAt) {
      throw new ChallengeExpiredError();
    }
    
    try {
      const isValid = await this.verifyResponse(challenge, response);
      
      if (isValid) {
        await this.markChallengeUsed(challengeId);
        return true;
      } else {
        await this.incrementAttempts(challengeId);
        return false;
      }
    } catch (error) {
      await this.logMFAFailure(userId, challenge, error);
      throw error;
    }
  }
}
```

### 1.3 Authorization Patterns

```typescript
// Role-Based Access Control with Journey Context
export class AuthorizationService {
  private readonly permissionMatrix = {
    // Journey-based permissions
    health: {
      read_own: ['PATIENT', 'PROVIDER', 'ADMIN'],
      read_delegated: ['CAREGIVER', 'PROVIDER'],
      write_own: ['PATIENT', 'ADMIN'],
      write_delegated: ['CAREGIVER'],
    },
    care: {
      book_appointment: ['PATIENT', 'CAREGIVER', 'ADMIN'],
      view_appointments: ['PATIENT', 'CAREGIVER', 'PROVIDER', 'ADMIN'],
      start_telemedicine: ['PATIENT', 'PROVIDER'],
    },
    plan: {
      view_coverage: ['PATIENT', 'CAREGIVER', 'ADMIN'],
      submit_claim: ['PATIENT', 'CAREGIVER', 'PROVIDER'],
      approve_claim: ['ADMIN', 'CLAIMS_PROCESSOR'],
    },
  };
  
  async authorize(
    user: AuthenticatedUser,
    resource: string,
    action: string
  ): Promise<boolean> {
    // Check if user has explicit permission
    if (user.permissions.includes(`${resource}:${action}`)) {
      return true;
    }
    
    // Check role-based permissions
    const journey = this.extractJourney(resource);
    const allowedRoles = this.permissionMatrix[journey]?.[action] || [];
    
    if (user.roles.some(role => allowedRoles.includes(role))) {
      // Additional context checks
      return this.checkContextualPermissions(user, resource, action);
    }
    
    // Check delegated access
    if (await this.hasDelegatedAccess(user, resource)) {
      return this.checkDelegatedPermissions(user, resource, action);
    }
    
    // Log unauthorized access attempt
    await this.logUnauthorizedAccess(user, resource, action);
    
    return false;
  }
  
  private async checkContextualPermissions(
    user: AuthenticatedUser,
    resource: string,
    action: string
  ): Promise<boolean> {
    // Time-based restrictions
    if (this.hasTimeRestriction(resource)) {
      const allowed = await this.checkTimeWindow(user, resource);
      if (!allowed) return false;
    }
    
    // Location-based restrictions
    if (this.hasLocationRestriction(resource)) {
      const allowed = await this.checkLocation(user, resource);
      if (!allowed) return false;
    }
    
    // Resource ownership check
    if (action.includes('own')) {
      return this.verifyOwnership(user, resource);
    }
    
    return true;
  }
}

// Attribute-Based Access Control for Fine-Grained Permissions
export class ABACPolicy {
  async evaluate(context: AccessContext): Promise<AccessDecision> {
    const policies = await this.loadPolicies(context.resource);
    
    for (const policy of policies) {
      const decision = await this.evaluatePolicy(policy, context);
      
      if (decision.effect === 'DENY') {
        return decision; // Explicit deny takes precedence
      }
    }
    
    // Default deny if no explicit allow
    return {
      effect: 'DENY',
      reason: 'No matching policy found',
    };
  }
  
  private async evaluatePolicy(
    policy: Policy,
    context: AccessContext
  ): Promise<AccessDecision> {
    // Evaluate all conditions
    for (const condition of policy.conditions) {
      if (!await this.evaluateCondition(condition, context)) {
        return { effect: 'NOT_APPLICABLE' };
      }
    }
    
    // All conditions met
    return {
      effect: policy.effect,
      obligations: policy.obligations, // Additional actions required
    };
  }
}
```

## 2. Data Security Patterns

### 2.1 Encryption Architecture

```typescript
// Field-Level Encryption for Sensitive Data
export class EncryptionService {
  private readonly config = {
    algorithm: 'aes-256-gcm',
    keyDerivation: 'pbkdf2',
    iterations: 100000,
    saltLength: 32,
    tagLength: 16,
  };
  
  async encryptField(data: string, context: EncryptionContext): Promise<EncryptedData> {
    // Get or generate data encryption key
    const dek = await this.getDataEncryptionKey(context);
    
    // Generate IV for this encryption
    const iv = crypto.randomBytes(16);
    
    // Encrypt data
    const cipher = crypto.createCipheriv(this.config.algorithm, dek.key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final(),
    ]);
    
    const tag = cipher.getAuthTag();
    
    // Return encrypted data with metadata
    return {
      ciphertext: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64'),
      keyId: dek.id,
      algorithm: this.config.algorithm,
      context: context.serialize(),
    };
  }
  
  async decryptField(encryptedData: EncryptedData): Promise<string> {
    // Validate encrypted data structure
    this.validateEncryptedData(encryptedData);
    
    // Get decryption key
    const dek = await this.getDecryptionKey(encryptedData.keyId);
    
    // Decrypt
    const decipher = crypto.createDecipheriv(
      encryptedData.algorithm,
      dek.key,
      Buffer.from(encryptedData.iv, 'base64')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'base64'));
    
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedData.ciphertext, 'base64')),
      decipher.final(),
    ]);
    
    // Audit decryption
    await this.auditDecryption(encryptedData.context);
    
    return decrypted.toString('utf8');
  }
  
  private async getDataEncryptionKey(context: EncryptionContext): Promise<DEK> {
    // Check cache first
    const cached = await this.keyCache.get(context.keyId);
    if (cached && !this.isKeyExpired(cached)) {
      return cached;
    }
    
    // Get from KMS
    const kmsKey = await this.kms.generateDataKey({
      KeyId: context.masterKeyId,
      KeySpec: 'AES_256',
      EncryptionContext: {
        purpose: context.purpose,
        journey: context.journey,
        sensitivityLevel: context.sensitivityLevel,
      },
    });
    
    const dek = {
      id: uuidv4(),
      key: kmsKey.Plaintext,
      encryptedKey: kmsKey.CiphertextBlob,
      createdAt: new Date(),
      expiresAt: addHours(new Date(), 24),
    };
    
    // Cache for reuse
    await this.keyCache.set(context.keyId, dek, 3600); // 1 hour
    
    return dek;
  }
}

// Database Encryption
export class DatabaseEncryption {
  // Transparent encryption for specific columns
  @Entity()
  export class UserHealthData {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    userId: string;
    
    @Column({
      type: 'text',
      transformer: new EncryptedColumnTransformer('health_data'),
    })
    medicalHistory: string; // Automatically encrypted/decrypted
    
    @Column({
      type: 'text',
      transformer: new EncryptedColumnTransformer('pii'),
    })
    socialSecurityNumber: string;
    
    @Column({
      type: 'jsonb',
      transformer: new EncryptedJSONTransformer('health_metrics'),
    })
    sensitiveMetrics: Record<string, any>;
  }
}
```

### 2.2 Secure Communication Patterns

```typescript
// End-to-End Encryption for Telemedicine
export class SecureCommunicationService {
  async establishSecureChannel(
    participants: Participant[]
  ): Promise<SecureChannel> {
    // Generate session keys
    const sessionKey = await this.generateSessionKey();
    
    // Create encrypted key packages for each participant
    const keyPackages = await Promise.all(
      participants.map(async (participant) => ({
        participantId: participant.id,
        encryptedKey: await this.encryptForParticipant(
          sessionKey,
          participant.publicKey
        ),
      }))
    );
    
    // Create secure channel
    const channel = {
      id: uuidv4(),
      sessionKey,
      participants,
      keyPackages,
      createdAt: new Date(),
      expiresAt: addHours(new Date(), 1),
    };
    
    // Store channel info (without session key)
    await this.channelStore.create(channel);
    
    return channel;
  }
  
  async encryptMessage(
    channelId: string,
    message: string,
    senderId: string
  ): Promise<EncryptedMessage> {
    const channel = await this.getChannel(channelId);
    
    // Verify sender is participant
    if (!channel.participants.some(p => p.id === senderId)) {
      throw new UnauthorizedChannelAccessError();
    }
    
    // Encrypt message
    const encrypted = await this.symmetricEncrypt(message, channel.sessionKey);
    
    // Sign message
    const signature = await this.signMessage(encrypted, senderId);
    
    return {
      channelId,
      senderId,
      ciphertext: encrypted,
      signature,
      timestamp: new Date(),
    };
  }
}
```

## 3. Error Handling Architecture

### 3.1 Structured Error Handling

```typescript
// Base Error Classes with Context
export abstract class BaseError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context: ErrorContext;
  
  constructor(
    message: string,
    code: string,
    statusCode: number,
    isOperational: boolean,
    context?: ErrorContext
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context || {};
    
    Error.captureStackTrace(this, this.constructor);
  }
  
  toJSON(): ErrorResponse {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(process.env.NODE_ENV !== 'production' && {
          stack: this.stack,
          context: this.context,
        }),
      },
    };
  }
}

// Domain-Specific Errors
export class HealthDataError extends BaseError {
  constructor(message: string, context?: ErrorContext) {
    super(
      message,
      'HEALTH_DATA_ERROR',
      400,
      true,
      { ...context, domain: 'health' }
    );
  }
}

export class CriticalHealthAlertError extends BaseError {
  constructor(metric: HealthMetric, threshold: Threshold) {
    super(
      'Critical health metric detected',
      'CRITICAL_HEALTH_ALERT',
      500,
      true,
      {
        metric: metric.type,
        value: metric.value,
        threshold: threshold.max,
        severity: 'CRITICAL',
      }
    );
  }
}

// Gamification-Specific Errors
export class AntiGamingViolationError extends BaseError {
  constructor(userId: string, violation: string, evidence: any) {
    super(
      'Gaming behavior detected',
      'ANTI_GAMING_VIOLATION',
      403,
      true,
      {
        userId,
        violation,
        evidence,
        action: 'blocked',
      }
    );
  }
}
```

### 3.2 Global Error Handler

```typescript
// Centralized Error Handling Middleware
export class GlobalErrorHandler {
  private readonly logger: Logger;
  private readonly monitoring: MonitoringService;
  private readonly notification: NotificationService;
  
  async handle(
    error: Error,
    request: Request,
    response: Response
  ): Promise<void> {
    // Log error with context
    const errorContext = this.buildErrorContext(error, request);
    await this.logError(error, errorContext);
    
    // Determine error severity
    const severity = this.calculateSeverity(error);
    
    // Handle based on severity
    switch (severity) {
      case 'CRITICAL':
        await this.handleCriticalError(error, errorContext);
        break;
      case 'HIGH':
        await this.handleHighSeverityError(error, errorContext);
        break;
      case 'MEDIUM':
        await this.handleMediumSeverityError(error, errorContext);
        break;
      default:
        await this.handleLowSeverityError(error, errorContext);
    }
    
    // Send appropriate response
    const errorResponse = this.buildErrorResponse(error, errorContext);
    response.status(errorResponse.statusCode).json(errorResponse);
  }
  
  private async handleCriticalError(
    error: Error,
    context: ErrorContext
  ): Promise<void> {
    // Page incident response team
    await this.notification.pageOnCall({
      error: error.message,
      severity: 'CRITICAL',
      context,
    });
    
    // Create incident
    const incident = await this.incidentService.create({
      title: `Critical Error: ${error.message}`,
      severity: 'CRITICAL',
      service: context.service,
      error,
    });
    
    // Start incident response workflow
    await this.incidentWorkflow.start(incident);
    
    // Enable circuit breaker if needed
    if (this.shouldTripCircuitBreaker(error, context)) {
      await this.circuitBreaker.open(context.service);
    }
  }
  
  private buildErrorResponse(
    error: Error,
    context: ErrorContext
  ): ErrorResponse {
    // Never expose sensitive information
    if (error instanceof BaseError && error.isOperational) {
      return {
        statusCode: error.statusCode,
        error: {
          code: error.code,
          message: this.sanitizeMessage(error.message),
          correlationId: context.correlationId,
          timestamp: new Date().toISOString(),
        },
      };
    }
    
    // Generic error for unexpected errors
    return {
      statusCode: 500,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
        correlationId: context.correlationId,
        timestamp: new Date().toISOString(),
      },
    };
  }
  
  private sanitizeMessage(message: string): string {
    // Remove sensitive data patterns
    const patterns = [
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
      /\b\d{11}\b/g, // CPF
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit Card
    ];
    
    let sanitized = message;
    patterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });
    
    return sanitized;
  }
}
```

### 3.3 Error Recovery Patterns

```typescript
// Circuit Breaker with Error Recovery
export class ResilientService {
  private circuitBreaker: CircuitBreaker;
  private retryPolicy: RetryPolicy;
  private fallbackHandler: FallbackHandler;
  
  async executeWithResilience<T>(
    operation: () => Promise<T>,
    options: ResilienceOptions
  ): Promise<T> {
    try {
      // Execute through circuit breaker
      return await this.circuitBreaker.execute(async () => {
        // Apply retry policy
        return await this.retryPolicy.execute(operation);
      });
    } catch (error) {
      // Log failure
      this.logger.error('Operation failed after retries', {
        error,
        operation: options.operationName,
        attempts: this.retryPolicy.attempts,
      });
      
      // Try fallback
      if (options.fallback) {
        return await this.fallbackHandler.execute(options.fallback);
      }
      
      // Re-throw if no fallback
      throw error;
    }
  }
}

// Saga Pattern for Distributed Transactions
export class SagaOrchestrator {
  async execute<T>(saga: Saga<T>): Promise<T> {
    const executedSteps: ExecutedStep[] = [];
    const sagaId = uuidv4();
    
    try {
      // Execute saga steps
      for (const step of saga.steps) {
        const result = await this.executeStep(step, sagaId);
        executedSteps.push({ step, result });
        
        // Check if should continue
        if (result.shouldHalt) {
          break;
        }
      }
      
      // Complete saga
      await this.completeSaga(sagaId, executedSteps);
      return this.buildSagaResult(executedSteps);
      
    } catch (error) {
      // Compensate in reverse order
      await this.compensate(executedSteps.reverse(), sagaId);
      
      // Emit saga failure event
      await this.eventBus.emit('saga.failed', {
        sagaId,
        error,
        compensated: true,
      });
      
      throw new SagaFailedError(sagaId, error);
    }
  }
  
  private async compensate(
    steps: ExecutedStep[],
    sagaId: string
  ): Promise<void> {
    for (const { step, result } of steps) {
      try {
        await step.compensate(result);
        
        await this.logCompensation(sagaId, step, 'SUCCESS');
      } catch (compensationError) {
        // Log but continue compensating
        await this.logCompensation(sagaId, step, 'FAILED', compensationError);
        
        // Alert for manual intervention
        await this.alertManualIntervention(sagaId, step, compensationError);
      }
    }
  }
}
```

## 4. Security Monitoring and Incident Response

### 4.1 Security Event Monitoring

```typescript
// Real-time Security Monitoring
export class SecurityMonitor {
  private readonly detectors = [
    new BruteForceDetector(),
    new AnomalousAccessDetector(),
    new DataExfiltrationDetector(),
    new PrivilegeEscalationDetector(),
    new SuspiciousPatternDetector(),
  ];
  
  async analyzeEvent(event: SecurityEvent): Promise<ThreatAssessment> {
    // Run all detectors in parallel
    const detections = await Promise.all(
      this.detectors.map(detector => detector.analyze(event))
    );
    
    // Aggregate threat level
    const threatLevel = this.calculateThreatLevel(detections);
    
    // Take automated action if needed
    if (threatLevel >= ThreatLevel.HIGH) {
      await this.respondToThreat(event, threatLevel, detections);
    }
    
    // Store for analysis
    await this.securityEventStore.store({
      event,
      detections,
      threatLevel,
      timestamp: new Date(),
    });
    
    return {
      threatLevel,
      detections: detections.filter(d => d.detected),
      recommendedActions: this.getRecommendedActions(threatLevel, detections),
    };
  }
  
  private async respondToThreat(
    event: SecurityEvent,
    threatLevel: ThreatLevel,
    detections: Detection[]
  ): Promise<void> {
    // Immediate actions
    const actions = [];
    
    if (threatLevel === ThreatLevel.CRITICAL) {
      // Block user/IP immediately
      actions.push(this.blockAccess(event.userId, event.ip));
      
      // Terminate active sessions
      actions.push(this.terminateSessions(event.userId));
      
      // Alert security team
      actions.push(this.alertSecurityTeam(event, detections));
    }
    
    if (threatLevel === ThreatLevel.HIGH) {
      // Require re-authentication
      actions.push(this.forceReauthentication(event.userId));
      
      // Increase monitoring
      actions.push(this.enableEnhancedMonitoring(event.userId));
    }
    
    await Promise.all(actions);
    
    // Log response
    await this.auditLog.logSecurityResponse({
      event,
      threatLevel,
      actions: actions.map(a => a.name),
      timestamp: new Date(),
    });
  }
}

// Anomaly Detection
export class AnomalousAccessDetector {
  async analyze(event: SecurityEvent): Promise<Detection> {
    const userProfile = await this.getUserSecurityProfile(event.userId);
    
    // Check various anomalies
    const anomalies = await Promise.all([
      this.checkLocationAnomaly(event, userProfile),
      this.checkTimeAnomaly(event, userProfile),
      this.checkDeviceAnomaly(event, userProfile),
      this.checkBehaviorAnomaly(event, userProfile),
    ]);
    
    const detectedAnomalies = anomalies.filter(a => a.detected);
    
    if (detectedAnomalies.length > 0) {
      return {
        detected: true,
        confidence: this.calculateConfidence(detectedAnomalies),
        details: detectedAnomalies,
        severity: this.calculateSeverity(detectedAnomalies),
      };
    }
    
    return { detected: false };
  }
  
  private async checkLocationAnomaly(
    event: SecurityEvent,
    profile: UserSecurityProfile
  ): Promise<AnomalyCheck> {
    const currentLocation = await this.geolocate(event.ip);
    const lastLocation = profile.lastKnownLocation;
    
    if (!lastLocation) {
      return { detected: false, type: 'location' };
    }
    
    const distance = this.calculateDistance(currentLocation, lastLocation);
    const timeDiff = Date.now() - profile.lastAccessTime;
    const speed = distance / (timeDiff / 3600000); // km/h
    
    // Impossible travel speed
    if (speed > 1000) {
      return {
        detected: true,
        type: 'location',
        severity: 'HIGH',
        details: {
          distance,
          timeDiff,
          speed,
          message: 'Impossible travel detected',
        },
      };
    }
    
    return { detected: false, type: 'location' };
  }
}
```

### 4.2 Incident Response Automation

```typescript
// Automated Incident Response
export class IncidentResponseSystem {
  async handleSecurityIncident(incident: SecurityIncident): Promise<void> {
    // Create incident record
    const incidentId = await this.createIncident(incident);
    
    // Execute playbook based on incident type
    const playbook = this.selectPlaybook(incident.type);
    await this.executePlaybook(playbook, incident);
    
    // Notify stakeholders
    await this.notifyStakeholders(incident);
    
    // Start evidence collection
    await this.collectEvidence(incident);
    
    // Monitor incident progress
    this.monitorIncident(incidentId);
  }
  
  private async executePlaybook(
    playbook: IncidentPlaybook,
    incident: SecurityIncident
  ): Promise<void> {
    for (const step of playbook.steps) {
      try {
        await this.executeStep(step, incident);
        
        await this.logStepCompletion(incident.id, step);
      } catch (error) {
        await this.handleStepFailure(incident.id, step, error);
        
        if (step.critical) {
          throw new PlaybookExecutionError(step, error);
        }
      }
    }
  }
  
  private async collectEvidence(incident: SecurityIncident): Promise<void> {
    const evidence = await Promise.all([
      this.collectLogs(incident),
      this.collectNetworkTraffic(incident),
      this.collectSystemState(incident),
      this.collectUserActivity(incident),
    ]);
    
    // Store evidence securely
    await this.evidenceStore.store({
      incidentId: incident.id,
      evidence,
      collectedAt: new Date(),
      hash: this.calculateEvidenceHash(evidence),
    });
  }
}
```

## 5. Compliance and Audit Patterns

### 5.1 Audit Logging

```typescript
// Comprehensive Audit Logging
export class AuditLogger {
  async log(event: AuditEvent): Promise<void> {
    // Ensure immutability
    const auditEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      eventType: event.type,
      userId: event.userId,
      sessionId: event.sessionId,
      action: event.action,
      resource: event.resource,
      result: event.result,
      metadata: event.metadata,
      // Add integrity hash
      hash: this.calculateHash(event),
      previousHash: await this.getLastHash(),
    };
    
    // Store in multiple locations for redundancy
    await Promise.all([
      this.primaryStore.write(auditEntry),
      this.backupStore.write(auditEntry),
      this.streamToSIEM(auditEntry),
    ]);
    
    // Check for compliance violations
    await this.checkCompliance(auditEntry);
  }
  
  private async checkCompliance(entry: AuditEntry): Promise<void> {
    // LGPD compliance checks
    if (entry.action === 'data_access' && entry.metadata?.dataType === 'health') {
      await this.verifyConsent(entry.userId, entry.resource);
    }
    
    // Check for suspicious patterns
    const recentActivity = await this.getRecentActivity(entry.userId);
    if (this.detectSuspiciousPattern(recentActivity)) {
      await this.alertCompliance(entry, 'Suspicious access pattern detected');
    }
  }
}
```

### 5.2 Data Privacy Controls

```typescript
// LGPD Data Subject Rights Implementation
export class DataPrivacyService {
  async handleDataRequest(
    request: DataSubjectRequest
  ): Promise<DataRequestResponse> {
    // Verify identity
    await this.verifyIdentity(request.userId, request.verificationToken);
    
    switch (request.type) {
      case 'ACCESS':
        return this.handleAccessRequest(request);
      case 'RECTIFICATION':
        return this.handleRectificationRequest(request);
      case 'DELETION':
        return this.handleDeletionRequest(request);
      case 'PORTABILITY':
        return this.handlePortabilityRequest(request);
      case 'RESTRICTION':
        return this.handleRestrictionRequest(request);
      default:
        throw new InvalidRequestTypeError();
    }
  }
  
  private async handleDeletionRequest(
    request: DataSubjectRequest
  ): Promise<DataRequestResponse> {
    // Check if deletion is allowed
    const restrictions = await this.checkDeletionRestrictions(request.userId);
    if (restrictions.length > 0) {
      return {
        success: false,
        reason: 'Legal retention requirements',
        restrictions,
      };
    }
    
    // Start deletion process
    const deletionId = uuidv4();
    
    // Soft delete first
    await this.softDelete(request.userId);
    
    // Schedule hard delete after grace period
    await this.scheduleDeletion(request.userId, deletionId, 30); // 30 days
    
    // Notify user
    await this.notifyDeletionScheduled(request.userId, deletionId);
    
    return {
      success: true,
      deletionId,
      scheduledDate: addDays(new Date(), 30),
    };
  }
  
  private async handlePortabilityRequest(
    request: DataSubjectRequest
  ): Promise<DataRequestResponse> {
    // Collect all user data
    const userData = await this.collectUserData(request.userId);
    
    // Convert to portable format (FHIR for health data)
    const portableData = await this.convertToPortableFormat(userData);
    
    // Encrypt for transfer
    const encryptedPackage = await this.encryptForTransfer(
      portableData,
      request.encryptionKey
    );
    
    // Generate secure download link
    const downloadLink = await this.generateSecureLink(encryptedPackage);
    
    return {
      success: true,
      downloadLink,
      expiresAt: addHours(new Date(), 24),
      format: 'FHIR_R4',
    };
  }
}
```

This comprehensive security and error handling design ensures the healthcare super app maintains the highest standards of data protection, user privacy, and system reliability while complying with healthcare regulations.
# API Gateway and Service Mesh Design

> **Design Foundation**: Based on GraphQL federation patterns from Netflix and Expedia, incorporating Istio service mesh for healthcare-compliant secure communication, optimized for sub-200ms response times.

## 1. API Gateway Architecture

### 1.1 Gateway Overview

```yaml
API Gateway Configuration:
  Type: Apollo Federation Gateway
  Entry Points:
    - GraphQL: /graphql (primary)
    - REST: /api/v1/* (legacy/file operations)
    - WebSocket: /ws (real-time updates)
    
  Core Features:
    - Schema stitching across microservices
    - Request/response transformation
    - Authentication & authorization
    - Rate limiting & throttling
    - Request routing & load balancing
    - Circuit breaking
    - Caching layer
    - Request/response logging
```

### 1.2 GraphQL Federation Design

```typescript
// Gateway Schema Composition
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      gateway: {
        serviceList: [
          { name: 'auth', url: 'http://auth-service:3001/graphql' },
          { name: 'health', url: 'http://health-service:3002/graphql' },
          { name: 'care', url: 'http://care-service:3003/graphql' },
          { name: 'plan', url: 'http://plan-service:3004/graphql' },
          { name: 'gamification', url: 'http://gamification-engine:3005/graphql' },
        ],
        buildService({ url }) {
          return new AuthenticatedDataSource({ url });
        },
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'auth', url: 'http://auth-service:3001/graphql' },
            { name: 'health', url: 'http://health-service:3002/graphql' },
            { name: 'care', url: 'http://care-service:3003/graphql' },
            { name: 'plan', url: 'http://plan-service:3004/graphql' },
            { name: 'gamification', url: 'http://gamification-engine:3005/graphql' },
          ],
          pollIntervalInMs: 15_000, // Schema polling
        }),
      },
      context: ({ req, connection }) => {
        return {
          headers: req?.headers || connection?.context?.headers,
          user: req?.user || connection?.context?.user,
          correlationId: generateCorrelationId(),
          startTime: Date.now(),
        };
      },
      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
        ComplexityPlugin({ maxComplexity: 1000 }), // Prevent expensive queries
        DepthLimitPlugin({ maxDepth: 10 }),
        CostAnalysisPlugin({ maximumCost: 1000 }),
        ResponseCachePlugin(),
        MetricsPlugin(),
        ErrorHandlingPlugin(),
      ],
    }),
  ],
})
export class ApiGatewayModule {}
```

### 1.3 Request Processing Pipeline

```typescript
// Request Middleware Pipeline
export class RequestPipeline {
  private middlewares: Middleware[] = [
    new CorrelationIdMiddleware(),
    new RequestLoggingMiddleware(),
    new AuthenticationMiddleware(),
    new RateLimitMiddleware(),
    new RequestValidationMiddleware(),
    new AuthorizationMiddleware(),
    new RequestTransformMiddleware(),
    new CircuitBreakerMiddleware(),
  ];

  async process(request: Request): Promise<Response> {
    let processedRequest = request;
    
    // Pre-processing middlewares
    for (const middleware of this.middlewares) {
      processedRequest = await middleware.process(processedRequest);
      
      if (processedRequest.shouldTerminate) {
        return this.buildErrorResponse(processedRequest);
      }
    }
    
    // Route to appropriate service
    const response = await this.routeRequest(processedRequest);
    
    // Post-processing
    return this.postProcess(response);
  }
  
  private async routeRequest(request: ProcessedRequest): Promise<Response> {
    const router = new IntelligentRouter({
      loadBalancer: new WeightedRoundRobin(),
      healthChecker: new ActiveHealthChecker(),
      circuitBreaker: new CircuitBreaker({
        failureThreshold: 5,
        resetTimeout: 60000,
        halfOpenRequests: 3,
      }),
    });
    
    return router.route(request);
  }
}
```

### 1.4 Authentication & Authorization

```typescript
// JWT Authentication Middleware
export class AuthenticationMiddleware implements Middleware {
  async process(request: Request): Promise<Request> {
    const token = this.extractToken(request);
    
    if (!token && !this.isPublicEndpoint(request)) {
      throw new UnauthorizedException('Token required');
    }
    
    if (token) {
      try {
        // Verify JWT with public key
        const payload = await this.verifyToken(token);
        
        // Check token expiry and refresh if needed
        if (this.isNearExpiry(payload)) {
          const newToken = await this.refreshToken(token);
          request.headers['x-refreshed-token'] = newToken;
        }
        
        // Attach user context
        request.user = {
          id: payload.sub,
          roles: payload.roles,
          permissions: payload.permissions,
          journey: payload.journey,
        };
        
        // Cache user permissions
        await this.cachePermissions(request.user);
        
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        }
        throw new UnauthorizedException('Invalid token');
      }
    }
    
    return request;
  }
  
  private async verifyToken(token: string): Promise<JWTPayload> {
    // RS384 verification with rotating keys
    const keys = await this.getPublicKeys();
    
    for (const key of keys) {
      try {
        return jwt.verify(token, key, {
          algorithms: ['RS384'],
          issuer: 'austa-health',
          audience: 'austa-superapp',
        });
      } catch (e) {
        continue;
      }
    }
    
    throw new Error('No valid key found');
  }
}
```

### 1.5 Rate Limiting Strategy

```typescript
// Intelligent Rate Limiter
export class RateLimitMiddleware implements Middleware {
  private limiters = {
    anonymous: new RateLimiter({
      points: 100,
      duration: 60, // per minute
      blockDuration: 300, // 5 minutes
    }),
    authenticated: new RateLimiter({
      points: 1000,
      duration: 60,
      blockDuration: 60,
    }),
    premium: new RateLimiter({
      points: 5000,
      duration: 60,
      blockDuration: 30,
    }),
  };
  
  async process(request: Request): Promise<Request> {
    const key = this.getRateLimitKey(request);
    const limiter = this.selectLimiter(request);
    
    try {
      await limiter.consume(key, 1);
      
      // Add rate limit headers
      const rateLimitInfo = await limiter.get(key);
      request.headers['X-RateLimit-Limit'] = limiter.points;
      request.headers['X-RateLimit-Remaining'] = rateLimitInfo.remainingPoints;
      request.headers['X-RateLimit-Reset'] = rateLimitInfo.msBeforeNext;
      
    } catch (rateLimiterRes) {
      // Rate limit exceeded
      throw new TooManyRequestsException({
        retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000),
        limit: limiter.points,
      });
    }
    
    return request;
  }
  
  private getRateLimitKey(request: Request): string {
    if (request.user) {
      return `user:${request.user.id}`;
    }
    return `ip:${request.ip}`;
  }
}
```

## 2. Service Mesh Architecture (Istio)

### 2.1 Mesh Configuration

```yaml
# Istio Service Mesh Configuration
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  name: austa-health-mesh
spec:
  profile: production
  values:
    global:
      meshID: austa-health-mesh
      multiCluster:
        clusterName: primary
      network: primary-network
      
    pilot:
      autoscaleEnabled: true
      autoscaleMin: 2
      autoscaleMax: 5
      cpu:
        targetAverageUtilization: 80
      env:
        PILOT_ENABLE_WORKLOAD_ENTRY_AUTOREGISTRATION: true
        
    telemetry:
      v2:
        prometheus:
          configOverride:
            inboundSidecar:
              disable_host_header_fallback: true
            outboundSidecar:
              disable_host_header_fallback: true
            gateway:
              disable_host_header_fallback: true
              
  meshConfig:
    accessLogFile: /dev/stdout
    defaultConfig:
      proxyStatsMatcher:
        inclusionRegexps:
        - ".*outlier_detection.*"
        - ".*circuit_breakers.*"
        - ".*upstream_rq_retry.*"
        - ".*upstream_rq_pending.*"
        - ".*response_code_class.*"
      holdApplicationUntilProxyStarts: true
    extensionProviders:
    - name: otel
      envoyOtelAls:
        service: opentelemetry-collector.istio-system.svc.cluster.local
        port: 4317
```

### 2.2 Service-to-Service Communication

```yaml
# mTLS Configuration for Service Communication
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: austa-health
spec:
  mtls:
    mode: STRICT # Enforce mTLS for all service communication
---
# Authorization Policy
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: service-communication
  namespace: austa-health
spec:
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/austa-health/sa/api-gateway"]
    to:
    - operation:
        methods: ["POST", "GET"]
        paths: ["/graphql", "/api/*"]
  - from:
    - source:
        principals: ["cluster.local/ns/austa-health/sa/gamification-engine"]
    to:
    - operation:
        methods: ["POST"]
        paths: ["/internal/events"]
```

### 2.3 Traffic Management

```yaml
# Virtual Service for Canary Deployments
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: health-service
spec:
  hosts:
  - health-service
  http:
  - match:
    - headers:
        x-canary:
          exact: "true"
    route:
    - destination:
        host: health-service
        subset: canary
      weight: 100
  - route:
    - destination:
        host: health-service
        subset: stable
      weight: 90
    - destination:
        host: health-service
        subset: canary
      weight: 10
    timeout: 30s
    retries:
      attempts: 3
      perTryTimeout: 10s
      retryOn: gateway-error,connect-failure,refused-stream
---
# Destination Rule with Circuit Breaking
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: health-service
spec:
  host: health-service
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        http2MaxRequests: 100
        maxRequestsPerConnection: 2
    loadBalancer:
      consistentHash:
        httpHeaderName: "x-user-id" # Sticky sessions by user
    outlierDetection:
      consecutiveGatewayErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
      minHealthPercent: 30
  subsets:
  - name: stable
    labels:
      version: stable
  - name: canary
    labels:
      version: canary
```

### 2.4 Service Mesh Security

```typescript
// Service Identity and Authentication
export class ServiceMeshSecurity {
  // Automatic certificate rotation
  async rotateCertificates(): Promise<void> {
    const services = await this.getRegisteredServices();
    
    for (const service of services) {
      if (this.shouldRotate(service.certificate)) {
        const newCert = await this.issueCertificate(service);
        
        // Update certificate without downtime
        await this.updateCertificate(service, newCert);
        
        // Verify mTLS still works
        await this.verifyMTLS(service);
      }
    }
  }
  
  // Policy enforcement
  enforceSecurityPolicies(): SecurityPolicy[] {
    return [
      {
        name: 'require-jwt',
        spec: {
          selector: {
            matchLabels: { app: 'api-gateway' }
          },
          jwtRules: [{
            issuer: 'https://auth.austa.health',
            audiences: ['austa-superapp'],
            jwksUri: 'https://auth.austa.health/.well-known/jwks.json',
          }]
        }
      },
      {
        name: 'deny-external-access',
        spec: {
          selector: {
            matchLabels: { 'security-zone': 'internal' }
          },
          rules: [{
            from: [{
              source: { notNamespaces: ['austa-health'] }
            }],
            to: [{ operation: { methods: ['*'] } }],
            action: 'DENY'
          }]
        }
      }
    ];
  }
}
```

## 3. Observability Integration

### 3.1 Distributed Tracing

```yaml
# OpenTelemetry Integration
apiVersion: v1
kind: ConfigMap
metadata:
  name: otel-collector-config
data:
  otel-collector-config.yaml: |
    receivers:
      otlp:
        protocols:
          grpc:
            endpoint: 0.0.0.0:4317
          http:
            endpoint: 0.0.0.0:4318
    
    processors:
      batch:
        timeout: 1s
        send_batch_size: 1024
      
      attributes:
        actions:
          - key: journey
            from_attribute: http.route
            action: extract
            pattern: ^/api/(?P<journey>[^/]+)/.*
          
          - key: service.namespace
            value: austa-health
            action: insert
    
    exporters:
      jaeger:
        endpoint: jaeger-collector:14250
        tls:
          insecure: false
          cert_file: /certs/cert.pem
          key_file: /certs/key.pem
      
      prometheus:
        endpoint: "0.0.0.0:8889"
        namespace: austa_health
        
    service:
      pipelines:
        traces:
          receivers: [otlp]
          processors: [batch, attributes]
          exporters: [jaeger]
        
        metrics:
          receivers: [otlp]
          processors: [batch]
          exporters: [prometheus]
```

### 3.2 Service Mesh Metrics

```typescript
// Custom Metrics Collection
export class MeshMetrics {
  private metrics = {
    requestDuration: new Histogram({
      name: 'service_request_duration_seconds',
      help: 'Request duration in seconds',
      labelNames: ['service', 'method', 'status', 'journey'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    }),
    
    activeConnections: new Gauge({
      name: 'service_active_connections',
      help: 'Number of active connections',
      labelNames: ['service', 'type'],
    }),
    
    circuitBreakerState: new Gauge({
      name: 'circuit_breaker_state',
      help: 'Circuit breaker state (0=closed, 1=open, 2=half-open)',
      labelNames: ['service', 'endpoint'],
    }),
  };
  
  recordRequest(
    service: string,
    method: string,
    status: number,
    duration: number,
    journey?: string
  ): void {
    this.metrics.requestDuration
      .labels(service, method, status.toString(), journey || 'unknown')
      .observe(duration / 1000); // Convert to seconds
  }
  
  updateCircuitBreaker(service: string, endpoint: string, state: CircuitState): void {
    const stateValue = {
      [CircuitState.CLOSED]: 0,
      [CircuitState.OPEN]: 1,
      [CircuitState.HALF_OPEN]: 2,
    };
    
    this.metrics.circuitBreakerState
      .labels(service, endpoint)
      .set(stateValue[state]);
  }
}
```

## 4. Resilience Patterns

### 4.1 Circuit Breaker Implementation

```typescript
// Advanced Circuit Breaker with Health Checks
export class HealthAwareCircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private successCount: number = 0;
  
  constructor(
    private config: CircuitBreakerConfig,
    private healthChecker: HealthChecker
  ) {}
  
  async call<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        throw new CircuitOpenError('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await this.executeWithTimeout(operation);
      this.onSuccess();
      return result;
      
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }
  
  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return Promise.race([
      operation(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new TimeoutError()), this.config.timeout)
      ),
    ]);
  }
  
  private onSuccess(): void {
    this.failures = 0;
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      
      if (this.successCount >= this.config.halfOpenSuccesses) {
        this.state = CircuitState.CLOSED;
        this.successCount = 0;
        this.emit('stateChange', CircuitState.CLOSED);
      }
    }
  }
  
  private onFailure(error: Error): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.emit('stateChange', CircuitState.OPEN);
      
      // Schedule health checks
      this.scheduleHealthChecks();
    }
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN;
      this.successCount = 0;
    }
  }
  
  private async scheduleHealthChecks(): Promise<void> {
    const checkInterval = setInterval(async () => {
      const isHealthy = await this.healthChecker.check();
      
      if (isHealthy) {
        this.state = CircuitState.HALF_OPEN;
        clearInterval(checkInterval);
      }
    }, this.config.healthCheckInterval);
  }
}
```

### 4.2 Retry Strategy

```typescript
// Intelligent Retry with Backoff
export class AdaptiveRetryStrategy {
  async execute<T>(
    operation: () => Promise<T>,
    context: RetryContext
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= context.maxAttempts; attempt++) {
      try {
        // Add jitter to prevent thundering herd
        if (attempt > 0) {
          const delay = this.calculateDelay(attempt, context);
          await this.sleep(delay);
        }
        
        // Execute with circuit breaker
        return await context.circuitBreaker.call(operation);
        
      } catch (error) {
        lastError = error;
        
        // Check if retryable
        if (!this.isRetryable(error, context)) {
          throw error;
        }
        
        // Log retry attempt
        this.logger.warn('Retry attempt', {
          attempt,
          error: error.message,
          context: context.operation,
        });
        
        // Update metrics
        this.metrics.retryAttempt(context.service, attempt);
      }
    }
    
    throw new RetryExhaustedError(lastError!, context);
  }
  
  private calculateDelay(attempt: number, context: RetryContext): number {
    const exponentialDelay = Math.min(
      context.baseDelay * Math.pow(2, attempt - 1),
      context.maxDelay
    );
    
    // Add jitter (±25%)
    const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);
    
    return Math.round(exponentialDelay + jitter);
  }
  
  private isRetryable(error: Error, context: RetryContext): boolean {
    // Don't retry client errors (4xx)
    if (error instanceof HttpException && error.status >= 400 && error.status < 500) {
      return false;
    }
    
    // Check retryable conditions
    return context.retryOn.some(condition => {
      switch (condition) {
        case 'gateway-error':
          return error instanceof GatewayError;
        case 'timeout':
          return error instanceof TimeoutError;
        case 'connect-failure':
          return error instanceof ConnectionError;
        case 'service-unavailable':
          return error instanceof ServiceUnavailableError;
        default:
          return false;
      }
    });
  }
}
```

## 5. Performance Optimization

### 5.1 Response Caching

```typescript
// Multi-Level Cache Strategy
export class GatewayCacheManager {
  private caches = {
    memory: new MemoryCache({ maxSize: 1000, ttl: 60 }), // 1 minute
    redis: new RedisCache({ ttl: 300 }), // 5 minutes
  };
  
  async get(key: string): Promise<any | null> {
    // L1: Memory cache
    const memoryResult = await this.caches.memory.get(key);
    if (memoryResult) {
      this.metrics.cacheHit('memory');
      return memoryResult;
    }
    
    // L2: Redis cache
    const redisResult = await this.caches.redis.get(key);
    if (redisResult) {
      this.metrics.cacheHit('redis');
      // Promote to memory cache
      await this.caches.memory.set(key, redisResult);
      return redisResult;
    }
    
    this.metrics.cacheMiss();
    return null;
  }
  
  async set(key: string, value: any, options: CacheOptions): Promise<void> {
    // Determine cache levels based on options
    const levels = this.determineCacheLevels(options);
    
    await Promise.all(
      levels.map(level => this.caches[level].set(key, value, options))
    );
  }
  
  generateKey(query: GraphQLQuery): string {
    const normalized = this.normalizeQuery(query);
    const variables = this.hashVariables(query.variables);
    const user = query.context.user?.id || 'anonymous';
    
    return `gql:${user}:${normalized}:${variables}`;
  }
}
```

### 5.2 Query Complexity Analysis

```typescript
// GraphQL Query Complexity Calculator
export class ComplexityAnalyzer {
  analyze(
    query: DocumentNode,
    schema: GraphQLSchema,
    variables: any
  ): number {
    let complexity = 0;
    
    visit(query, {
      Field(node, key, parent, path, ancestors) {
        const fieldDef = this.getFieldDef(schema, ancestors, node);
        
        if (!fieldDef) return;
        
        // Base complexity
        complexity += fieldDef.complexity || 1;
        
        // Multiplier for list fields
        if (isListType(fieldDef.type)) {
          const limit = this.getLimit(node, variables);
          complexity *= Math.min(limit, 100); // Cap multiplier
        }
        
        // Additional complexity for nested selections
        if (node.selectionSet) {
          complexity += node.selectionSet.selections.length * 0.5;
        }
      },
    });
    
    return complexity;
  }
  
  enforceComplexityLimit(complexity: number, limit: number): void {
    if (complexity > limit) {
      throw new ComplexityLimitExceededError({
        complexity,
        limit,
        message: `Query complexity ${complexity} exceeds limit ${limit}`,
      });
    }
  }
}
```

## 6. Error Handling and Recovery

### 6.1 Graceful Degradation

```typescript
// Service Fallback Manager
export class FallbackManager {
  async executeWithFallback<T>(
    primary: () => Promise<T>,
    fallbacks: FallbackOption<T>[]
  ): Promise<T> {
    try {
      return await primary();
    } catch (primaryError) {
      this.logger.warn('Primary operation failed, attempting fallbacks', {
        error: primaryError.message,
      });
      
      for (const fallback of fallbacks) {
        try {
          if (fallback.condition(primaryError)) {
            const result = await fallback.handler();
            
            this.metrics.fallbackUsed(fallback.name);
            
            return result;
          }
        } catch (fallbackError) {
          this.logger.warn('Fallback failed', {
            fallback: fallback.name,
            error: fallbackError.message,
          });
        }
      }
      
      // All fallbacks failed
      throw new ServiceDegradedError(primaryError);
    }
  }
}

// Usage Example
const healthMetrics = await fallbackManager.executeWithFallback(
  // Primary: Real-time metrics
  () => healthService.getCurrentMetrics(userId),
  [
    {
      name: 'cached-metrics',
      condition: (error) => error instanceof TimeoutError,
      handler: () => cacheService.getLatestMetrics(userId),
    },
    {
      name: 'default-metrics',
      condition: () => true,
      handler: () => ({
        status: 'unavailable',
        message: 'Health metrics temporarily unavailable',
        cachedAt: new Date(),
      }),
    },
  ]
);
```

### 6.2 Error Response Formatting

```typescript
// Consistent Error Response Handler
export class ErrorResponseHandler {
  format(error: Error, context: RequestContext): ErrorResponse {
    const errorCode = this.getErrorCode(error);
    const userMessage = this.getUserMessage(error, context.locale);
    
    const response: ErrorResponse = {
      error: {
        code: errorCode,
        message: userMessage,
        timestamp: new Date().toISOString(),
        correlationId: context.correlationId,
      },
    };
    
    // Add debug info in non-production
    if (this.config.environment !== 'production') {
      response.error.debug = {
        stack: error.stack,
        service: error.service,
        details: error.details,
      };
    }
    
    // Add retry information if applicable
    if (this.isRetryable(error)) {
      response.error.retry = {
        retryable: true,
        retryAfter: this.getRetryAfter(error),
        alternativeEndpoint: this.getAlternativeEndpoint(error),
      };
    }
    
    // Log error for monitoring
    this.logger.error('Request failed', {
      error: errorCode,
      correlationId: context.correlationId,
      userId: context.user?.id,
      journey: context.journey,
      duration: Date.now() - context.startTime,
    });
    
    return response;
  }
}
```

This comprehensive API Gateway and Service Mesh design ensures secure, scalable, and resilient communication between all microservices while maintaining sub-200ms response times for critical healthcare operations.
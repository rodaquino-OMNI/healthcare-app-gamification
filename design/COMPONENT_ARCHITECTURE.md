# Healthcare SuperApp Component Architecture

## 1. Backend Component Architecture

### 1.1 Service Component Structure

```typescript
// Base Service Architecture Pattern
interface BaseService<T> {
  repository: Repository<T>;
  cache: CacheService;
  eventBus: EventBus;
  logger: Logger;
  
  // Core CRUD operations
  create(data: CreateDTO): Promise<T>;
  findById(id: string): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  delete(id: string): Promise<void>;
  
  // Business logic hooks
  beforeCreate?(data: CreateDTO): Promise<void>;
  afterCreate?(entity: T): Promise<void>;
  beforeUpdate?(id: string, data: UpdateDTO): Promise<void>;
  afterUpdate?(entity: T): Promise<void>;
}

// Health Service Component
class HealthMetricsComponent implements BaseService<HealthMetric> {
  private anomalyDetector: AnomalyDetector;
  private goalTracker: GoalTracker;
  private deviceIntegrator: DeviceIntegrator;
  
  constructor(
    repository: Repository<HealthMetric>,
    cache: RedisCache,
    eventBus: KafkaEventBus,
    logger: WinstonLogger
  ) {
    this.anomalyDetector = new AnomalyDetector();
    this.goalTracker = new GoalTracker(repository);
    this.deviceIntegrator = new DeviceIntegrator();
  }
  
  async recordMetric(userId: string, data: CreateMetricDTO): Promise<HealthMetric> {
    // Validate
    await this.validateMetric(data);
    
    // Detect anomalies
    const anomaly = await this.anomalyDetector.detect(data, userId);
    
    // Create metric
    const metric = await this.create({
      ...data,
      userId,
      anomaly
    });
    
    // Update goals
    await this.goalTracker.updateProgress(userId, metric);
    
    // Emit events
    await this.emitMetricEvents(metric, anomaly);
    
    return metric;
  }
}
```

### 1.2 Repository Pattern Architecture

```typescript
// Generic Repository Interface
interface Repository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(criteria: FindCriteria<T>): Promise<T | null>;
  findMany(criteria: FindCriteria<T>): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
  count(criteria?: FindCriteria<T>): Promise<number>;
}

// Prisma Repository Implementation
class PrismaRepository<T> implements Repository<T> {
  constructor(
    private model: any,
    private mapper: EntityMapper<T>
  ) {}
  
  async create(data: Partial<T>): Promise<T> {
    const created = await this.model.create({
      data: this.mapper.toPersistence(data)
    });
    return this.mapper.toDomain(created);
  }
  
  async findMany(criteria: FindCriteria<T>): Promise<T[]> {
    const results = await this.model.findMany({
      where: criteria.where,
      orderBy: criteria.orderBy,
      take: criteria.limit,
      skip: criteria.offset,
      include: criteria.include
    });
    return results.map(r => this.mapper.toDomain(r));
  }
}
```

### 1.3 Event-Driven Architecture Components

```typescript
// Event Bus Interface
interface EventBus {
  emit<T>(topic: string, event: Event<T>): Promise<void>;
  subscribe<T>(topic: string, handler: EventHandler<T>): void;
  unsubscribe(topic: string, handler: EventHandler<T>): void;
}

// Kafka Event Bus Implementation
class KafkaEventBus implements EventBus {
  private producer: KafkaProducer;
  private consumer: KafkaConsumer;
  private handlers: Map<string, Set<EventHandler>>;
  
  async emit<T>(topic: string, event: Event<T>): Promise<void> {
    const message = {
      key: event.aggregateId,
      value: JSON.stringify({
        eventId: uuidv4(),
        eventType: event.type,
        aggregateId: event.aggregateId,
        timestamp: new Date().toISOString(),
        data: event.data,
        metadata: {
          userId: event.userId,
          journey: event.journey,
          correlationId: event.correlationId
        }
      })
    };
    
    await this.producer.send({
      topic,
      messages: [message]
    });
  }
}

// Event Handler Pattern
abstract class EventHandler<T> {
  abstract readonly eventType: string;
  
  async handle(event: Event<T>): Promise<void> {
    try {
      await this.process(event);
      await this.acknowledge(event);
    } catch (error) {
      await this.handleError(error, event);
    }
  }
  
  abstract process(event: Event<T>): Promise<void>;
  abstract handleError(error: Error, event: Event<T>): Promise<void>;
}
```

### 1.4 API Gateway Architecture

```typescript
// GraphQL Resolver Architecture
class HealthResolvers {
  constructor(
    private healthService: HealthService,
    private authService: AuthService,
    private rateLimiter: RateLimiter
  ) {}
  
  @UseGuards(JwtAuthGuard)
  @RateLimit({ points: 100, duration: 60 })
  async healthMetrics(
    @CurrentUser() user: User,
    @Args() args: HealthMetricsArgs
  ): Promise<HealthMetricsResponse> {
    // Validate permissions
    await this.authService.validateAccess(user, 'health.metrics.read');
    
    // Apply rate limiting
    await this.rateLimiter.consume(user.id);
    
    // Fetch data
    const metrics = await this.healthService.getMetrics({
      userId: user.id,
      ...args
    });
    
    // Transform response
    return {
      data: metrics.map(m => this.transformMetric(m)),
      pagination: args.pagination
    };
  }
}
```

## 2. Frontend Component Architecture

### 2.1 Journey-Based Component Structure

```typescript
// Journey Container Pattern
interface JourneyContainer {
  theme: JourneyTheme;
  navigation: NavigationConfig;
  features: Feature[];
  guards: RouteGuard[];
}

// Health Journey Container
const HealthJourneyContainer: React.FC = () => {
  const { user } = useAuth();
  const { metrics, loading } = useHealthMetrics(user.id);
  const { achievements } = useGamification();
  
  return (
    <JourneyLayout theme={healthTheme}>
      <JourneyHeader 
        title="My Health"
        color="#0ACF83"
        achievements={achievements}
      />
      
      <Switch>
        <ProtectedRoute 
          path="/health/dashboard" 
          component={HealthDashboard}
        />
        <ProtectedRoute 
          path="/health/metrics" 
          component={MetricsView}
        />
        <ProtectedRoute 
          path="/health/goals" 
          component={GoalsManager}
        />
      </Switch>
    </JourneyLayout>
  );
};
```

### 2.2 Shared Component Library

```typescript
// Design System Component Architecture
const ComponentLibrary = {
  // Primitives
  primitives: {
    Box, Flex, Grid, Text, Heading, Button, Input, Select
  },
  
  // Journey Components
  journeys: {
    JourneyCard: ({ journey, stats, theme }) => (
      <Card bg={theme.colors.background} border={theme.colors.primary}>
        <CardHeader>
          <Heading color={theme.colors.primary}>{journey.name}</Heading>
        </CardHeader>
        <CardBody>
          <ProgressBar value={stats.completion} />
          <XPIndicator xp={stats.xp} />
        </CardBody>
      </Card>
    ),
    
    JourneyNavigation: ({ items, activeJourney }) => (
      <Navigation>
        {items.map(item => (
          <NavItem
            key={item.id}
            active={item.id === activeJourney}
            color={item.theme.colors.primary}
          >
            {item.label}
          </NavItem>
        ))}
      </Navigation>
    )
  },
  
  // Gamification Components
  gamification: {
    AchievementBadge: ({ achievement, size = 'md' }) => (
      <Badge
        size={size}
        tier={achievement.tier}
        unlocked={achievement.unlocked}
      >
        <BadgeIcon src={achievement.icon} />
        <BadgeLabel>{achievement.name}</BadgeLabel>
      </Badge>
    ),
    
    XPProgressBar: ({ current, next, level }) => (
      <ProgressContainer>
        <LevelIndicator>Level {level}</LevelIndicator>
        <Progress
          value={(current / next) * 100}
          color="gradient"
        />
        <XPLabel>{current} / {next} XP</XPLabel>
      </ProgressContainer>
    ),
    
    QuestCard: ({ quest, progress }) => (
      <Card variant="quest">
        <QuestHeader>
          <QuestTitle>{quest.name}</QuestTitle>
          <QuestReward>{quest.xpReward} XP</QuestReward>
        </QuestHeader>
        <QuestObjectives>
          {quest.objectives.map(obj => (
            <Objective
              key={obj.id}
              completed={progress[obj.id] >= obj.target}
            >
              {obj.description} ({progress[obj.id]}/{obj.target})
            </Objective>
          ))}
        </QuestObjectives>
      </Card>
    )
  }
};
```

### 2.3 State Management Architecture

```typescript
// Context-based State Management
interface AppState {
  auth: AuthState;
  health: HealthState;
  care: CareState;
  plan: PlanState;
  gamification: GamificationState;
  notifications: NotificationState;
}

// Journey-specific Context
const HealthContext = createContext<HealthContextValue>({
  metrics: [],
  goals: [],
  devices: [],
  loading: false,
  error: null,
  actions: {
    recordMetric: async () => {},
    updateGoal: async () => {},
    connectDevice: async () => {}
  }
});

// Custom Hooks Architecture
const useHealthMetrics = (userId: string) => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { data, loading: queryLoading, error: queryError } = useQuery(
    HEALTH_METRICS_QUERY,
    {
      variables: { userId },
      pollInterval: 30000, // Poll every 30 seconds
      fetchPolicy: 'cache-and-network'
    }
  );
  
  // Real-time updates
  useSubscription(HEALTH_METRICS_SUBSCRIPTION, {
    variables: { userId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data) {
        updateMetricsCache(subscriptionData.data.metricUpdated);
      }
    }
  });
  
  return { metrics, loading, error, refetch };
};
```

### 2.4 Mobile-Specific Architecture

```typescript
// React Native Component Architecture
const MobileHealthDashboard: React.FC = () => {
  const { metrics } = useHealthMetrics();
  const { hasPermission } = useHealthKit();
  
  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <SafeAreaView>
        <MetricCards metrics={metrics} />
        
        {!hasPermission && (
          <PermissionRequest
            type="healthkit"
            onAllow={requestHealthKitPermission}
          />
        )}
        
        <DeviceIntegrations />
        <HealthGoals />
        <RecentAchievements />
      </SafeAreaView>
    </ScrollView>
  );
};

// Native Module Bridge
interface HealthKitBridge {
  requestAuthorization(types: string[]): Promise<boolean>;
  getMetrics(type: string, options: QueryOptions): Promise<Metric[]>;
  observeMetrics(type: string, callback: (data: Metric) => void): Subscription;
}

// Platform-specific Implementation
const HealthKitModule = Platform.select({
  ios: NativeModules.HealthKit,
  android: NativeModules.GoogleFit,
  default: MockHealthModule
});
```

## 3. Data Architecture

### 3.1 Database Schema Design

```sql
-- Health Service Schema
CREATE SCHEMA health_schema;

CREATE TABLE health_schema.health_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth_schema.users(id),
    type VARCHAR(50) NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    source VARCHAR(50) NOT NULL,
    device_id UUID REFERENCES health_schema.devices(id),
    anomaly JSONB,
    notes TEXT,
    timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimized indexes for queries
CREATE INDEX idx_health_metrics_user_type_timestamp 
ON health_schema.health_metrics(user_id, type, timestamp DESC);

CREATE INDEX idx_health_metrics_anomaly 
ON health_schema.health_metrics(user_id, (anomaly IS NOT NULL));

-- Partitioning for scalability
CREATE TABLE health_schema.health_metrics_2024_01 
PARTITION OF health_schema.health_metrics 
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 3.2 Caching Architecture

```typescript
// Multi-level Caching Strategy
class CacheManager {
  private l1Cache: MemoryCache;  // In-memory cache
  private l2Cache: RedisCache;   // Redis cache
  private ttlConfig: TTLConfig;
  
  async get<T>(key: string): Promise<T | null> {
    // Check L1 cache first
    const l1Result = this.l1Cache.get<T>(key);
    if (l1Result) return l1Result;
    
    // Check L2 cache
    const l2Result = await this.l2Cache.get<T>(key);
    if (l2Result) {
      // Populate L1 cache
      this.l1Cache.set(key, l2Result, this.ttlConfig.l1);
      return l2Result;
    }
    
    return null;
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const effectiveTTL = ttl || this.ttlConfig.default;
    
    // Set in both caches
    await Promise.all([
      this.l1Cache.set(key, value, Math.min(effectiveTTL, this.ttlConfig.l1)),
      this.l2Cache.set(key, value, effectiveTTL)
    ]);
  }
  
  async invalidate(pattern: string): Promise<void> {
    // Invalidate L1 cache
    this.l1Cache.invalidatePattern(pattern);
    
    // Invalidate L2 cache
    await this.l2Cache.invalidatePattern(pattern);
    
    // Broadcast invalidation to other instances
    await this.broadcastInvalidation(pattern);
  }
}
```

### 3.3 Message Queue Architecture

```typescript
// Kafka Topic Architecture
const TopicConfiguration = {
  'health.events': {
    partitions: 10,
    replicationFactor: 3,
    config: {
      'retention.ms': 7 * 24 * 60 * 60 * 1000, // 7 days
      'compression.type': 'snappy',
      'max.message.bytes': 1048576 // 1MB
    }
  },
  'gamification.events': {
    partitions: 20,
    replicationFactor: 3,
    config: {
      'retention.ms': 3 * 24 * 60 * 60 * 1000, // 3 days
      'compression.type': 'lz4'
    }
  }
};

// Consumer Group Configuration
const ConsumerGroups = {
  'gamification-processor': {
    topics: ['health.events', 'care.events', 'plan.events'],
    config: {
      groupId: 'gamification-processor',
      autoCommit: false,
      maxBatchSize: 100,
      maxWaitTime: 5000
    }
  },
  'notification-processor': {
    topics: ['*.events'],
    config: {
      groupId: 'notification-processor',
      autoCommit: true,
      partitionAssignmentStrategy: 'RoundRobin'
    }
  }
};
```

## 4. Security Architecture

### 4.1 Authentication & Authorization

```typescript
// JWT-based Authentication Architecture
class AuthenticationService {
  private jwtService: JwtService;
  private refreshTokenStore: RefreshTokenStore;
  private mfaService: MFAService;
  
  async authenticate(credentials: LoginCredentials): Promise<AuthTokens> {
    // Validate credentials
    const user = await this.validateCredentials(credentials);
    
    // Check MFA requirement
    if (user.mfaEnabled) {
      const mfaToken = await this.mfaService.generateChallenge(user);
      return { requiresMFA: true, mfaToken };
    }
    
    // Generate tokens
    return this.generateTokens(user);
  }
  
  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions,
      journey: user.currentJourney
    };
    
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      audience: 'api.austa.health',
      issuer: 'auth.austa.health'
    });
    
    const refreshToken = await this.refreshTokenStore.create({
      userId: user.id,
      expiresAt: addDays(new Date(), 30)
    });
    
    return { accessToken, refreshToken: refreshToken.token };
  }
}

// Role-Based Access Control
class RBACService {
  private policyEngine: PolicyEngine;
  
  async authorize(
    user: User,
    resource: string,
    action: string
  ): Promise<boolean> {
    // Check role-based permissions
    const rolePermissions = await this.getRolePermissions(user.roles);
    if (this.hasPermission(rolePermissions, resource, action)) {
      return true;
    }
    
    // Check journey-based permissions
    const journeyPermissions = await this.getJourneyPermissions(
      user.currentJourney
    );
    if (this.hasPermission(journeyPermissions, resource, action)) {
      return true;
    }
    
    // Check attribute-based policies
    return this.policyEngine.evaluate({
      subject: user,
      resource,
      action,
      context: {
        time: new Date(),
        ip: user.lastIpAddress,
        device: user.currentDevice
      }
    });
  }
}
```

### 4.2 Data Encryption Architecture

```typescript
// Encryption Service Architecture
class EncryptionService {
  private kmsClient: KMSClient;
  private dataKeyCache: DataKeyCache;
  
  async encryptPII(data: any): Promise<EncryptedData> {
    // Get or generate data encryption key
    const dataKey = await this.getDataKey();
    
    // Encrypt sensitive fields
    const encrypted = await this.encryptFields(data, dataKey, [
      'ssn',
      'dateOfBirth',
      'medicalRecordNumber',
      'insurancePolicyNumber'
    ]);
    
    return {
      data: encrypted,
      keyId: dataKey.keyId,
      algorithm: 'AES-256-GCM'
    };
  }
  
  private async getDataKey(): Promise<DataKey> {
    // Check cache first
    const cached = this.dataKeyCache.get();
    if (cached && !cached.isExpired()) {
      return cached;
    }
    
    // Generate new data key
    const { Plaintext, CiphertextBlob, KeyId } = await this.kmsClient.generateDataKey({
      KeyId: process.env.KMS_KEY_ID,
      KeySpec: 'AES_256'
    });
    
    const dataKey = {
      plaintext: Plaintext,
      ciphertext: CiphertextBlob,
      keyId: KeyId,
      expiresAt: addHours(new Date(), 24)
    };
    
    this.dataKeyCache.set(dataKey);
    return dataKey;
  }
}
```

## 5. Integration Architecture

### 5.1 External System Adapters

```typescript
// Adapter Pattern for External Integrations
interface HealthDeviceAdapter {
  connect(credentials: DeviceCredentials): Promise<void>;
  disconnect(): Promise<void>;
  getMetrics(types: MetricType[], options: QueryOptions): Promise<Metric[]>;
  subscribeToUpdates(callback: (metric: Metric) => void): Subscription;
}

// Apple HealthKit Adapter
class HealthKitAdapter implements HealthDeviceAdapter {
  private healthStore: any;
  private subscriptions: Map<string, Subscription>;
  
  async connect(credentials: DeviceCredentials): Promise<void> {
    const authTypes = this.mapMetricTypes(credentials.requestedTypes);
    const authorized = await HealthKit.requestAuthorization(authTypes);
    
    if (!authorized) {
      throw new UnauthorizedError('HealthKit authorization denied');
    }
    
    this.healthStore = await HealthKit.initializeHealthStore();
  }
  
  async getMetrics(
    types: MetricType[],
    options: QueryOptions
  ): Promise<Metric[]> {
    const queries = types.map(type => ({
      type: this.mapToHealthKitType(type),
      startDate: options.startDate,
      endDate: options.endDate,
      limit: options.limit
    }));
    
    const results = await Promise.all(
      queries.map(q => this.healthStore.query(q))
    );
    
    return results.flat().map(r => this.mapToMetric(r));
  }
}
```

### 5.2 API Client Architecture

```typescript
// Resilient API Client
class ResilientAPIClient {
  private httpClient: AxiosInstance;
  private circuitBreaker: CircuitBreaker;
  private retryPolicy: RetryPolicy;
  private cache: ResponseCache;
  
  constructor(config: APIClientConfig) {
    this.httpClient = axios.create(config);
    this.circuitBreaker = new CircuitBreaker(config.circuitBreaker);
    this.retryPolicy = new ExponentialBackoffRetry(config.retry);
    this.cache = new ResponseCache(config.cache);
    
    this.setupInterceptors();
  }
  
  async request<T>(config: RequestConfig): Promise<T> {
    // Check cache for GET requests
    if (config.method === 'GET' && config.cache) {
      const cached = await this.cache.get(config.url);
      if (cached) return cached;
    }
    
    // Execute request with circuit breaker
    return this.circuitBreaker.execute(async () => {
      try {
        const response = await this.retryPolicy.execute(() =>
          this.httpClient.request(config)
        );
        
        // Cache successful GET responses
        if (config.method === 'GET' && config.cache) {
          await this.cache.set(config.url, response.data, config.cacheTTL);
        }
        
        return response.data;
      } catch (error) {
        // Handle specific error types
        if (error.response?.status === 429) {
          throw new RateLimitError(error.response.headers['retry-after']);
        }
        throw error;
      }
    });
  }
}
```

This comprehensive architecture design provides a solid foundation for implementing the healthcare super app with scalability, security, and maintainability in mind.
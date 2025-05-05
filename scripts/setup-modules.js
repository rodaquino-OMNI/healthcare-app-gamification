/**
 * Module Setup Script
 * 
 * This script sets up all required modules across the monorepo,
 * including creating missing files and configuring dependencies.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = process.cwd();

// Ensure directories exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Create minimal file if doesn't exist
function createMinimalFileIfNeeded(filePath, content) {
  if (!fs.existsSync(filePath)) {
    console.log(`Creating file: ${filePath}`);
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

// Setup shared services
function setupSharedServices() {
  console.log('Setting up shared services...');
  
  // Create required directories
  const directories = [
    'src/backend/shared/src/database',
    'src/backend/shared/src/redis',
    'src/backend/shared/src/logging',
    'src/backend/shared/src/kafka',
    'src/backend/shared/src/exceptions',
    'src/backend/shared/src/tracing'
  ];
  
  directories.forEach(dir => ensureDirectoryExists(path.join(rootDir, dir)));
  
  // Create minimal service implementations
  createMinimalFileIfNeeded(
    path.join(rootDir, 'src/backend/shared/src/database/prisma.service.ts'),
    `import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}`
  );
  
  createMinimalFileIfNeeded(
    path.join(rootDir, 'src/backend/shared/src/redis/redis.service.ts'),
    `import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  private cache: Map<string, { value: string; expiry?: number }> = new Map();

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const expiry = ttl ? Date.now() + (ttl * 1000) : undefined;
    this.cache.set(key, { value, expiry });
  }

  getJourneyTTL(journey: string): number {
    // Default journey TTLs
    const journeyTTLs = {
      health: 600,  // 10 minutes
      care: 300,    // 5 minutes
      plan: 1800    // 30 minutes
    };
    return journeyTTLs[journey] || 300;
  }
}`
  );
  
  createMinimalFileIfNeeded(
    path.join(rootDir, 'src/backend/shared/src/logging/logger.service.ts'),
    `import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class JourneyLogger extends ConsoleLogger {
  constructor(context?: string, private readonly journeyId?: string) {
    super(context);
  }

  log(message: string, context?: string) {
    super.log(this.addJourneyInfo(message), context);
  }

  error(message: string, trace?: string, context?: string) {
    super.error(this.addJourneyInfo(message), trace, context);
  }

  warn(message: string, context?: string) {
    super.warn(this.addJourneyInfo(message), context);
  }

  debug(message: string, context?: string) {
    super.debug(this.addJourneyInfo(message), context);
  }

  verbose(message: string, context?: string) {
    super.verbose(this.addJourneyInfo(message), context);
  }

  private addJourneyInfo(message: string): string {
    return this.journeyId ? \`[\${this.journeyId}] \${message}\` : message;
  }
}`
  );
  
  createMinimalFileIfNeeded(
    path.join(rootDir, 'src/backend/shared/src/kafka/kafka.service.ts'),
    `import { Injectable } from '@nestjs/common';

@Injectable()
export class KafkaService {
  async emit(topic: string, message: any): Promise<void> {
    console.log(\`[Kafka] Emitting to \${topic}:\`, message);
    // Implement actual Kafka producer when ready
  }

  async subscribe(topic: string, groupId: string, handler: (message: any) => Promise<void>): Promise<void> {
    console.log(\`[Kafka] Subscribed to \${topic} with group \${groupId}\`);
    // Implement actual Kafka consumer when ready
  }
}`
  );

  createMinimalFileIfNeeded(
    path.join(rootDir, 'src/backend/shared/src/exceptions/business-error.ts'),
    `export class BusinessError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly data?: any,
  ) {
    super(message);
    this.name = 'BusinessError';
  }
}
`
  );

  createMinimalFileIfNeeded(
    path.join(rootDir, 'src/backend/shared/src/exceptions/validation-error.ts'),
    `export class ValidationError extends Error {
  constructor(
    public readonly fields: Record<string, string[]>,
    message: string = 'Validation failed',
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
`
  );
  
  // Create index files for exports
  const indexFiles = [
    { path: 'src/backend/shared/src/database/index.ts', content: `export * from './prisma.service';\n` },
    { path: 'src/backend/shared/src/redis/index.ts', content: `export * from './redis.service';\n` },
    { path: 'src/backend/shared/src/logging/index.ts', content: `export * from './logger.service';\n` },
    { path: 'src/backend/shared/src/kafka/index.ts', content: `export * from './kafka.service';\n` },
    { path: 'src/backend/shared/src/exceptions/index.ts', content: `export * from './business-error';\nexport * from './validation-error';\n` },
    { 
      path: 'src/backend/shared/src/index.ts', 
      content: `export * from './database';\nexport * from './redis';\nexport * from './logging';\nexport * from './kafka';\nexport * from './exceptions';\n` 
    }
  ];
  
  indexFiles.forEach(file => {
    createMinimalFileIfNeeded(path.join(rootDir, file.path), file.content);
  });
}

// Setup gamification engine services
function setupGamificationServices() {
  console.log('Setting up gamification engine services...');
  
  // Create required directories
  const directories = [
    'src/backend/gamification-engine/src/profiles',
    'src/backend/gamification-engine/src/achievements',
    'src/backend/gamification-engine/src/events',
    'src/backend/gamification-engine/src/rewards'
  ];
  
  directories.forEach(dir => ensureDirectoryExists(path.join(rootDir, dir)));
  
  // Create minimal implementations
  createMinimalFileIfNeeded(
    path.join(rootDir, 'src/backend/gamification-engine/src/profiles/entities/game-profile.entity.ts'),
    `import { UserAchievement } from '../../achievements/entities/user-achievement.entity';

export class GameProfile {
  id!: string;
  userId!: string;
  level!: number;
  xp!: number;
  achievements?: UserAchievement[];
  createdAt!: Date;
  updatedAt!: Date;
  
  // Journey-specific stats
  healthScore?: number;
  careScore?: number;
  planScore?: number;
  
  // Methods for profile progression
  addXP(amount: number): void {
    this.xp += amount;
    this.checkLevelUp();
  }
  
  private checkLevelUp(): void {
    // XP required for next level = current level * 100
    const requiredXP = this.level * 100;
    
    if (this.xp >= requiredXP) {
      this.level += 1;
      // Additional level-up logic can be added here
    }
  }
}`
  );
}

// Setup configuration for specific packages
function setupPackageConfigurations() {
  console.log('Setting up package configurations...');
  
  // Setup mobile-specific configurations
  const mobilePackageJsonPath = path.join(rootDir, 'src/web/mobile/package.json');
  if (fs.existsSync(mobilePackageJsonPath)) {
    const mobilePackageJson = JSON.parse(fs.readFileSync(mobilePackageJsonPath, 'utf8'));
    
    // Add overrides for problematic packages
    mobilePackageJson.overrides = {
      ...(mobilePackageJson.overrides || {}),
      "react-native-webview": "13.13.5",
      "react-native-agora": "4.5.2",
      "@react-native/typescript-config": "0.73.1"
    };
    
    fs.writeFileSync(mobilePackageJsonPath, JSON.stringify(mobilePackageJson, null, 2));
  }
  
  // Setup web-specific configurations
  const webPackageJsonPath = path.join(rootDir, 'src/web/web/package.json');
  if (fs.existsSync(webPackageJsonPath)) {
    const webPackageJson = JSON.parse(fs.readFileSync(webPackageJsonPath, 'utf8'));
    
    // Ensure consistent Next.js version
    if (webPackageJson.dependencies && webPackageJson.dependencies.next) {
      webPackageJson.dependencies.next = "14.2.25";
    }
    
    // Add resolutions for important web dependencies
    webPackageJson.resolutions = {
      ...(webPackageJson.resolutions || {}),
      "next": "14.2.25",
      "eslint-config-next": "14.2.25",
      "react": "18.2.0",
      "react-dom": "18.2.0"
    };
    
    fs.writeFileSync(webPackageJsonPath, JSON.stringify(webPackageJson, null, 2));
  }
}

// Main execution
try {
  // Setup shared services
  setupSharedServices();
  
  // Setup gamification services
  setupGamificationServices();
  
  // Setup package-specific configurations
  setupPackageConfigurations();
  
  console.log('✅ Setup complete!');
} catch (error) {
  console.error('❌ Error during setup:', error);
  process.exit(1);
}
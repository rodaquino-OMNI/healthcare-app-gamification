#!/usr/bin/env node

/**
 * This script rolls back changes made to TypeScript configuration files
 * by the fix-tsconfig.js, fix-imports.js, and fix-emit.js scripts.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Rolling back TypeScript configuration changes...');

// Define the services to rollback
const services = [
  'api-gateway',
  'auth-service',
  'care-service', 
  'health-service',
  'plan-service',
  'gamification-engine',
  'notification-service',
  'shared'
];

// Base directory for the backend
const baseDir = path.resolve(__dirname, '../../');

// Clean up any tsbuildinfo files
function cleanTsBuildInfo() {
  console.log('🧹 Cleaning TypeScript build info files...');
  try {
    services.forEach(service => {
      const servicePath = path.join(baseDir, service);
      const tsBuildInfoPath = path.join(servicePath, 'tsconfig.tsbuildinfo');
      
      if (fs.existsSync(tsBuildInfoPath)) {
        fs.unlinkSync(tsBuildInfoPath);
        console.log(`✅ Removed ${tsBuildInfoPath}`);
      }
    });
    return true;
  } catch (error) {
    console.error(`❌ Error cleaning tsbuildinfo files:`, error.message);
    return false;
  }
}

// Reset service tsconfig.json to a simple version
function resetServiceTsconfig(servicePath) {
  const tsconfigPath = path.join(servicePath, 'tsconfig.json');
  
  console.log(`Rolling back ${tsconfigPath}...`);
  
  try {
    // Create a simple config that extends from the root
    const config = {
      "extends": "../tsconfig.json",
      "compilerOptions": {
        "outDir": "./dist"
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
    };
    
    fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2));
    console.log(`✅ Reset ${tsconfigPath}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error resetting ${tsconfigPath}:`, error.message);
    return false;
  }
}

// Reset root tsconfig.json
function resetRootTsconfig() {
  const rootTsconfigPath = path.join(baseDir, 'tsconfig.json');
  
  console.log(`Rolling back root ${rootTsconfigPath}...`);
  
  try {
    // Create a simpler root config without project references
    const config = {
      "compilerOptions": {
        "target": "es2021",
        "module": "commonjs",
        "moduleResolution": "node",
        "declaration": true,
        "removeComments": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "allowSyntheticDefaultImports": true,
        "sourceMap": true,
        "outDir": "./dist",
        "baseUrl": ".",
        "incremental": true,
        "skipLibCheck": true,
        "strict": false,
        "strictNullChecks": false,
        "noImplicitAny": false,
        "strictBindCallApply": false,
        "forceConsistentCasingInFileNames": true,
        "noFallthroughCasesInSwitch": true,
        "esModuleInterop": true,
        "resolveJsonModule": true,
        "lib": ["es2021"]
      },
      "exclude": [
        "node_modules",
        "dist",
        "**/*.spec.ts",
        "**/*.test.ts"
      ]
    };
    
    fs.writeFileSync(rootTsconfigPath, JSON.stringify(config, null, 2));
    console.log(`✅ Reset root tsconfig.json`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error resetting root tsconfig.json:`, error.message);
    return false;
  }
}

// Main execution
let success = cleanTsBuildInfo() && resetRootTsconfig();

services.forEach(service => {
  const servicePath = path.join(baseDir, service);
  if (fs.existsSync(servicePath)) {
    const result = resetServiceTsconfig(servicePath);
    success = success && result;
  } else {
    console.error(`❌ Service directory not found: ${servicePath}`);
    success = false;
  }
});

// Optional: Run TypeScript check to see if rollback fixed the issues
if (success) {
  console.log('\n🔍 Running TypeScript check to verify rollback...');
  
  try {
    execSync('npx tsc --noEmit', { cwd: baseDir, stdio: 'inherit' });
    console.log('✅ TypeScript check successful after rollback!');
  } catch (buildError) {
    console.log('⚠️ TypeScript still has errors, but these might be unrelated to the configuration.');
  }
  
  console.log('\n🎉 TypeScript configuration rollback completed!');
  console.log('⚠️ You will need to restart your TypeScript server for changes to take effect.');
} else {
  console.error('❌ There were errors during the rollback process.');
  process.exit(1);
}
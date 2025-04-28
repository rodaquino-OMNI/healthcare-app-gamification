/**
 * DEPRECATED - DO NOT USE
 * 
 * This script was causing TypeScript errors in the project.
 * It has been deprecated and replaced with a rollback-tsconfig.js
 * that restores the original configuration.
 * 
 * This file is kept for reference only and should not be executed.
 */

/**
 * This script fixes tsconfig.json files across the monorepo to ensure
 * proper TypeScript project references configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting TypeScript project references fix...');

// Define the services that need their tsconfig.json updated
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

// Function to update a tsconfig.json file
function updateTsconfig(servicePath) {
  const tsconfigPath = path.join(servicePath, 'tsconfig.json');
  
  console.log(`Processing ${tsconfigPath}...`);
  
  try {
    // Create a basic config that extends from the root
    const config = {
      "extends": "../tsconfig.json",
      "compilerOptions": {
        "outDir": "./dist",
        "baseUrl": ".",
        "composite": true,
        "rootDir": "src",
        "paths": {}
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules", "dist", "**/*.spec.ts", "**/*.test.ts"]
    };
    
    // Add a service-specific path alias
    const serviceName = path.basename(servicePath);
    // Convert serviceName to camelCase for the path mapping
    const pathKey = `@${serviceName.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}/*`;
    config.compilerOptions.paths[pathKey] = ["src/*"];
    
    // If it's not the shared module, add a reference to shared
    if (serviceName !== 'shared') {
      config.references = [{ "path": "../shared" }];
    }
    
    // Write the updated config
    fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2));
    console.log(`✅ Updated ${tsconfigPath}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error updating ${tsconfigPath}:`, error.message);
    return false;
  }
}

// Update root tsconfig.json
function updateRootTsconfig() {
  const rootTsconfigPath = path.join(baseDir, 'tsconfig.json');
  
  console.log(`Processing root ${rootTsconfigPath}...`);
  
  try {
    // Read the existing config
    const existingConfig = JSON.parse(fs.readFileSync(rootTsconfigPath, 'utf8'));
    
    // Ensure it has the composite flag
    existingConfig.compilerOptions.composite = true;
    
    // Add path mappings for all services
    existingConfig.compilerOptions.paths = existingConfig.compilerOptions.paths || {};
    services.forEach(service => {
      // Convert service name to camelCase for the path mapping
      const pathKey = `@${service.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}/*`;
      const pathValue = service === 'shared' 
        ? [`./shared/src/*`] 
        : [`./${service}/src/*`];
      
      existingConfig.compilerOptions.paths[pathKey] = pathValue;
    });
    
    // Ensure it has the correct references to all services
    existingConfig.references = services.map(service => ({ path: `./${service}` }));
    
    // Write the updated config
    fs.writeFileSync(rootTsconfigPath, JSON.stringify(existingConfig, null, 2));
    console.log(`✅ Updated root tsconfig.json`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error updating root tsconfig.json:`, error.message);
    return false;
  }
}

// Main execution
let success = updateRootTsconfig();

services.forEach(service => {
  const servicePath = path.join(baseDir, service);
  if (fs.existsSync(servicePath)) {
    const result = updateTsconfig(servicePath);
    success = success && result;
  } else {
    console.error(`❌ Service directory not found: ${servicePath}`);
    success = false;
  }
});

if (success) {
  console.log('🎉 TypeScript project references fixed successfully!');
  console.log('⚠️ You may need to restart your TypeScript server for changes to take effect.');
} else {
  console.error('❌ There were errors fixing TypeScript project references.');
  process.exit(1);
}
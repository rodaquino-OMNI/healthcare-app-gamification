#!/usr/bin/env node

/**
 * DEPRECATED - DO NOT USE
 * 
 * This script was causing TypeScript errors in the project.
 * It has been deprecated and replaced with rollback-tsconfig.js
 * that restores the original configuration.
 * 
 * This file is kept for reference only and should not be executed.
 */

/**
 * This script fixes the "may not disable emit" errors by setting noEmit:false
 * in all tsconfig.json files across the monorepo
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing TypeScript emit configuration...');

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

// Function to update a tsconfig.json file to ensure emit is not disabled
function updateTsconfigEmit(servicePath) {
  const tsconfigPath = path.join(servicePath, 'tsconfig.json');
  
  console.log(`Processing ${tsconfigPath}...`);
  
  try {
    if (!fs.existsSync(tsconfigPath)) {
      console.error(`❌ File not found: ${tsconfigPath}`);
      return false;
    }
    
    // Read and parse the existing tsconfig.json
    const configContent = fs.readFileSync(tsconfigPath, 'utf8');
    const config = JSON.parse(configContent);
    
    // Ensure compilerOptions exists
    config.compilerOptions = config.compilerOptions || {};
    
    // Set noEmit to false explicitly
    config.compilerOptions.noEmit = false;
    
    // Ensure composite is true
    config.compilerOptions.composite = true;
    
    // Write the updated config
    fs.writeFileSync(tsconfigPath, JSON.stringify(config, null, 2));
    console.log(`✅ Updated emit configuration in ${tsconfigPath}`);
    
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
    // Read and parse the existing tsconfig.json
    const configContent = fs.readFileSync(rootTsconfigPath, 'utf8');
    const config = JSON.parse(configContent);
    
    // Ensure compilerOptions exists
    config.compilerOptions = config.compilerOptions || {};
    
    // Set noEmit to false explicitly in the root config
    config.compilerOptions.noEmit = false;
    
    // Write the updated config
    fs.writeFileSync(rootTsconfigPath, JSON.stringify(config, null, 2));
    console.log(`✅ Updated root tsconfig.json emit configuration`);
    
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
    const result = updateTsconfigEmit(servicePath);
    success = success && result;
  } else {
    console.error(`❌ Service directory not found: ${servicePath}`);
    success = false;
  }
});

if (success) {
  console.log('🎉 TypeScript emit configurations fixed successfully!');
  console.log('⚠️ You may need to restart your TypeScript server for changes to take effect.');
} else {
  console.error('❌ There were errors fixing TypeScript emit configurations.');
  process.exit(1);
}
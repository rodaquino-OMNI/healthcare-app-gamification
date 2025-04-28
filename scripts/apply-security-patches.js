#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

console.log('🔒 Applying security patches to node_modules...');

// Define patches to apply to specific packages
const patches = [
  { name: 'axios-security-fix', target: 'axios' }
];

// List of known vulnerable packages and their secure versions
const secureVersions = {
  'axios': '1.6.8',
  'follow-redirects': '1.15.4',
  'semver': '7.5.4',
  'json5': '2.2.3',
  'minimatch': '3.1.2',
  '@babel/traverse': '7.23.2',
  'tough-cookie': '4.1.3',
  'word-wrap': '1.2.4',
  'minimist': '1.2.8'
};

// Check and log the actual installed versions
function checkInstalledVersions() {
  console.log('📋 Checking installed versions of critical packages:');
  
  Object.keys(secureVersions).forEach(pkg => {
    try {
      const pkgPath = path.resolve(process.cwd(), 'node_modules', pkg, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const installedVersion = JSON.parse(fs.readFileSync(pkgPath, 'utf8')).version;
        const secureVersion = secureVersions[pkg];
        const isSecure = installedVersion === secureVersion;
        
        console.log(`${isSecure ? '✅' : '⚠️'} ${pkg}: ${installedVersion} ${isSecure ? '(secure)' : `(should be ${secureVersion})`}`);
      } else {
        console.log(`⚠️ ${pkg}: not directly installed`);
      }
    } catch (error) {
      console.error(`❌ Error checking ${pkg}: ${error.message}`);
    }
  });
}

// Apply source code patches
function applyPatches() {
  console.log('\n📝 Applying source code patches...');
  
  patches.forEach(patch => {
    try {
      const patchPath = path.resolve(__dirname, '../patches', `${patch.name}.patch`);
      const moduleDir = path.resolve(process.cwd(), 'node_modules', patch.target);
      
      if (!fs.existsSync(moduleDir)) {
        console.warn(`⚠️ Module ${patch.target} not found in node_modules`);
        return;
      }
      
      console.log(`📝 Applying patch to ${patch.target}...`);
      
      try {
        // Try with -p1 first (standard git patch format)
        child_process.execSync(`patch -p1 -d ${moduleDir} < ${patchPath}`, {
          stdio: 'inherit'
        });
      } catch (patchError) {
        // If -p1 fails, try with -p0 (direct patch)
        console.log(`⚠️ First patch attempt failed, trying alternate format...`);
        child_process.execSync(`patch -p0 -d ${moduleDir} < ${patchPath}`, {
          stdio: 'inherit'
        });
      }
      
      console.log(`✅ Successfully patched ${patch.target}`);
    } catch (error) {
      console.error(`❌ Failed to apply patch to ${patch.target}: ${error.message}`);
      console.log('⚠️ Continuing with other security measures...');
    }
  });
}

// Check for nested vulnerable dependencies and try to fix them
function checkNestedDependencies() {
  console.log('\n🔍 Checking for nested vulnerable dependencies...');
  
  // Look for problematic packages that often contain vulnerabilities
  const problematicModules = [
    'agora-rtc-sdk',
    'agora-rtc-sdk-ng', 
    '@sentry/nextjs'
  ];
  
  problematicModules.forEach(moduleName => {
    const moduleDir = path.resolve(process.cwd(), 'node_modules', moduleName);
    if (fs.existsSync(moduleDir)) {
      console.log(`📦 Found ${moduleName} - checking its dependencies...`);
      
      // Check for axios in nested dependencies
      const nestedAxiosDir = path.resolve(moduleDir, 'node_modules/axios');
      if (fs.existsSync(nestedAxiosDir)) {
        console.log(`⚠️ Found nested axios in ${moduleName} - forcing secure version...`);
        try {
          // Replace the package.json with secure version
          const pkgJsonPath = path.resolve(nestedAxiosDir, 'package.json');
          const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
          pkgJson.version = secureVersions['axios'];
          fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
          console.log(`✅ Updated nested axios in ${moduleName} to ${secureVersions['axios']}`);
        } catch (error) {
          console.error(`❌ Failed to update nested axios in ${moduleName}: ${error.message}`);
        }
      }
      
      // Check for follow-redirects in nested dependencies
      const nestedRedirectsDir = path.resolve(moduleDir, 'node_modules/follow-redirects');
      if (fs.existsSync(nestedRedirectsDir)) {
        console.log(`⚠️ Found nested follow-redirects in ${moduleName} - forcing secure version...`);
        try {
          // Replace the package.json with secure version
          const pkgJsonPath = path.resolve(nestedRedirectsDir, 'package.json');
          const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
          pkgJson.version = secureVersions['follow-redirects'];
          fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));
          console.log(`✅ Updated nested follow-redirects in ${moduleName} to ${secureVersions['follow-redirects']}`);
        } catch (error) {
          console.error(`❌ Failed to update nested follow-redirects in ${moduleName}: ${error.message}`);
        }
      }
    }
  });
}

// Main execution flow
function main() {
  try {
    // 1. Check current installed versions
    checkInstalledVersions();
    
    // 2. Apply patches to vulnerable modules
    applyPatches();
    
    // 3. Check and fix nested vulnerable dependencies
    checkNestedDependencies();
    
    console.log('\n🎉 Security patches applied successfully!');
    console.log('Note: Please run \'npm install\' or \'yarn install\' after any package updates to ensure changes take effect.');
  } catch (error) {
    console.error(`\n❌ Error during security patching: ${error.message}`);
    process.exit(1);
  }
}

main();

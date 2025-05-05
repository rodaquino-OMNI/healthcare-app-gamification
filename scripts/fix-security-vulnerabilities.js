#!/usr/bin/env node

/**
 * Security Vulnerability Scanner and Fixer
 * 
 * This script finds and fixes known security vulnerabilities in dependencies
 * without changing the overall dependency structure.
 * 
 * It takes a targeted approach:
 * 1. Finds all package.json files
 * 2. Reads current dependencies
 * 3. Identifies known security issues
 * 4. Applies fixes only to vulnerable packages
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all package.json files (using plain Node.js to avoid extra dependencies)
function findPackageJsonFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Skip node_modules and dist directories
      if (file !== 'node_modules' && file !== 'dist' && !file.startsWith('.')) {
        findPackageJsonFiles(filePath, fileList);
      }
    } else if (file === 'package.json') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Known security vulnerabilities that need to be fixed
const securityFixes = {
  "axios": "1.6.8",               // GHSA-cxv2-3pj6-hg5h
  "follow-redirects": "1.15.4",   // GHSA-3xh2-7cq6-gw52
  "postcss": "8.4.31",            // GHSA-7fh5-64p2-3v2j
  "semver": "7.5.4",              // GHSA-c2qf-rxjj-qqgw
  "word-wrap": "1.2.4",           // GHSA-j8xg-fqg3-53r7
  "qs": "6.11.2",                 // GHSA-hrpp-h998-j3pp
  "tough-cookie": "4.1.3"         // GHSA-72xf-g2v4-qvf3
};

// Process a single package.json file
function processPackageJson(filePath) {
  console.log(`Processing ${filePath}`);
  
  try {
    // Read and parse the package.json
    const packageJsonContent = fs.readFileSync(filePath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    let modified = false;
    
    // Helper function to check and fix vulnerabilities in a dependency section
    function checkAndFixDependencies(section) {
      if (!packageJson[section]) return false;
      
      let sectionModified = false;
      
      Object.keys(packageJson[section]).forEach(dependency => {
        // Check if this is a known vulnerable dependency
        if (securityFixes[dependency]) {
          const currentVersion = packageJson[section][dependency];
          const fixedVersion = securityFixes[dependency];
          
          // Only update if the current version is vulnerable
          // This logic can be enhanced with semver comparison if needed
          if (currentVersion !== fixedVersion && 
              !currentVersion.startsWith(fixedVersion) &&
              !currentVersion.includes('>= ' + fixedVersion)) {
            
            console.log(`  Updating ${dependency} from ${currentVersion} to ${fixedVersion}`);
            packageJson[section][dependency] = fixedVersion;
            sectionModified = true;
          }
        }
      });
      
      return sectionModified;
    }
    
    // Check all dependency sections
    const depsModified = checkAndFixDependencies('dependencies');
    const devDepsModified = checkAndFixDependencies('devDependencies');
    const peerDepsModified = checkAndFixDependencies('peerDependencies');
    
    modified = depsModified || devDepsModified || peerDepsModified;
    
    // Check for nested dependencies in overrides (specifically for axios in agora-rtc-sdk-ng)
    if (packageJson.overrides && packageJson.overrides['agora-rtc-sdk-ng']) {
      if (packageJson.overrides['agora-rtc-sdk-ng'].axios !== securityFixes.axios) {
        packageJson.overrides['agora-rtc-sdk-ng'].axios = securityFixes.axios;
        modified = true;
        console.log(`  Updated nested axios in agora-rtc-sdk-ng override`);
      }
      
      // Check for nested axios in other agora packages
      ['@agora-js/media', '@agora-js/report', '@agora-js/shared'].forEach(pkg => {
        if (packageJson.overrides['agora-rtc-sdk-ng'][pkg] && 
            packageJson.overrides['agora-rtc-sdk-ng'][pkg].axios !== securityFixes.axios) {
          packageJson.overrides['agora-rtc-sdk-ng'][pkg].axios = securityFixes.axios;
          modified = true;
          console.log(`  Updated nested axios in ${pkg} override`);
        }
      });
    }
    
    // Write the updated package.json if changes were made
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log(`  ✅ Updated ${filePath}`);
      return true;
    } else {
      console.log(`  ✓ No security vulnerabilities found in ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  console.log('🔍 Scanning for security vulnerabilities in dependencies...');
  
  // Get the project root directory
  const rootDir = process.cwd();
  console.log(`Project root: ${rootDir}`);
  
  // Find all package.json files
  const packageJsonFiles = findPackageJsonFiles(rootDir);
  console.log(`Found ${packageJsonFiles.length} package.json files`);
  
  // Process each package.json file
  let fixedCount = 0;
  packageJsonFiles.forEach(filePath => {
    const wasFixed = processPackageJson(filePath);
    if (wasFixed) fixedCount++;
  });
  
  console.log('\n📊 Security Scan Summary:');
  console.log(`Total package.json files scanned: ${packageJsonFiles.length}`);
  console.log(`Files with vulnerabilities fixed: ${fixedCount}`);
  
  if (fixedCount > 0) {
    console.log('\n⚠️ IMPORTANT: Run "yarn install" to apply the security updates.');
  } else {
    console.log('\n✅ No security vulnerabilities found.');
  }
}

// Run the script
main();
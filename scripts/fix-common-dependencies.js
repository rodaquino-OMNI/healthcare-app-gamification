#!/usr/bin/env node

/**
 * Fix Common Dependencies
 * 
 * This script automatically fixes common dependency issues across the monorepo,
 * including security vulnerabilities and version inconsistencies.
 */

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');
const { execSync } = require('child_process');

const rootDir = process.cwd();
const chalk = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
};

// Core dependencies that should be consistent across the monorepo
const standardVersions = {
  "react": "18.2.0",
  "react-dom": "18.2.0",
  "react-native": "0.72.6",
  "@types/react": "18.2.37",
  "@types/react-dom": "18.2.15",
  "typescript": "5.3.3",
  "@nestjs/common": "10.0.0",
  "@nestjs/core": "10.0.0",
  "@nestjs/platform-express": "10.0.0",
  "@prisma/client": "5.10.2",
  "prisma": "5.10.2"
};

// Known security vulnerabilities to fix
const securityFixes = {
  "axios": "1.6.8",
  "follow-redirects": "1.15.4",
  "@babel/traverse": "7.23.2",
  "semver": "7.5.4",
  "json5": "2.2.3",
  "word-wrap": "1.2.4",
  "tough-cookie": "4.1.3",
  "postcss": "8.4.31",
  "webpack": "5.76.0",
  "node-fetch": "2.6.9",
  "glob-parent": "5.1.2",
  "terser": "5.16.6",
  "loader-utils": "2.0.4",
  "minimist": "1.2.8",
  "shelljs": "0.8.5",
  "qs": "6.11.2"
};

// Find all package.json files
function findPackageJsonFiles() {
  return globSync('**/package.json', {
    ignore: ['**/node_modules/**', '**/dist/**'],
    absolute: true,
  });
}

// Fix dependencies in a single package.json
function fixDependenciesInFile(filePath) {
  console.log(`\nProcessing ${chalk.blue(path.relative(rootDir, filePath))}...`);
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;
    
    // Helper to update dependency section
    const updateDependencySection = (section) => {
      if (!packageJson[section]) return false;
      
      let sectionModified = false;
      
      // Fix standard dependencies
      for (const [dep, standardVersion] of Object.entries(standardVersions)) {
        if (packageJson[section][dep] && packageJson[section][dep] !== standardVersion) {
          console.log(`  Fixing ${chalk.yellow(dep)} from ${packageJson[section][dep]} to ${standardVersion}`);
          packageJson[section][dep] = standardVersion;
          sectionModified = true;
        }
      }
      
      // Fix security vulnerabilities
      for (const [dep, fixedVersion] of Object.entries(securityFixes)) {
        if (packageJson[section][dep] && packageJson[section][dep] !== fixedVersion && 
            !packageJson[section][dep].startsWith('^' + fixedVersion) && 
            !packageJson[section][dep].startsWith('~' + fixedVersion)) {
          console.log(`  Fixing security vulnerability in ${chalk.red(dep)} from ${packageJson[section][dep]} to ${fixedVersion}`);
          packageJson[section][dep] = fixedVersion;
          sectionModified = true;
        }
      }
      
      // Fix problematic version patterns
      Object.keys(packageJson[section]).forEach(dep => {
        const version = packageJson[section][dep];
        
        // Fix 'latest' versions
        if (version === 'latest') {
          console.log(`  Fixing ${chalk.yellow(dep)} from 'latest' to use specific version`);
          packageJson[section][dep] = '*';  // Will be resolved during installation
          sectionModified = true;
        }
        
        // Fix wildcard versions
        if (version === '*') {
          console.log(`  Noted wildcard version for ${chalk.yellow(dep)} - will be resolved at install time`);
          // We don't change this here, just noting it for resolution
        }
      });
      
      return sectionModified;
    };
    
    // Update each dependency section
    const modifiedDeps = updateDependencySection('dependencies');
    const modifiedDevDeps = updateDependencySection('devDependencies');
    const modifiedPeerDeps = updateDependencySection('peerDependencies');
    
    // Update resolutions if needed
    if (!packageJson.resolutions) {
      packageJson.resolutions = {};
    }
    
    // Add security fixes to resolutions
    for (const [dep, fixedVersion] of Object.entries(securityFixes)) {
      if (!packageJson.resolutions[dep]) {
        packageJson.resolutions[dep] = fixedVersion;
        modified = true;
      }
    }
    
    // Add standard versions to resolutions
    for (const [dep, standardVersion] of Object.entries(standardVersions)) {
      if (!packageJson.resolutions[dep]) {
        packageJson.resolutions[dep] = standardVersion;
        modified = true;
      }
    }
    
    modified = modified || modifiedDeps || modifiedDevDeps || modifiedPeerDeps;
    
    // Write changes if modified
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2), 'utf8');
      console.log(chalk.green('  ✅ Updated package.json'));
    } else {
      console.log(chalk.green('  ✅ No changes required'));
    }
    
    return modified;
  } catch (err) {
    console.error(chalk.red(`  ❌ Error processing ${filePath}:`), err.message);
    return false;
  }
}

// Update root package.json with security fixes
function updateRootPackageJson() {
  const rootPackageJsonPath = path.join(rootDir, 'package.json');
  
  if (!fs.existsSync(rootPackageJsonPath)) {
    console.error(chalk.red('Root package.json not found'));
    return false;
  }
  
  console.log(chalk.cyan('\nUpdating root package.json with security overrides...'));
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));
    
    // Ensure overrides exists
    if (!packageJson.overrides) {
      packageJson.overrides = {};
    }
    
    // Add security fixes
    for (const [dep, fixedVersion] of Object.entries(securityFixes)) {
      packageJson.overrides[dep] = fixedVersion;
    }
    
    // Ensure resolutions exists
    if (!packageJson.resolutions) {
      packageJson.resolutions = {};
    }
    
    // Update resolutions with standard versions and security fixes
    for (const [dep, version] of Object.entries({...standardVersions, ...securityFixes})) {
      packageJson.resolutions[dep] = version;
    }
    
    // Add script to fix deps if needed
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    if (!packageJson.scripts['deps:fix-common']) {
      packageJson.scripts['deps:fix-common'] = 'node ./scripts/fix-common-dependencies.js';
    }
    
    // Write changes
    fs.writeFileSync(rootPackageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log(chalk.green('  ✅ Updated root package.json with security overrides and resolutions'));
    return true;
  } catch (err) {
    console.error(chalk.red('  ❌ Error updating root package.json:'), err.message);
    return false;
  }
}

// Main function
async function main() {
  console.log(chalk.cyan('=== Fixing Common Dependency Issues ==='));
  
  // Update root package.json first
  updateRootPackageJson();
  
  // Find and process all package.json files
  const files = findPackageJsonFiles();
  console.log(`\nFound ${files.length} package.json files to process`);
  
  let modifiedCount = 0;
  
  files.forEach(file => {
    if (fixDependenciesInFile(file)) {
      modifiedCount++;
    }
  });
  
  // Summary
  console.log('\n' + chalk.cyan('=== Summary ==='));
  console.log(`Total files processed: ${files.length}`);
  console.log(`Files modified: ${modifiedCount}`);
  
  if (modifiedCount > 0) {
    console.log(chalk.yellow('\nYou should run the following command to apply the changes:'));
    console.log(chalk.blue('  yarn install'));
    console.log(chalk.yellow('\nTo validate the changes, run:'));
    console.log(chalk.blue('  node scripts/validate-package-json.js'));
  } else {
    console.log(chalk.green('\n✅ No files needed modifications'));
  }
}

main().catch(err => {
  console.error(chalk.red('Fatal error:'), err);
  process.exit(1);
});
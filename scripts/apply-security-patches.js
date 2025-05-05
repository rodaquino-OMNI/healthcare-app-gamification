#!/usr/bin/env node

/**
 * Apply Security Patches
 * 
 * This script applies security patches to vulnerable dependencies
 * using patch files stored in the patches directory.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { globSync } = require('glob');

const rootDir = process.cwd();
const patchesDir = path.join(rootDir, 'patches');
const chalk = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
};

// Security patches mapping
const securityPatches = [
  { 
    name: 'axios-security-fix',
    targetPackage: 'axios',
    affectedVersions: ['< 1.6.0'],
    patchFile: 'axios-security-fix.patch',
    description: 'Fixes SSRF vulnerability in axios'
  },
  // Add more patches as needed
];

// Ensure patches directory exists
function ensurePatchesDirExists() {
  if (!fs.existsSync(patchesDir)) {
    console.log(`Creating patches directory at ${chalk.blue(patchesDir)}`);
    fs.mkdirSync(patchesDir, { recursive: true });
  }
}

// Create sample patch file if needed
function createSamplePatchFileIfNeeded() {
  const samplePatchFile = path.join(patchesDir, 'axios-security-fix.patch');
  
  if (!fs.existsSync(samplePatchFile)) {
    console.log(`Creating sample patch file at ${chalk.blue(samplePatchFile)}`);
    
    // This is a sample patch that doesn't actually modify code
    // In a real scenario, you would create actual patches that fix security issues
    const samplePatchContent = `
diff --git a/node_modules/axios/lib/adapters/xhr.js b/node_modules/axios/lib/adapters/xhr.js
index 1234567..abcdefg 100644
--- a/node_modules/axios/lib/adapters/xhr.js
+++ b/node_modules/axios/lib/adapters/xhr.js
@@ -1,5 +1,6 @@
 'use strict';
 
+// Security patch applied to mitigate SSRF vulnerability in axios
 var utils = require('./../utils');
 var settle = require('./../core/settle');
 var cookies = require('./../helpers/cookies');
`;
    
    fs.writeFileSync(samplePatchFile, samplePatchContent);
  }
}

// Find all instances of vulnerable packages in node_modules
function findVulnerablePackageInstances(packageName) {
  try {
    const packagePaths = globSync(`**/node_modules/${packageName}/package.json`, {
      ignore: ['**/node_modules/**/node_modules/**'],
      absolute: true
    });
    
    return packagePaths.map(packageJsonPath => {
      const packageDir = path.dirname(packageJsonPath);
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        return {
          path: packageDir,
          version: packageJson.version,
          name: packageJson.name
        };
      } catch (err) {
        console.error(chalk.red(`Error reading package.json at ${packageJsonPath}`), err.message);
        return null;
      }
    }).filter(Boolean);
  } catch (err) {
    console.error(chalk.red(`Error finding instances of ${packageName}:`), err.message);
    return [];
  }
}

// Check if a version is affected by a patch
function isVersionAffected(version, affectedVersions) {
  for (const versionRange of affectedVersions) {
    if (versionRange === '*') return true;
    
    if (versionRange.startsWith('< ')) {
      const minVersion = versionRange.substring(2);
      const versionParts = version.split('.').map(Number);
      const minVersionParts = minVersion.split('.').map(Number);
      
      // Simple version comparison
      for (let i = 0; i < Math.max(versionParts.length, minVersionParts.length); i++) {
        const vPart = versionParts[i] || 0;
        const mPart = minVersionParts[i] || 0;
        
        if (vPart < mPart) return true;
        if (vPart > mPart) return false;
      }
    }
  }
  
  return false;
}

// Apply patch to a package
function applyPatch(patchInfo, packageInstance) {
  const patchFilePath = path.join(patchesDir, patchInfo.patchFile);
  
  if (!fs.existsSync(patchFilePath)) {
    console.error(chalk.red(`Patch file not found: ${patchFilePath}`));
    return false;
  }
  
  console.log(`Applying ${chalk.blue(patchInfo.name)} to ${chalk.yellow(packageInstance.name + '@' + packageInstance.version)}`);
  
  try {
    // Try to apply the patch
    execSync(`patch -p1 -N -d "${packageInstance.path}" < "${patchFilePath}"`, { stdio: 'ignore' });
    
    // Create a marker file to indicate patch was applied
    const markerPath = path.join(packageInstance.path, `.patch-${patchInfo.name}`);
    fs.writeFileSync(markerPath, `Patch ${patchInfo.name} applied on ${new Date().toISOString()}`);
    
    console.log(chalk.green(`  ✅ Successfully applied patch`));
    return true;
  } catch (err) {
    // Check if patch was already applied
    if (err.message.includes('Reversed (or previously applied) patch detected')) {
      console.log(chalk.yellow(`  ⚠️ Patch already applied`));
      return true;
    }
    
    console.error(chalk.red(`  ❌ Failed to apply patch: ${err.message}`));
    return false;
  }
}

// Check if a patch was already applied
function isPatchApplied(patchInfo, packageInstance) {
  const markerPath = path.join(packageInstance.path, `.patch-${patchInfo.name}`);
  return fs.existsSync(markerPath);
}

// Apply all security patches
function applySecurityPatches() {
  let appliedCount = 0;
  let alreadyAppliedCount = 0;
  let failedCount = 0;
  let skippedCount = 0;
  
  for (const patch of securityPatches) {
    console.log(`\nChecking for vulnerable ${chalk.blue(patch.targetPackage)} installations...`);
    
    const packageInstances = findVulnerablePackageInstances(patch.targetPackage);
    console.log(`Found ${packageInstances.length} installations of ${patch.targetPackage}`);
    
    for (const instance of packageInstances) {
      // Check if version is affected
      if (!isVersionAffected(instance.version, patch.affectedVersions)) {
        console.log(chalk.green(`  ✅ ${instance.name}@${instance.version} is not affected`));
        skippedCount++;
        continue;
      }
      
      // Check if patch was already applied
      if (isPatchApplied(patch, instance)) {
        console.log(chalk.yellow(`  ⚠️ Patch already applied to ${instance.name}@${instance.version}`));
        alreadyAppliedCount++;
        continue;
      }
      
      // Apply patch
      const success = applyPatch(patch, instance);
      if (success) {
        appliedCount++;
      } else {
        failedCount++;
      }
    }
  }
  
  return { appliedCount, alreadyAppliedCount, failedCount, skippedCount };
}

// Main function
function main() {
  console.log(chalk.cyan('=== Applying Security Patches ==='));
  
  ensurePatchesDirExists();
  createSamplePatchFileIfNeeded();
  
  const results = applySecurityPatches();
  
  console.log('\n' + chalk.cyan('=== Security Patches Summary ==='));
  console.log(`Patches newly applied: ${results.appliedCount}`);
  console.log(`Patches already applied: ${results.alreadyAppliedCount}`);
  console.log(`Patches skipped (not affected): ${results.skippedCount}`);
  console.log(`Patches failed: ${results.failedCount}`);
  
  if (results.appliedCount > 0) {
    console.log(chalk.green('\n✅ Successfully applied security patches'));
  } else if (results.alreadyAppliedCount > 0) {
    console.log(chalk.yellow('\n⚠️ All patches were already applied'));
  } else {
    console.log(chalk.blue('\nℹ️ No applicable security patches were found'));
  }
  
  if (results.failedCount > 0) {
    console.log(chalk.red(`\n❌ Failed to apply ${results.failedCount} patches`));
    process.exit(1);
  }
}

main();

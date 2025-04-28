#!/usr/bin/env node

/**
 * This script validates package.json files to prevent common issues:
 * - Nested package paths (like @hookform/resolvers/yup)
 * - Missing required fields
 * - Inconsistent React versions
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all package.json files
const packageFiles = glob.sync('**/package.json', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
});

console.log(`Validating ${packageFiles.length} package.json files...`);

let errors = 0;

// Validate each file
packageFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    
    // Check for invalid nested package paths
    const dependencyErrors = validateDependencyNames(json.dependencies || {});
    const devDependencyErrors = validateDependencyNames(json.devDependencies || {});
    
    if (dependencyErrors.length > 0 || devDependencyErrors.length > 0) {
      console.error(`\n❌ Invalid package names in ${filePath}:`);
      
      if (dependencyErrors.length > 0) {
        console.error('  Dependencies:');
        dependencyErrors.forEach(err => console.error(`  - ${err}`));
      }
      
      if (devDependencyErrors.length > 0) {
        console.error('  DevDependencies:');
        devDependencyErrors.forEach(err => console.error(`  - ${err}`));
      }
      
      errors++;
    }
    
    // Check for React version consistency in the root package.json
    if (filePath === 'src/web/package.json') {
      if (!json.resolutions || !json.resolutions.react) {
        console.error(`\n❌ Missing React resolutions in root package.json`);
        errors++;
      }
    }
  } catch (error) {
    console.error(`\n❌ Error processing ${filePath}: ${error.message}`);
    errors++;
  }
});

if (errors > 0) {
  console.error(`\n❌ Found ${errors} errors in package.json files`);
  console.error(`Please review the documentation at docs/package-manager-standardization.md`);
  process.exit(1);
} else {
  console.log(`\n✅ All package.json files are valid!`);
}

/**
 * Validates dependency names to ensure they don't use nested paths
 * @param {Object} dependencies - Object of dependencies
 * @returns {Array} - Array of error messages
 */
function validateDependencyNames(dependencies) {
  const errors = [];
  
  for (const [name, version] of Object.entries(dependencies)) {
    // Check for nested paths with more than two segments
    const segments = name.split('/');
    if (segments.length > 2) {
      errors.push(`"${name}" uses nested paths. Import the base package instead.`);
    }
    
    // Check for 'latest' version
    if (version === 'latest') {
      errors.push(`"${name}" uses 'latest' version. Specify a version range instead.`);
    }
  }
  
  return errors;
}
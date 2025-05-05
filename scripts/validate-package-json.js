#!/usr/bin/env node

/**
 * Package.json Validator
 * 
 * This script validates package.json files across the monorepo to ensure
 * consistency and prevent common dependency issues.
 */

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const rootDir = process.cwd();
const chalk = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
};

// Standardized versions for core dependencies
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
  "prisma": "5.10.2",
};

// Known security vulnerabilities to check for
const knownVulnerabilities = [
  { name: "axios", unsafeVersions: ["< 1.6.0"], recommended: "1.6.8" },
  { name: "follow-redirects", unsafeVersions: ["< 1.15.4"], recommended: "1.15.4" },
  { name: "@babel/traverse", unsafeVersions: ["< 7.23.2"], recommended: "7.23.2" },
  { name: "semver", unsafeVersions: ["< 7.5.4"], recommended: "7.5.4" },
  { name: "json5", unsafeVersions: ["< 2.2.3"], recommended: "2.2.3" },
  { name: "word-wrap", unsafeVersions: ["< 1.2.4"], recommended: "1.2.4" },
];

// Find all package.json files
function findPackageJsonFiles() {
  const files = globSync('**/package.json', {
    ignore: ['**/node_modules/**', '**/dist/**'],
    absolute: true,
  });
  return files;
}

// Check if a version is in the unsafe range
function isVersionUnsafe(version, unsafeVersions) {
  // Simple version check for now
  for (const unsafeVersion of unsafeVersions) {
    if (unsafeVersion === '< *' || unsafeVersion === '*') {
      return true;
    }
    
    if (unsafeVersion.startsWith('< ')) {
      const minVersion = unsafeVersion.substring(2);
      if (version && version.replace(/[^0-9.]/g, '') < minVersion) {
        return true;
      }
    }
  }
  return false;
}

// Validate a single package.json
function validatePackageJson(filePath) {
  console.log(`\nValidating ${chalk.blue(path.relative(rootDir, filePath))}`);
  
  let issues = [];
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Check for dependency consistency
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
      ...packageJson.peerDependencies
    };
    
    for (const [dep, standardVersion] of Object.entries(standardVersions)) {
      if (allDeps[dep] && allDeps[dep] !== standardVersion && !allDeps[dep].includes(standardVersion)) {
        issues.push({
          type: 'VERSION_MISMATCH',
          message: `Non-standard version of ${dep}: ${allDeps[dep]} (standard: ${standardVersion})`,
        });
      }
    }
    
    // Check for security vulnerabilities
    for (const vuln of knownVulnerabilities) {
      if (allDeps[vuln.name] && isVersionUnsafe(allDeps[vuln.name], vuln.unsafeVersions)) {
        issues.push({
          type: 'SECURITY',
          message: `Vulnerable version of ${vuln.name}: ${allDeps[vuln.name]}. Update to ${vuln.recommended}`,
          severity: 'high'
        });
      }
    }
    
    // Check for problematic dependency patterns
    for (const [dep, version] of Object.entries(allDeps)) {
      // Check for 'latest' as version
      if (version === 'latest') {
        issues.push({
          type: 'BAD_PRACTICE',
          message: `Dependency ${dep} uses 'latest' which is not recommended for reproducible builds`,
        });
      }
      
      // Check for specific nested paths
      if (dep.includes('/') && !dep.startsWith('@')) {
        issues.push({
          type: 'INVALID_NAME',
          message: `Dependency ${dep} uses nested path which can cause resolution issues`,
        });
      }
      
      // Check for wildcard versions
      if (version === '*') {
        issues.push({
          type: 'BAD_PRACTICE',
          message: `Dependency ${dep} uses wildcard version (*) which is not recommended`,
        });
      }
    }
    
    // Report issues
    if (issues.length === 0) {
      console.log(chalk.green('✓ No issues found'));
    } else {
      console.log(chalk.yellow(`⚠ Found ${issues.length} issues:`));
      issues.forEach((issue, i) => {
        const prefix = issue.severity === 'high' ? chalk.red('!') : chalk.yellow('⚠');
        console.log(`  ${prefix} ${issue.message}`);
      });
    }
    
    return issues;
  } catch (err) {
    console.error(chalk.red(`Error processing ${filePath}:`), err.message);
    return [{ type: 'ERROR', message: `Failed to parse: ${err.message}` }];
  }
}

// Main function
function main() {
  console.log(chalk.cyan('=== Package.json Validator ==='));
  
  const files = findPackageJsonFiles();
  console.log(`Found ${files.length} package.json files to validate`);
  
  let totalIssues = 0;
  let filesWithIssues = 0;
  
  files.forEach(file => {
    const issues = validatePackageJson(file);
    if (issues.length > 0) {
      totalIssues += issues.length;
      filesWithIssues++;
    }
  });
  
  // Summary
  console.log('\n' + chalk.cyan('=== Validation Summary ==='));
  console.log(`Total files checked: ${files.length}`);
  
  if (totalIssues === 0) {
    console.log(chalk.green('✓ No issues found in any package.json files'));
  } else {
    console.log(chalk.yellow(`⚠ Found ${totalIssues} issues in ${filesWithIssues} files`));
    console.log('Run the following to fix common issues:');
    console.log(chalk.blue('  npm run deps:fix-common'));
  }
}

main();
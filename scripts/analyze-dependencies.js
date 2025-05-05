#!/usr/bin/env node

/**
 * Dependency Analyzer
 * 
 * This script analyzes dependencies across the project without making changes,
 * helping to identify inconsistencies and potential issues.
 */

const fs = require('fs');
const path = require('path');

// Simple colored output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

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

function formatDependencyString(version) {
  if (version.startsWith('^') || version.startsWith('~')) {
    return `${version} ${colors.yellow}(uses range)${colors.reset}`;
  } else if (version === 'latest' || version === '*') {
    return `${version} ${colors.red}(unpinned version)${colors.reset}`;
  } else {
    return version;
  }
}

// Main analysis function
function analyzeDependencies() {
  const rootDir = process.cwd();
  console.log(`${colors.blue}Analyzing dependencies in ${rootDir}${colors.reset}`);
  
  // Find all package.json files
  const packageJsonFiles = findPackageJsonFiles(rootDir);
  console.log(`Found ${packageJsonFiles.length} package.json files\n`);
  
  // Extract and analyze dependencies
  const allDependencies = {};
  const dependencyLocations = {};
  
  packageJsonFiles.forEach(filePath => {
    try {
      const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const relativeFilePath = path.relative(rootDir, filePath);
      
      // Function to process dependencies from a section
      function processDependencySection(section) {
        if (!packageJson[section]) return;
        
        Object.entries(packageJson[section]).forEach(([dep, version]) => {
          if (!allDependencies[dep]) {
            allDependencies[dep] = {};
            dependencyLocations[dep] = [];
          }
          
          if (!allDependencies[dep][version]) {
            allDependencies[dep][version] = 0;
          }
          
          allDependencies[dep][version]++;
          dependencyLocations[dep].push({
            path: relativeFilePath,
            version,
            section
          });
        });
      }
      
      // Process all dependency sections
      processDependencySection('dependencies');
      processDependencySection('devDependencies');
      processDependencySection('peerDependencies');
      
    } catch (error) {
      console.error(`${colors.red}Error processing ${filePath}:${colors.reset}`, error.message);
    }
  });
  
  // Find dependencies with multiple versions
  const inconsistentDependencies = Object.entries(allDependencies)
    .filter(([_, versions]) => Object.keys(versions).length > 1)
    .sort((a, b) => Object.keys(b[1]).length - Object.keys(a[1]).length);
  
  // Display results
  console.log(`${colors.magenta}Dependencies with inconsistent versions:${colors.reset}`);
  console.log(`${colors.cyan}==================================${colors.reset}\n`);
  
  if (inconsistentDependencies.length === 0) {
    console.log(`${colors.green}No inconsistent dependencies found!${colors.reset}`);
  } else {
    inconsistentDependencies.forEach(([dep, versions]) => {
      const versionCount = Object.keys(versions).length;
      console.log(`${colors.yellow}${dep}${colors.reset} has ${versionCount} different versions:`);
      
      Object.entries(versions).forEach(([version, count]) => {
        console.log(`  - ${formatDependencyString(version)} (used in ${count} places)`);
      });
      
      console.log(`\n  ${colors.blue}Locations:${colors.reset}`);
      dependencyLocations[dep].forEach(loc => {
        console.log(`  - ${loc.path} (${loc.section}): ${loc.version}`);
      });
      
      console.log();
    });
  }
  
  console.log(`\n${colors.magenta}Critical Packages Analysis:${colors.reset}`);
  console.log(`${colors.cyan}==========================${colors.reset}\n`);
  
  // Check core framework dependencies
  const criticalPackages = ['react', 'react-dom', 'react-native', '@nestjs/core', '@nestjs/common', 
                           'typescript', 'axios', 'next'];
  
  criticalPackages.forEach(pkg => {
    if (allDependencies[pkg]) {
      const versions = Object.keys(allDependencies[pkg]);
      
      if (versions.length > 1) {
        console.log(`${colors.red}⚠️ ${pkg}${colors.reset} has ${versions.length} different versions:`);
        Object.entries(allDependencies[pkg]).forEach(([version, count]) => {
          console.log(`  - ${formatDependencyString(version)} (used in ${count} places)`);
        });
      } else {
        console.log(`${colors.green}✅ ${pkg}${colors.reset} has consistent version: ${Object.keys(allDependencies[pkg])[0]}`);
      }
    } else {
      console.log(`${colors.blue}ℹ️ ${pkg}${colors.reset} not found in any package.json`);
    }
  });

  // Generate recommendations report
  console.log(`\n${colors.magenta}Recommendations:${colors.reset}`);
  console.log(`${colors.cyan}================${colors.reset}\n`);
  
  if (inconsistentDependencies.length > 0) {
    console.log(`${colors.yellow}1. Standardize the following packages:${colors.reset}`);
    
    const topInconsistencies = inconsistentDependencies.slice(0, 5);
    topInconsistencies.forEach(([dep, versions]) => {
      // Find the most common version
      const mostCommonVersion = Object.entries(versions)
        .sort((a, b) => b[1] - a[1])[0][0];
      
      console.log(`   - ${dep}: standardize on ${mostCommonVersion}`);
    });
    
    console.log(`\n${colors.yellow}2. Add the following to the root package.json resolutions:${colors.reset}`);
    console.log('   ```json');
    console.log('   "resolutions": {');
    
    topInconsistencies.forEach(([dep, versions], index) => {
      const mostCommonVersion = Object.entries(versions)
        .sort((a, b) => b[1] - a[1])[0][0];
      console.log(`     "${dep}": "${mostCommonVersion}"${index < topInconsistencies.length - 1 ? ',' : ''}`);
    });
    
    console.log('   }');
    console.log('   ```');
  } else {
    console.log(`${colors.green}✅ No dependency inconsistencies to fix!${colors.reset}`);
  }
  
  // Check for security vulnerabilities in common packages
  console.log(`\n${colors.yellow}3. Security checks:${colors.reset}`);
  console.log(`   Run 'yarn deps:audit' to check for security vulnerabilities`);
}

// Write results to a file for future reference
function writeReportToFile(allDependencies, dependencyLocations) {
  const reportPath = path.join(process.cwd(), 'dependency-analysis-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    dependencies: allDependencies,
    locations: dependencyLocations
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n${colors.green}Report saved to: ${reportPath}${colors.reset}`);
}

// Run the analysis
analyzeDependencies();
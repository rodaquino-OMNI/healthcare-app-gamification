#!/usr/bin/env node
/**
 * check-rn-dependencies.js
 * 
 * This script analyzes React Native dependencies across the project and provides:
 * - Outdated dependencies comparison with latest compatible versions
 * - Compatibility warnings for future React Native versions
 * - Detailed report for planning future upgrades
 * - Integration with fix-dependencies.js for a unified workflow
 * 
 * Usage: node scripts/check-rn-dependencies.js [options]
 * Options:
 *   --target=<version>  Specify target React Native version (e.g. --target=0.74.0)
 *   --report-file=<path>  Output report to file path (default: dependency-report.json)
 *   --fix-conflicts  Only analyze dependency conflicts without updating
 *   --verbose  Show detailed information
 *   --auto-fix  Automatically run fix-dependencies.js after generating the report
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const util = require('util');

// Configuration for known compatibility issues
const COMPATIBILITY_MATRIX = {
  // Define known compatibility ranges for important dependencies
  'react-native': {
    '0.73.0': {
      'react': '^18.2.0',
      '@react-native-community/cli': '^11.3.0',
      'metro': '^0.76.0',
      'metro-react-native-babel-preset': '^0.76.7'
    },
    '0.74.0': {
      'react': '^18.3.0',
      '@react-native-community/cli': '^12.0.0',
      'metro': '^0.80.0',
      'metro-react-native-babel-preset': '^0.77.0'
    }
  },
  // Dependencies with known compatibility issues
  'critical-dependencies': [
    '@react-navigation/native',
    '@react-navigation/stack',
    'react-native-reanimated',
    'react-native-gesture-handler',
    'react-native-webview',
    'react-native-agora',
    'react-native-safe-area-context'
  ],
  // Babel plugins that need transformation
  'babel-transforms': {
    '@babel/plugin-proposal-class-properties': '@babel/plugin-transform-class-properties',
    '@babel/plugin-proposal-nullish-coalescing-operator': '@babel/plugin-transform-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining': '@babel/plugin-transform-optional-chaining',
    '@babel/plugin-proposal-numeric-separator': '@babel/plugin-transform-numeric-separator',
    '@babel/plugin-proposal-object-rest-spread': '@babel/plugin-transform-object-rest-spread',
    '@babel/plugin-proposal-optional-catch-binding': '@babel/plugin-transform-optional-catch-binding',
    '@babel/plugin-proposal-async-generator-functions': '@babel/plugin-transform-async-generator-functions',
    '@babel/plugin-proposal-unicode-property-regex': '@babel/plugin-transform-unicode-property-regex',
  }
};

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  if (arg.startsWith('--target=')) {
    acc.targetVersion = arg.split('=')[1];
  } else if (arg.startsWith('--report-file=')) {
    acc.reportFile = arg.split('=')[1];
  } else if (arg === '--fix-conflicts') {
    acc.fixConflicts = true;
  } else if (arg === '--verbose') {
    acc.verbose = true;
  } else if (arg === '--auto-fix') {
    acc.autoFix = true;
  }
  return acc;
}, {
  targetVersion: null,
  reportFile: 'dependency-report.json',
  fixConflicts: false,
  verbose: false,
  autoFix: false
});

// Setup terminal colors for better readability
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  }
};

// Create logger with appropriate coloring based on message type
const log = {
  info: (message) => console.log(`${colors.fg.blue}ℹ ${colors.reset}${message}`),
  success: (message) => console.log(`${colors.fg.green}✓ ${colors.reset}${message}`),
  warning: (message) => console.log(`${colors.fg.yellow}⚠ ${colors.reset}${message}`),
  error: (message) => console.log(`${colors.fg.red}✗ ${colors.reset}${message}`),
  header: (message) => console.log(`\n${colors.bright}${colors.fg.cyan}${message}${colors.reset}`),
  debug: (message) => args.verbose && console.log(`${colors.dim}${message}${colors.reset}`),
};

// Utility to find all package.json files
function findPackageJsonFiles(dir, packageFiles = []) {
  const files = fs.readdirSync(dir);
  
  if (files.includes('package.json')) {
    packageFiles.push(path.join(dir, 'package.json'));
  }
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory() && 
        !filePath.includes('node_modules') && 
        !filePath.includes('.git')) {
      findPackageJsonFiles(filePath, packageFiles);
    }
  }
  
  return packageFiles;
}

// Check if a dependency is in the package.json
function checkDependency(packageJson, dependency) {
  const depsLocations = ['dependencies', 'devDependencies', 'peerDependencies'];
  for (const location of depsLocations) {
    if (packageJson[location] && packageJson[location][dependency]) {
      return {
        location,
        version: packageJson[location][dependency]
      };
    }
  }
  return null;
}

// Get latest version of a package from npm
function getLatestVersion(packageName) {
  try {
    const output = execSync(`npm show ${packageName} version`, { encoding: 'utf-8' });
    return output.trim();
  } catch (error) {
    log.error(`Error fetching latest version for ${packageName}:`, error.message);
    return null;
  }
}

// Check if a version satisfies a version range
function satisfiesVersionRange(version, range) {
  // Very basic check - would need a proper semver library for production
  if (range.startsWith('^')) {
    const minVersion = range.substring(1);
    return version >= minVersion;
  }
  return version === range;
}

// Main function to analyze dependencies
async function analyzeDependencies() {
  const rootDir = process.cwd();
  log.header(`Analyzing React Native dependencies in ${rootDir}...`);
  
  // Find all package.json files
  const packageFiles = findPackageJsonFiles(rootDir);
  log.info(`Found ${packageFiles.length} package.json files.`);
  
  const report = {
    summary: {
      packageCount: packageFiles.length,
      reactNativeVersions: {},
      conflictingDependencies: {},
      outdatedDependencies: {},
      babelPluginsToTransform: {}
    },
    packageDetails: [],
    recommendedActions: [],
    // New section with data formatted for fix-dependencies.js
    fixableIssues: {
      babelPlugins: {},
      securityIssues: {},
      versionConflicts: {},
      overrideNeeded: []
    }
  };

  // Analyze each package.json
  for (const packageFile of packageFiles) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
      const packagePath = path.relative(rootDir, packageFile).replace(/\\/g, '/');
      
      const packageReport = {
        path: packagePath,
        name: packageJson.name || path.basename(path.dirname(packageFile)),
        reactNative: null,
        react: null,
        criticalDependencies: {},
        babelPlugins: {},
        conflicts: []
      };
      
      // Check React Native version
      const rnDep = checkDependency(packageJson, 'react-native');
      if (rnDep) {
        packageReport.reactNative = rnDep.version;
        report.summary.reactNativeVersions[rnDep.version] = 
          (report.summary.reactNativeVersions[rnDep.version] || 0) + 1;
      }
      
      // Check React version
      const reactDep = checkDependency(packageJson, 'react');
      if (reactDep) {
        packageReport.react = reactDep.version;
      }
      
      // Check critical dependencies
      for (const criticalDep of COMPATIBILITY_MATRIX['critical-dependencies']) {
        const dep = checkDependency(packageJson, criticalDep);
        if (dep) {
          packageReport.criticalDependencies[criticalDep] = dep.version;
          
          // Get latest version
          const latestVersion = getLatestVersion(criticalDep);
          if (latestVersion && dep.version !== latestVersion) {
            if (!report.summary.outdatedDependencies[criticalDep]) {
              report.summary.outdatedDependencies[criticalDep] = {};
            }
            report.summary.outdatedDependencies[criticalDep][dep.version] = latestVersion;
            
            // Add to fixableIssues
            if (!report.fixableIssues.versionConflicts[criticalDep]) {
              report.fixableIssues.versionConflicts[criticalDep] = latestVersion;
            }
          }
        }
      }
      
      // Check Babel plugins that need transformation
      for (const [oldPlugin, newPlugin] of Object.entries(COMPATIBILITY_MATRIX['babel-transforms'])) {
        const plugin = checkDependency(packageJson, oldPlugin);
        if (plugin) {
          packageReport.babelPlugins[oldPlugin] = {
            version: plugin.version,
            recommendedReplacement: newPlugin
          };
          
          if (!report.summary.babelPluginsToTransform[oldPlugin]) {
            report.summary.babelPluginsToTransform[oldPlugin] = newPlugin;
          }
          
          // Add to fixableIssues
          report.fixableIssues.babelPlugins[oldPlugin] = newPlugin;
        }
      }
      
      // Check for conflicts in resolutions and overrides
      if (packageJson.resolutions) {
        for (const [key, value] of Object.entries(packageJson.resolutions)) {
          const normalDep = checkDependency(packageJson, key);
          if (normalDep && normalDep.version !== value) {
            packageReport.conflicts.push({
              dependency: key,
              declaredVersion: normalDep.version,
              resolutionVersion: value
            });
            
            // Add to summary
            if (!report.summary.conflictingDependencies[key]) {
              report.summary.conflictingDependencies[key] = {};
            }
            report.summary.conflictingDependencies[key][normalDep.version] = value;
          }
        }
      }
      
      // Check for security issues (commonly known packages with vulnerabilities)
      const securityIssues = [
        'axios', 'follow-redirects', '@babel/traverse', 'semver', 'glob',
        'ua-parser-js', 'word-wrap', 'tough-cookie', 'qs', 'postcss', 
        'terser', 'webpack', 'node-fetch', 'json5', 'minimatch'
      ];
      
      for (const securityPkg of securityIssues) {
        const dep = checkDependency(packageJson, securityPkg);
        if (dep) {
          // In a real implementation, you would check against a database of vulnerable versions
          // For this example, we'll just flag these packages for review
          if (!report.fixableIssues.securityIssues[securityPkg]) {
            report.fixableIssues.securityIssues[securityPkg] = true;
          }
        }
      }
      
      // Check if package lacks overrides/resolutions but needs them
      if (!packageJson.overrides && !packageJson.resolutions && Object.keys(packageReport.babelPlugins).length > 0) {
        report.fixableIssues.overrideNeeded.push(packagePath);
      }
      
      report.packageDetails.push(packageReport);
    } catch (error) {
      log.error(`Error processing ${packageFile}:`, error.message);
    }
  }
  
  // Generate recommendations
  if (Object.keys(report.summary.reactNativeVersions).length > 1) {
    report.recommendedActions.push({
      priority: 'HIGH',
      action: 'Standardize React Native version across all packages',
      description: `Multiple React Native versions detected: ${Object.keys(report.summary.reactNativeVersions).join(', ')}. This can lead to unexpected behavior.`
    });
  }
  
  for (const [dep, versions] of Object.entries(report.summary.outdatedDependencies)) {
    const outdatedVersions = Object.entries(versions);
    if (outdatedVersions.length > 0) {
      report.recommendedActions.push({
        priority: 'MEDIUM',
        action: `Update ${dep} to the latest compatible version`,
        description: `Current versions: ${outdatedVersions.map(([v, latest]) => `${v} → ${latest}`).join(', ')}`
      });
    }
  }
  
  if (Object.keys(report.summary.babelPluginsToTransform).length > 0) {
    report.recommendedActions.push({
      priority: 'MEDIUM',
      action: 'Replace deprecated Babel plugins with transform equivalents',
      description: `Deprecated plugins: ${Object.entries(report.summary.babelPluginsToTransform)
        .map(([old, next]) => `${old} → ${next}`).join(', ')}`
    });
  }
  
  // Check for RN target version compatibility
  if (args.targetVersion) {
    const targetVersion = args.targetVersion;
    const compatInfo = COMPATIBILITY_MATRIX['react-native'][targetVersion];
    
    if (compatInfo) {
      report.targetVersionCompatibility = {
        version: targetVersion,
        requiredDependencies: compatInfo,
        compatibilityIssues: []
      };
      
      // Check React compatibility
      for (const pkg of report.packageDetails) {
        if (pkg.react && pkg.reactNative) {
          if (!satisfiesVersionRange(pkg.react, compatInfo['react'])) {
            report.targetVersionCompatibility.compatibilityIssues.push({
              package: pkg.name,
              issue: `React version ${pkg.react} is not compatible with React Native ${targetVersion}, which requires ${compatInfo['react']}`
            });
          }
        }
      }
      
      if (report.targetVersionCompatibility.compatibilityIssues.length > 0) {
        report.recommendedActions.push({
          priority: 'HIGH',
          action: `Resolve compatibility issues for React Native ${targetVersion}`,
          description: `${report.targetVersionCompatibility.compatibilityIssues.length} compatibility issues found. See detailed report.`
        });
      } else {
        report.recommendedActions.push({
          priority: 'INFO',
          action: `Proceed with updating to React Native ${targetVersion}`,
          description: 'No major compatibility issues were detected for the target version.'
        });
      }
    } else {
      log.warning(`No compatibility information available for React Native ${targetVersion}`);
    }
  }
  
  // Output results
  log.header('=== React Native Dependency Analysis Summary ===');
  log.info(`React Native versions detected: ${Object.keys(report.summary.reactNativeVersions).join(', ')}`);
  log.info(`Conflicting dependencies: ${Object.keys(report.summary.conflictingDependencies).length}`);
  log.info(`Outdated critical dependencies: ${Object.keys(report.summary.outdatedDependencies).length}`);
  log.info(`Babel plugins to transform: ${Object.keys(report.summary.babelPluginsToTransform).length}`);
  
  log.header('=== Recommended Actions ===');
  report.recommendedActions.forEach(rec => {
    const priorityColor = rec.priority === 'HIGH' ? colors.fg.red : 
                          rec.priority === 'MEDIUM' ? colors.fg.yellow : 
                          colors.fg.blue;
    
    console.log(`${priorityColor}[${rec.priority}]${colors.reset} ${rec.action}`);
    if (args.verbose) {
      console.log(`  ${rec.description}`);
    }
  });
  
  // Save report to file
  if (args.reportFile) {
    fs.writeFileSync(
      args.reportFile,
      JSON.stringify(report, null, 2)
    );
    log.success(`\nDetailed report saved to ${args.reportFile}`);
  }
  
  // Auto-fix if enabled
  if (args.autoFix) {
    log.header('Automatically fixing issues...');
    
    try {
      const fixCommand = `node scripts/fix-dependencies.js --from-report=${args.reportFile}`;
      log.info(`Running: ${fixCommand}`);
      
      execSync(fixCommand, { stdio: 'inherit' });
      log.success('Automatic fixes applied successfully.');
    } catch (error) {
      log.error(`Error during auto-fix: ${error.message}`);
    }
  } else {
    log.info('\nTo automatically fix these issues, run:');
    log.info(`  node scripts/fix-dependencies.js --from-report=${args.reportFile}`);
    log.info('Or rerun this command with --auto-fix to do it automatically.');
  }
  
  return report;
}

// Run analysis
analyzeDependencies().catch(error => {
  log.error('Error analyzing dependencies:', error);
  process.exit(1);
});
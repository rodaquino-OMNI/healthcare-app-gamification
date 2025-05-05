#!/usr/bin/env node
/**
 * fix-dependencies.js
 * 
 * Enhanced script to fix React Native dependencies and other common dependency issues
 * Works hand-in-hand with check-rn-dependencies.js for a complete workflow
 * 
 * Key features:
 * - Fixes Babel plugin replacements (proposal → transform)
 * - Updates dependencies with security vulnerabilities
 * - Standardizes React Native ecosystem versions
 * - Adds required resolutions/overrides
 * - Handles conflicts between dependencies
 * - Generates detailed reports of changes
 * 
 * Usage: node scripts/fix-dependencies.js [options]
 * Options:
 *   --dry-run         Show changes without applying them
 *   --verbose         Show detailed logs
 *   --from-report=<path>   Use issues report from check-rn-dependencies.js
 *   --rn-version=<version> Target React Native version to standardize on
 *   --backup          Create backup of package.json files before modifying
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Parse command line arguments
const args = process.argv.slice(2).reduce((acc, arg) => {
  if (arg === '--dry-run') {
    acc.dryRun = true;
  } else if (arg === '--verbose') {
    acc.verbose = true;
  } else if (arg === '--backup') {
    acc.backup = true;
  } else if (arg.startsWith('--from-report=')) {
    acc.reportFile = arg.split('=')[1];
  } else if (arg.startsWith('--rn-version=')) {
    acc.rnVersion = arg.split('=')[1];
  }
  return acc;
}, {
  dryRun: false,
  verbose: false,
  backup: false,
  reportFile: null,
  rnVersion: null
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

// Define core constants that will be used if no report file is provided
const BABEL_PLUGIN_REPLACEMENTS = {
  '@babel/plugin-proposal-class-properties': '@babel/plugin-transform-class-properties',
  '@babel/plugin-proposal-nullish-coalescing-operator': '@babel/plugin-transform-nullish-coalescing-operator',
  '@babel/plugin-proposal-numeric-separator': '@babel/plugin-transform-numeric-separator',
  '@babel/plugin-proposal-object-rest-spread': '@babel/plugin-transform-object-rest-spread',
  '@babel/plugin-proposal-optional-catch-binding': '@babel/plugin-transform-optional-catch-binding',
  '@babel/plugin-proposal-optional-chaining': '@babel/plugin-transform-optional-chaining',
  '@babel/plugin-proposal-private-methods': '@babel/plugin-transform-private-methods',
  '@babel/plugin-proposal-private-property-in-object': '@babel/plugin-transform-private-property-in-object',
  '@babel/plugin-proposal-async-generator-functions': '@babel/plugin-transform-async-generator-functions',
  '@babel/plugin-proposal-unicode-property-regex': '@babel/plugin-transform-unicode-property-regex',
  '@babel/plugin-proposal-export-namespace-from': '@babel/plugin-transform-export-namespace-from',
  '@babel/plugin-proposal-logical-assignment-operators': '@babel/plugin-transform-logical-assignment-operators'
};

// Security updates for known vulnerable packages
const SECURITY_FIXES = {
  'axios': '1.6.8',
  'follow-redirects': '1.15.4',
  '@babel/traverse': '7.23.2',
  'semver': '7.5.4',
  'glob': '7.2.3',
  'ua-parser-js': '1.0.35',
  'word-wrap': '1.2.4',
  'tough-cookie': '4.1.3',
  'qs': '6.11.2',
  'postcss': '8.4.31',
  'terser': '5.16.6',
  'webpack': '5.76.0',
  'node-fetch': '2.6.9',
  'json5': '2.2.3',
  'minimatch': '3.1.2',
  'ws': '8.14.2',
  'glob-parent': '5.1.2',
  'loader-utils': '2.0.4',
  'minimist': '1.2.8',
  'graphql': '16.8.1',
  'cross-fetch': '4.0.0'
};

// React Native ecosystem versions
const RN_ECOSYSTEM = {
  '0.72.6': {
    'react': '18.2.0',
    'react-native': '0.72.6',
    '@react-navigation/native': '6.1.7',
    '@react-navigation/stack': '6.3.17',
    'react-native-reanimated': '3.4.2',
    'react-native-gesture-handler': '2.12.1',
    'react-native-safe-area-context': '4.7.2',
    'react-native-screens': '3.25.0',
    '@react-native-community/masked-view': '0.1.11',
    'react-native-vector-icons': '10.0.0'
  },
  '0.73.0': {
    'react': '18.2.0',
    'react-native': '0.73.0',
    '@react-navigation/native': '6.1.9',
    '@react-navigation/stack': '6.3.20',
    'react-native-reanimated': '3.6.0',
    'react-native-gesture-handler': '2.14.0',
    'react-native-safe-area-context': '4.8.0',
    'react-native-screens': '3.29.0',
    '@react-native-community/masked-view': '0.1.11',
    'react-native-vector-icons': '10.0.0'
  }
};

// Tracking of changes for reporting
const fixesApplied = {
  babelPlugins: 0,
  securityUpdates: 0,
  deprecatedPackages: 0,
  resolutionsAdded: 0,
  overridesAdded: 0,
  rnEcosystem: 0,
  total: 0,
  packageJsonsUpdated: []
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

// Create a backup of a file
function backupFile(filePath) {
  if (args.backup) {
    const backupPath = `${filePath}.bak`;
    fs.copyFileSync(filePath, backupPath);
    log.debug(`Created backup: ${backupPath}`);
  }
}

// Update a package.json file
function updatePackageJson(filePath, updater) {
  try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    const packageJson = JSON.parse(content);
    
    // Create backup
    if (args.backup) {
      backupFile(filePath);
    }
    
    // Apply the updater function
    const updated = updater(packageJson, filePath);
    
    if (updated) {
      if (!args.dryRun) {
        // Write with consistent formatting and indentation
        fs.writeFileSync(
          filePath, 
          JSON.stringify(packageJson, null, 2) + '\n'
        );
      }
      
      fixesApplied.packageJsonsUpdated.push(
        path.relative(process.cwd(), filePath).replace(/\\/g, '/')
      );
      fixesApplied.total++;
      return true;
    }
    
    return false;
  } catch (error) {
    log.error(`Error updating ${filePath}: ${error.message}`);
    return false;
  }
}

// Update Babel plugins from proposal to transform
function updateBabelPlugins(packageJson, filePath, pluginReplacements) {
  const depsLocations = ['dependencies', 'devDependencies'];
  let updated = false;
  
  // Loop through the dependency sections
  for (const depsLocation of depsLocations) {
    if (!packageJson[depsLocation]) continue;
    
    // Look for any Babel proposal plugins
    for (const [oldPlugin, newPlugin] of Object.entries(pluginReplacements)) {
      if (packageJson[depsLocation][oldPlugin]) {
        const oldVersion = packageJson[depsLocation][oldPlugin];
        
        // Add the new transform plugin
        log.debug(`${filePath}: Replacing ${oldPlugin} with ${newPlugin}`);
        packageJson[depsLocation][newPlugin] = oldVersion.startsWith('^') ? 
          '^7.23.0' : '7.23.0';
          
        // Remove the old proposal plugin
        delete packageJson[depsLocation][oldPlugin];
        
        fixesApplied.babelPlugins++;
        updated = true;
      }
    }
  }
  
  // Also update babel configs if present
  if (packageJson.babel && packageJson.babel.plugins) {
    packageJson.babel.plugins = packageJson.babel.plugins.map(plugin => {
      if (typeof plugin === 'string') {
        return pluginReplacements[plugin] || plugin;
      } else if (Array.isArray(plugin) && typeof plugin[0] === 'string') {
        const newPluginName = pluginReplacements[plugin[0]];
        if (newPluginName) {
          return [newPluginName, ...(plugin.slice(1))];
        }
      }
      return plugin;
    });
    updated = true;
  }
  
  return updated;
}

// Apply security fixes
function applySecurityFixes(packageJson, filePath, securityFixes) {
  const depsLocations = ['dependencies', 'devDependencies'];
  let updated = false;
  
  // Loop through the dependency sections
  for (const depsLocation of depsLocations) {
    if (!packageJson[depsLocation]) continue;
    
    for (const [pkg, safeVersion] of Object.entries(securityFixes)) {
      if (packageJson[depsLocation][pkg]) {
        const currentVersion = packageJson[depsLocation][pkg];
        
        // Only update if current version is potentially vulnerable
        // (This is a simplified check - in a real scenario, you'd use semver to compare)
        if (currentVersion !== safeVersion && !currentVersion.includes(safeVersion)) {
          log.debug(`${filePath}: Updating ${pkg} from ${currentVersion} to ${safeVersion}`);
          packageJson[depsLocation][pkg] = safeVersion;
          
          fixesApplied.securityUpdates++;
          updated = true;
        }
      }
    }
  }
  
  return updated;
}

// Standardize React Native ecosystem versions
function standardizeRNVersions(packageJson, filePath, rnEcosystemVersions) {
  const depsLocations = ['dependencies', 'devDependencies', 'peerDependencies'];
  let updated = false;
  
  for (const depsLocation of depsLocations) {
    if (!packageJson[depsLocation]) continue;
    
    // Check if package uses React Native
    if (packageJson[depsLocation]['react-native']) {
      for (const [pkg, targetVersion] of Object.entries(rnEcosystemVersions)) {
        if (packageJson[depsLocation][pkg] && packageJson[depsLocation][pkg] !== targetVersion) {
          log.debug(`${filePath}: Standardizing ${pkg} to ${targetVersion}`);
          packageJson[depsLocation][pkg] = targetVersion;
          
          fixesApplied.rnEcosystem++;
          updated = true;
        }
      }
    }
  }
  
  return updated;
}

// Add overrides/resolutions to enforce dependency versions
function addResolutionsOrOverrides(packageJson, filePath, versionsToEnforce) {
  let updated = false;
  
  // Determine if we're using npm or yarn
  const usesYarn = fs.existsSync(path.join(path.dirname(filePath), 'yarn.lock'));
  
  // For yarn
  if (usesYarn) {
    if (!packageJson.resolutions) {
      packageJson.resolutions = {};
    }
    
    for (const [pkg, version] of Object.entries(versionsToEnforce)) {
      if (!packageJson.resolutions[pkg]) {
        packageJson.resolutions[pkg] = version;
        fixesApplied.resolutionsAdded++;
        updated = true;
      }
    }
  } 
  // For npm
  else {
    if (!packageJson.overrides) {
      packageJson.overrides = {};
    }
    
    for (const [pkg, version] of Object.entries(versionsToEnforce)) {
      if (!packageJson.overrides[pkg]) {
        packageJson.overrides[pkg] = version;
        fixesApplied.overridesAdded++;
        updated = true;
      }
    }
  }
  
  return updated;
}

// Main function
async function fixDependencies() {
  const rootDir = process.cwd();
  let configData = {
    babelPluginReplacements: BABEL_PLUGIN_REPLACEMENTS,
    securityFixes: SECURITY_FIXES,
    rnEcosystem: args.rnVersion ? RN_ECOSYSTEM[args.rnVersion] : null,
  };
  
  log.header(`${args.dryRun ? '[DRY RUN] ' : ''}Fixing dependencies in ${rootDir}...`);
  
  // If there's a report file from check-rn-dependencies.js, use its data
  if (args.reportFile) {
    try {
      const reportData = JSON.parse(fs.readFileSync(args.reportFile, 'utf8'));
      log.info(`Using dependency issues report from: ${args.reportFile}`);
      
      // Extract fixableIssues from the report
      if (reportData.fixableIssues) {
        if (reportData.fixableIssues.babelPlugins) {
          configData.babelPluginReplacements = reportData.fixableIssues.babelPlugins;
        }
        
        if (reportData.fixableIssues.securityIssues) {
          // Combine with our known security fixes
          const securityIssues = Object.keys(reportData.fixableIssues.securityIssues);
          configData.securityFixes = Object.fromEntries(
            Object.entries(SECURITY_FIXES)
              .filter(([key]) => securityIssues.includes(key))
          );
        }
        
        if (reportData.fixableIssues.versionConflicts) {
          configData.versionConflicts = reportData.fixableIssues.versionConflicts;
        }
        
        // If RN version wasn't specified via CLI but exists in the report
        if (!args.rnVersion && reportData.targetVersionCompatibility) {
          const targetRNVersion = reportData.targetVersionCompatibility.version;
          if (RN_ECOSYSTEM[targetRNVersion]) {
            configData.rnEcosystem = RN_ECOSYSTEM[targetRNVersion];
            log.info(`Using target React Native version ${targetRNVersion} from report`);
          }
        }
      }
    } catch (error) {
      log.error(`Error loading report file: ${error.message}`);
      log.info('Continuing with default configurations...');
    }
  }
  
  // If no RN ecosystem data yet, use default for most recent version
  if (!configData.rnEcosystem) {
    const versions = Object.keys(RN_ECOSYSTEM);
    const latestVersion = versions[versions.length - 1];
    configData.rnEcosystem = RN_ECOSYSTEM[latestVersion];
    log.info(`No target React Native version specified, using default: ${latestVersion}`);
  }
  
  // Find all package.json files
  const packageFiles = findPackageJsonFiles(rootDir);
  log.info(`Found ${packageFiles.length} package.json files to examine.`);
  
  // Apply fixes to each package.json
  let fixedCount = 0;
  
  for (const packageFile of packageFiles) {
    let updated = false;
    
    updated |= updatePackageJson(packageFile, (packageJson, filePath) => {
      let changes = false;
      
      // Apply Babel plugin replacements
      changes |= updateBabelPlugins(packageJson, filePath, configData.babelPluginReplacements);
      
      // Apply security fixes
      changes |= applySecurityFixes(packageJson, filePath, configData.securityFixes);
      
      // Standardize RN ecosystem versions
      if (configData.rnEcosystem) {
        changes |= standardizeRNVersions(packageJson, filePath, configData.rnEcosystem);
      }
      
      // Add resolutions/overrides for specific packages
      const enforcedVersions = {
        ...configData.securityFixes,
        ...(configData.versionConflicts || {})
      };
      changes |= addResolutionsOrOverrides(packageJson, filePath, enforcedVersions);
      
      return changes;
    });
    
    if (updated) {
      fixedCount++;
    }
  }
  
  // Output results
  log.header('=== Dependency Fix Summary ===');
  log.info(`Total package.json files updated: ${fixedCount}/${packageFiles.length}`);
  log.info(`Babel plugins replaced: ${fixesApplied.babelPlugins}`);
  log.info(`Security vulnerabilities fixed: ${fixesApplied.securityUpdates}`);
  log.info(`React Native ecosystem updates: ${fixesApplied.rnEcosystem}`);
  log.info(`Resolutions added: ${fixesApplied.resolutionsAdded}`);
  log.info(`Overrides added: ${fixesApplied.overridesAdded}`);
  
  if (args.dryRun) {
    log.warning('This was a dry run. No files were actually modified.');
    log.info('Run without --dry-run to apply the changes.');
  } else if (fixedCount > 0) {
    log.success(`Successfully updated ${fixedCount} package.json files.`);
    log.info('Modified files:');
    fixesApplied.packageJsonsUpdated.forEach(file => {
      console.log(`  - ${file}`);
    });
    log.info('\nIt is recommended to run the following commands now:');
    console.log('  1. npm install  # or yarn install');
    console.log('  2. npm test     # to verify nothing broke');
  } else {
    log.success('No dependency issues found that needed fixing.');
  }
  
  return fixesApplied;
}

// Run the script
fixDependencies().catch(error => {
  log.error('Error fixing dependencies:', error);
  process.exit(1);
});
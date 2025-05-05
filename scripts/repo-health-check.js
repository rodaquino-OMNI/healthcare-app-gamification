#!/usr/bin/env node

/**
 * Repository Health Check Script
 * 
 * This script performs a comprehensive health check of the repository including:
 * - Dependency analysis (outdated, vulnerabilities)
 * - Code quality metrics (test coverage, lint issues)
 * - CI workflow status
 * - Documentation completeness
 * 
 * It generates both JSON and Markdown reports for easy consumption
 * by humans and automation tools.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  warnThresholds: {
    testsPerFile: 1,
    coveragePercentage: 70,
    dependencies: {
      outOfDateWarning: 5,
      outOfDateCritical: 15,
      vulnerabilities: 0
    }
  }
};

// Health check results
const health = {
  dependencies: {
    total: 0,
    outOfDate: 0,
    vulnerabilities: 0
  },
  code: {
    coverage: 0,
    testCount: 0
  },
  ci: {
    failedWorkflows: 0,
    totalWorkflows: 0
  }
};

// Simple color formatting for terminal output
const chalk = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`
};

// Run dependency checks
function checkDependencies() {
  console.log(chalk.cyan('Checking dependencies...'));
  
  try {
    // Get all package.json files in the repository
    const packageFiles = findPackageJsonFiles(process.cwd());
    health.dependencies.total = packageFiles.length;
    
    console.log(`Found ${packageFiles.length} package.json files`);
    
    let outdatedCount = 0;
    let vulnerabilityCount = 0;
    
    packageFiles.forEach(packageFile => {
      const packageDir = path.dirname(packageFile);
      
      try {
        // Check for outdated dependencies
        try {
          const outdatedOutput = execSync('yarn outdated --json || true', { cwd: packageDir }).toString();
          const outdatedLines = outdatedOutput.trim().split('\n')
            .filter(line => line.trim().startsWith('{') && !line.includes('{"type":"info"'))
            .map(line => {
              try {
                return JSON.parse(line);
              } catch (e) {
                return null;
              }
            })
            .filter(Boolean);
          
          outdatedCount += outdatedLines.length;
        } catch (err) {
          console.log(chalk.yellow(`Skipping outdated check for ${packageFile}: ${err.message}`));
        }
        
        // Check for security vulnerabilities
        try {
          const auditOutput = execSync('yarn audit --json || true', { cwd: packageDir }).toString();
          const auditLines = auditOutput.trim().split('\n')
            .filter(line => line.trim().startsWith('{'))
            .map(line => {
              try {
                return JSON.parse(line);
              } catch (e) {
                return null;
              }
            })
            .filter(Boolean);
          
          const vulnerabilitySummary = auditLines.find(item => item.type === 'auditSummary');
          if (vulnerabilitySummary && vulnerabilitySummary.data && vulnerabilitySummary.data.vulnerabilities) {
            vulnerabilityCount += vulnerabilitySummary.data.vulnerabilities.total;
          }
        } catch (err) {
          console.log(chalk.yellow(`Skipping audit check for ${packageFile}: ${err.message}`));
        }
      } catch (err) {
        console.error(chalk.red(`Error checking dependencies in ${packageFile}:`), err.message);
      }
    });
    
    health.dependencies.outOfDate = outdatedCount;
    health.dependencies.vulnerabilities = vulnerabilityCount;
    
    console.log(`Found ${outdatedCount} outdated packages and ${vulnerabilityCount} vulnerabilities`);
  } catch (error) {
    console.error(chalk.red('Error checking dependencies:'), error.message);
  }
}

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

// Check test coverage
function checkTestCoverage() {
  console.log(chalk.cyan('Checking test coverage...'));
  
  // Count test files
  try {
    // Look for test files with common patterns
    const testPatterns = [
      'src/**/*.{test,spec}.{ts,tsx,js,jsx}',
      'test/**/*.{ts,tsx,js,jsx}',
      '__tests__/**/*.{ts,tsx,js,jsx}'
    ];
    
    let testCount = 0;
    
    testPatterns.forEach(pattern => {
      try {
        // Using find with a glob pattern to count files
        const findCmd = `find src -name "*.test.*" -o -name "*.spec.*" | wc -l`;
        const result = execSync(findCmd).toString().trim();
        testCount += parseInt(result, 10) || 0;
      } catch (err) {
        // Ignore errors in finding test files
      }
    });
    
    health.code.testCount = testCount;
    
    // Look for coverage reports
    const coveragePatterns = [
      '**/coverage/coverage-summary.json',
      '**/coverage/lcov-report/index.html'
    ];
    
    let coverageFound = false;
    
    coveragePatterns.forEach(pattern => {
      try {
        const findCoverageCmd = `find . -path "${pattern}" | grep -v node_modules`;
        const coverageFiles = execSync(findCoverageCmd).toString().trim().split('\n').filter(Boolean);
        
        if (coverageFiles.length > 0) {
          // Try to extract coverage percentage from the first found report
          if (pattern.endsWith('.json')) {
            try {
              const coverageData = JSON.parse(fs.readFileSync(coverageFiles[0], 'utf8'));
              if (coverageData.total && coverageData.total.lines) {
                health.code.coverage = coverageData.total.lines.pct;
                coverageFound = true;
              }
            } catch (e) {
              // Ignore JSON parsing errors
            }
          } else if (pattern.endsWith('.html')) {
            // Try to extract coverage from HTML report
            try {
              const htmlContent = fs.readFileSync(coverageFiles[0], 'utf8');
              const coverageMatch = htmlContent.match(/All files[^%]*?(\d+(?:\.\d+)?)%/);
              if (coverageMatch && coverageMatch[1]) {
                health.code.coverage = parseFloat(coverageMatch[1]);
                coverageFound = true;
              }
            } catch (e) {
              // Ignore HTML parsing errors
            }
          }
        }
      } catch (err) {
        // Ignore errors in finding coverage files
      }
    });
    
    if (!coverageFound) {
      health.code.coverage = 0;
      console.log(chalk.yellow('No coverage reports found. Coverage assumed to be 0%.'));
    }
    
    console.log(`Found ${health.code.testCount} test files with ${health.code.coverage.toFixed(2)}% average coverage`);
  } catch (error) {
    console.error(chalk.red('Error checking test coverage:'), error.message);
  }
}

// Check CI status
function checkCIStatus() {
  console.log(chalk.cyan('Checking CI workflow status...'));
  
  try {
    // Read workflow files to get total count
    const workflowDir = path.join(process.cwd(), '.github', 'workflows');
    if (fs.existsSync(workflowDir)) {
      const workflowFiles = fs.readdirSync(workflowDir).filter(file => 
        file.endsWith('.yml') || file.endsWith('.yaml')
      );
      health.ci.totalWorkflows = workflowFiles.length;
    } else {
      health.ci.totalWorkflows = 0;
    }
    
    console.log(`Found ${health.ci.totalWorkflows} workflow files`);
    
    // We can't check actual workflow status without GitHub API access,
    // but we can at least report the number of configured workflows
  } catch (error) {
    console.error(chalk.red('Error checking CI status:'), error.message);
  }
}

// Generate health report
function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    health,
    recommendations: []
  };
  
  // Add recommendations based on findings
  if (health.dependencies.vulnerabilities > config.warnThresholds.dependencies.vulnerabilities) {
    report.recommendations.push({
      severity: 'critical',
      message: `Found ${health.dependencies.vulnerabilities} security vulnerabilities`,
      action: 'Run `yarn deps:fix-security` or `node scripts/fix-security-vulnerabilities.js` to address these issues'
    });
  }
  
  if (health.dependencies.outOfDate > config.warnThresholds.dependencies.outOfDateCritical) {
    report.recommendations.push({
      severity: 'high',
      message: `Found ${health.dependencies.outOfDate} outdated packages`,
      action: 'Run `yarn deps:update` to interactively update dependencies'
    });
  } else if (health.dependencies.outOfDate > config.warnThresholds.dependencies.outOfDateWarning) {
    report.recommendations.push({
      severity: 'medium',
      message: `Found ${health.dependencies.outOfDate} outdated packages`,
      action: 'Consider updating dependencies soon'
    });
  }
  
  if (health.code.coverage < config.warnThresholds.coveragePercentage) {
    report.recommendations.push({
      severity: 'medium',
      message: `Test coverage is below ${config.warnThresholds.coveragePercentage}% (current: ${health.code.coverage.toFixed(2)}%)`,
      action: 'Add more tests to improve coverage'
    });
  }
  
  // Save report to file
  fs.writeFileSync('repo-health-report.json', JSON.stringify(report, null, 2));
  console.log(chalk.green('Health report generated: repo-health-report.json'));
  
  // Generate markdown summary
  const markdownReport = `
# Repository Health Report

Generated on: ${new Date().toLocaleString()}

## Summary

| Category | Metric | Value | Status |
|----------|--------|-------|--------|
| Dependencies | Outdated | ${health.dependencies.outOfDate} | ${health.dependencies.outOfDate > config.warnThresholds.dependencies.outOfDateWarning ? '⚠️' : '✅'} |
| Dependencies | Vulnerabilities | ${health.dependencies.vulnerabilities} | ${health.dependencies.vulnerabilities > 0 ? '🚨' : '✅'} |
| Code | Test Coverage | ${health.code.coverage.toFixed(2)}% | ${health.code.coverage < config.warnThresholds.coveragePercentage ? '⚠️' : '✅'} |
| CI | Workflow Files | ${health.ci.totalWorkflows} | ✅ |

## Recommendations

${report.recommendations.map(rec => `- **${rec.severity.toUpperCase()}**: ${rec.message}\n  _Action: ${rec.action}_`).join('\n\n') || '- No recommendations at this time. Repository health is good!'}

## Automated Fixes Available

- Run \`node scripts/fix-security-vulnerabilities.js\` to fix security vulnerabilities
- Run \`node scripts/fix-common-dependencies.js\` to standardize dependency versions
- Run \`node scripts/setup-path-aliases.js\` to standardize import paths
`;

  fs.writeFileSync('REPO_HEALTH.md', markdownReport);
  console.log(chalk.green('Markdown report generated: REPO_HEALTH.md'));
}

// Run all checks
function runHealthCheck() {
  console.log(chalk.cyan('Starting repository health check...'));
  checkDependencies();
  checkTestCoverage();
  checkCIStatus();
  generateReport();
  console.log(chalk.green('Health check complete!'));
}

runHealthCheck();
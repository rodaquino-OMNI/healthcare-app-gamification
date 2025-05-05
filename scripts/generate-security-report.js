/**
 * Security Report Generator
 * 
 * Generates a comprehensive report of security vulnerabilities
 * in dependencies across the monorepo.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

// Run security audit and capture output
function runSecurityAudit() {
  try {
    console.log('Running security audit...');
    const auditOutput = execSync('yarn audit --json', { encoding: 'utf8' });
    
    // Parse the JSON output from yarn audit
    const auditLines = auditOutput.trim().split('\n');
    const auditData = auditLines.filter(Boolean).map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
    
    return auditData;
  } catch (error) {
    // yarn audit exits with non-zero code when vulnerabilities are found
    if (error.stdout) {
      const auditLines = error.stdout.toString().trim().split('\n');
      const auditData = auditLines.filter(Boolean).map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      }).filter(Boolean);
      
      return auditData;
    }
    
    console.error('Error running security audit:', error.message);
    return [];
  }
}

// Generate HTML report
function generateReport(auditData) {
  if (!auditData || auditData.length === 0) {
    return `<html><body><h1>Security Audit</h1><p>No vulnerabilities found or error running audit.</p></body></html>`;
  }
  
  // Filter for summary and vulnerability data
  const summaryData = auditData.find(item => item.type === 'auditSummary');
  const vulnerabilities = auditData.filter(item => item.type === 'auditAdvisory');
  
  // Start building HTML report
  let html = `
<!DOCTYPE html>
<html>
<head>
  <title>AUSTA SuperApp Security Report</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
    h1 { color: #0066cc; }
    h2 { color: #0099cc; margin-top: 30px; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .high { background-color: #ffdddd; }
    .critical { background-color: #ffcccc; font-weight: bold; }
    .moderate { background-color: #ffffcc; }
    .low { background-color: #e6fffa; }
    .summary { margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
  </style>
</head>
<body>
  <h1>AUSTA SuperApp Security Report</h1>
  <p>Generated on: ${new Date().toLocaleString()}</p>`;
  
  // Add summary section if available
  if (summaryData) {
    html += `
  <div class="summary">
    <h2>Summary</h2>
    <p>Vulnerabilities found: ${summaryData.data.vulnerabilities.total}</p>
    <p>Critical: ${summaryData.data.vulnerabilities.critical}</p>
    <p>High: ${summaryData.data.vulnerabilities.high}</p>
    <p>Moderate: ${summaryData.data.vulnerabilities.moderate}</p>
    <p>Low: ${summaryData.data.vulnerabilities.low}</p>
  </div>`;
  }
  
  // Add vulnerabilities table
  if (vulnerabilities && vulnerabilities.length > 0) {
    html += `
  <h2>Vulnerabilities</h2>
  <table>
    <tr>
      <th>Package</th>
      <th>Severity</th>
      <th>Vulnerable Versions</th>
      <th>Patched Version</th>
      <th>Dependency Of</th>
      <th>Description</th>
    </tr>`;
    
    vulnerabilities.forEach(vuln => {
      const severity = vuln.data.advisory.severity;
      const rowClass = severity === 'critical' ? 'critical' : 
                     severity === 'high' ? 'high' :
                     severity === 'moderate' ? 'moderate' : 'low';
      
      html += `
    <tr class="${rowClass}">
      <td>${vuln.data.advisory.module_name}</td>
      <td>${severity}</td>
      <td>${vuln.data.advisory.vulnerable_versions}</td>
      <td>${vuln.data.advisory.patched_versions}</td>
      <td>${vuln.data.findings.map(f => f.paths[0]).join('<br>')}</td>
      <td>${vuln.data.advisory.title}</td>
    </tr>`;
    });
    
    html += `
  </table>`;
  }
  
  // Add remediation recommendations
  html += `
  <h2>Remediation Recommendations</h2>
  <p>To address these vulnerabilities, consider taking the following actions:</p>
  <ol>
    <li>Update vulnerable packages to their patched versions using <code>yarn upgrade</code></li>
    <li>Add the following resolutions to your root package.json:
      <pre>${generateResolutionsCode(vulnerabilities)}</pre>
    </li>
    <li>Run <code>yarn install</code> to apply the resolutions</li>
    <li>Consider alternatives for packages with no available patches</li>
  </ol>
  
</body>
</html>`;
  
  return html;
}

// Generate suggested resolutions code
function generateResolutionsCode(vulnerabilities) {
  if (!vulnerabilities || vulnerabilities.length === 0) {
    return '{}';
  }
  
  const resolutions = {};
  
  vulnerabilities.forEach(vuln => {
    if (vuln.data.advisory.patched_versions !== '<0.0.0') {
      // Extract a valid version from patched_versions
      let patchedVersion = vuln.data.advisory.patched_versions;
      
      // Simple parsing of version ranges to get a concrete version
      if (patchedVersion.startsWith('>=')) {
        patchedVersion = patchedVersion.substring(2);
      }
      
      // Remove any complex version range specifiers
      patchedVersion = patchedVersion.split(' ')[0];
      
      // Remove any trailing non-numeric characters
      patchedVersion = patchedVersion.replace(/[^0-9.]/g, '');
      
      if (patchedVersion) {
        resolutions[vuln.data.advisory.module_name] = patchedVersion;
      }
    }
  });
  
  return JSON.stringify(resolutions, null, 2);
}

// Main function
function main() {
  const auditData = runSecurityAudit();
  const report = generateReport(auditData);
  
  // Save report to file
  const reportPath = path.join(rootDir, 'security-report.html');
  fs.writeFileSync(reportPath, report);
  
  console.log(`✅ Security report generated: ${reportPath}`);
  
  // Also save raw JSON data
  const jsonPath = path.join(rootDir, 'security-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(auditData, null, 2));
  
  console.log(`✅ Security data saved: ${jsonPath}`);
}

main();
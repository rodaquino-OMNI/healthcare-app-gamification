const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find TypeScript files
const findFiles = (dir, pattern) => {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
      results = results.concat(findFiles(filePath, pattern));
    } else if (pattern.test(file)) {
      results.push(filePath);
    }
  }
  
  return results;
};

// Path mapping definitions
const pathMappings = [
  { from: /src\/backend\/shared\/src\//g, to: '@shared/' },
  { from: /src\/backend\/gamification-engine\/src\//g, to: '@gamification/' },
  { from: /src\/backend\/shared\/prisma\//g, to: '@prisma/' }
];

// Process a file
const processFile = (filePath) => {
  console.log(`Processing ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  let changed = false;
  
  // Process each import statement
  const importRegex = /import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const fullImport = match[0];
    const importPath = match[1];
    
    // Apply each path mapping
    for (const mapping of pathMappings) {
      if (mapping.from.test(importPath)) {
        const newImportPath = importPath.replace(mapping.from, mapping.to);
        const newFullImport = fullImport.replace(importPath, newImportPath);
        
        // Replace in the content
        newContent = newContent.replace(fullImport, newFullImport);
        changed = true;
        console.log(`  ${importPath} -> ${newImportPath}`);
        
        // Reset the regex lastIndex to ensure we don't miss imports
        importRegex.lastIndex = 0;
        break;
      }
    }
  }
  
  // Save changes if needed
  if (changed) {
    fs.writeFileSync(filePath, newContent);
    return true;
  }
  
  return false;
};

// Main function
const main = () => {
  // Get target directory from command line or use default
  const targetDir = process.argv[2] || path.join(__dirname, 'src/backend');
  
  console.log(`🔍 Scanning directory: ${targetDir}`);
  const tsFiles = findFiles(targetDir, /\.tsx?$/);
  console.log(`Found ${tsFiles.length} TypeScript files`);
  
  // Process files
  let changedCount = 0;
  
  for (const file of tsFiles) {
    if (processFile(file)) {
      changedCount++;
    }
  }
  
  console.log(`\n✅ Updated imports in ${changedCount} files out of ${tsFiles.length}`);
  
  // Restart TypeScript server
  console.log('\n🔄 Restarting TypeScript server...');
  console.log('To restart TypeScript server manually in VS Code:');
  console.log('1. Press Cmd+Shift+P');
  console.log('2. Type "TypeScript: Restart TS Server" and press Enter');
};

// Run the script
main();
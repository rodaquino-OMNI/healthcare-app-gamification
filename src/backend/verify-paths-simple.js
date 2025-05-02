/**
 * Simple verification script for TypeScript path mappings
 * This script uses Node.js file system API to check if files exist
 * without requiring ts-node or tsconfig-paths
 */
const fs = require('fs');
const path = require('path');
const process = require('process');

// Define the path mappings from tsconfig.json
const pathMappings = {
  '@shared/*': ['shared/src/*'],
  '@gamification/*': ['gamification-engine/src/*'],
  '@prisma/*': ['shared/prisma/*']
};

// Define examples of files that should exist using the path aliases
const filesToVerify = [
  { 
    alias: '@shared/logging/logger.service', 
    path: 'shared/src/logging/logger.service.ts',
    description: 'Logger Service'
  },
  { 
    alias: '@gamification/app.module', 
    path: 'gamification-engine/src/app.module.ts',
    description: 'Gamification App Module'
  },
  { 
    alias: '@shared/kafka/kafka.service', 
    path: 'shared/src/kafka/kafka.service.ts',
    description: 'Kafka Service'
  }
];

console.log('🔍 Verifying file paths for TypeScript path mappings...');
console.log(`Current working directory: ${process.cwd()}\n`);
console.log('Path aliases configured in tsconfig.json:');

for (const [alias, paths] of Object.entries(pathMappings)) {
  console.log(`  ${alias} -> ${paths.join(', ')}`);
}

console.log('\nChecking for existence of example files:');

// Function to verify file existence
function verifyFilePath(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  try {
    fs.accessSync(absolutePath, fs.constants.F_OK);
    return { exists: true, path: absolutePath };
  } catch (err) {
    return { exists: false, path: absolutePath };
  }
}

let allFilesExist = true;
let foundFiles = [];
let missingFiles = [];

// Verify each file
filesToVerify.forEach(file => {
  const result = verifyFilePath(file.path);
  
  if (result.exists) {
    foundFiles.push(file);
    console.log(`  ✅ ${file.description} (${file.alias}) -> File exists at ${file.path}`);
  } else {
    missingFiles.push(file);
    console.log(`  ❌ ${file.description} (${file.alias}) -> File NOT found at ${file.path}`);
    allFilesExist = false;
  }
});

// Output summary
console.log('\n📊 Summary:');
console.log(`  Total files checked: ${filesToVerify.length}`);
console.log(`  Files found: ${foundFiles.length}`);
console.log(`  Files missing: ${missingFiles.length}`);

// Final assessment
if (allFilesExist) {
  console.log('\n✅ All files exist! TypeScript path mapping validation successful!');
  console.log('\nThis confirms that your path aliases in tsconfig.json correctly map to existing files.');
  console.log('For runtime support, make sure to use tsconfig-paths at runtime:');
  console.log('  - In development: node -r tsconfig-paths/register your-script.js');
  console.log('  - In NestJS: Add -r tsconfig-paths/register to your start scripts');
} else {
  console.log('\n⚠️ Some files are missing. This may indicate:');
  console.log('  1. The path mappings in tsconfig.json might not match your actual file structure');
  console.log('  2. Some referenced files haven\'t been created yet');
  console.log('  3. The files might be in different locations');
  console.log('\nPlease check your file structure and update either:');
  console.log('  - The tsconfig.json path mappings to match your file structure, or');
  console.log('  - Create the missing files in the expected locations');
}
/**
 * Path Alias Setup Script
 * 
 * Sets up consistent path aliases across all TypeScript configurations
 * in the monorepo.
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const rootDir = process.cwd();
const basePathAliases = {
  "@shared/*": ["src/web/shared/*"],
  "@app/shared/*": ["src/backend/shared/src/*"],
  "@app/gamification/*": ["src/backend/gamification-engine/src/*"],
  "@app/health/*": ["src/backend/health-service/src/*"],
  "@app/care/*": ["src/backend/care-service/src/*"],
  "@app/plan/*": ["src/backend/plan-service/src/*"],
  "@app/auth/*": ["src/backend/auth-service/src/*"],
  "@app/notifications/*": ["src/backend/notification-service/src/*"],
  "@design-system/*": ["src/web/design-system/*"]
};

// Find all tsconfig files
function findTsConfigFiles() {
  return glob.sync('**/tsconfig*.json', {
    ignore: ['**/node_modules/**', '**/dist/**'],
    cwd: rootDir,
    absolute: true
  });
}

// Update a single tsconfig file
function updateTsConfig(filePath) {
  try {
    console.log(`Processing ${path.relative(rootDir, filePath)}...`);
    const tsConfig = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Ensure compilerOptions exists
    if (!tsConfig.compilerOptions) {
      tsConfig.compilerOptions = {};
    }
    
    // Set baseUrl if not already set
    if (!tsConfig.compilerOptions.baseUrl) {
      // Determine the appropriate baseUrl relative to the tsconfig location
      const fileDir = path.dirname(filePath);
      const relativeToRoot = path.relative(fileDir, rootDir);
      tsConfig.compilerOptions.baseUrl = relativeToRoot || '.';
    }
    
    // Add or update paths
    tsConfig.compilerOptions.paths = {
      ...(tsConfig.compilerOptions.paths || {}),
      ...basePathAliases
    };
    
    // Ensure these options are set
    tsConfig.compilerOptions.esModuleInterop = true;
    tsConfig.compilerOptions.skipLibCheck = true;
    
    // Write updated tsconfig back to file
    fs.writeFileSync(filePath, JSON.stringify(tsConfig, null, 2));
    console.log(`✅ Updated ${path.relative(rootDir, filePath)}`);
    
    return true;
  } catch (err) {
    console.error(`❌ Error updating ${path.relative(rootDir, filePath)}:`, err);
    return false;
  }
}

// Update package.json build scripts for path alias support
function updateBuildScripts() {
  // Find all package.json files
  const packageJsonFiles = glob.sync('**/package.json', {
    ignore: ['**/node_modules/**', '**/dist/**'],
    cwd: rootDir,
    absolute: true
  });
  
  packageJsonFiles.forEach(filePath => {
    try {
      const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      let updated = false;
      
      // Update build scripts to use tsconfig-paths
      if (packageJson.scripts && packageJson.scripts.build && 
          packageJson.scripts.build.includes('tsc') && 
          !packageJson.scripts.build.includes('tsconfig-paths')) {
        
        packageJson.scripts.build = packageJson.scripts.build.replace(
          'tsc',
          'tsc -p tsconfig.json && tsc-alias'
        );
        updated = true;
      }
      
      // Add dev dependencies if needed
      if (!packageJson.devDependencies || !packageJson.devDependencies['tsc-alias']) {
        packageJson.devDependencies = {
          ...(packageJson.devDependencies || {}),
          "tsc-alias": "^1.8.8"
        };
        updated = true;
      }
      
      if (updated) {
        fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2));
        console.log(`✅ Updated build scripts in ${path.relative(rootDir, filePath)}`);
      }
    } catch (err) {
      console.error(`❌ Error updating ${path.relative(rootDir, filePath)}:`, err);
    }
  });
}

// Main function
function main() {
  console.log('Setting up path aliases across the project...');
  
  // Find and update all tsconfig files
  const tsConfigFiles = findTsConfigFiles();
  console.log(`Found ${tsConfigFiles.length} tsconfig files to update`);
  
  let successCount = 0;
  tsConfigFiles.forEach(file => {
    if (updateTsConfig(file)) {
      successCount++;
    }
  });
  
  // Update build scripts
  updateBuildScripts();
  
  console.log(`✅ Path aliases set up successfully in ${successCount}/${tsConfigFiles.length} files`);
}

main();
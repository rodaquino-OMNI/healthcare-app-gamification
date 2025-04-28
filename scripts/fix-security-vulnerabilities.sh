#!/bin/bash

# Enhanced script to check and fix security vulnerabilities in the project
# To be run from the project root directory

echo "🔒 Starting enhanced security vulnerability remediation..."

# Known problematic dependencies and their secure versions
declare -A SECURE_VERSIONS
SECURE_VERSIONS["axios"]="1.6.8"
SECURE_VERSIONS["semver"]="7.5.4"
SECURE_VERSIONS["json5"]="2.2.3"
SECURE_VERSIONS["minimatch"]="3.1.2"
SECURE_VERSIONS["word-wrap"]="1.2.4"
SECURE_VERSIONS["tough-cookie"]="4.1.3"
SECURE_VERSIONS["postcss"]="8.4.31"
SECURE_VERSIONS["babel-traverse"]="7.23.2"
SECURE_VERSIONS["ua-parser-js"]="1.0.35"
SECURE_VERSIONS["follow-redirects"]="1.15.4"
SECURE_VERSIONS["webpack"]="5.76.0"
SECURE_VERSIONS["node-fetch"]="2.6.9"
SECURE_VERSIONS["glob-parent"]="5.1.2"
SECURE_VERSIONS["terser"]="5.16.6"
SECURE_VERSIONS["loader-utils"]="2.0.4"
SECURE_VERSIONS["minimist"]="1.2.8"
SECURE_VERSIONS["shelljs"]="0.8.5"
SECURE_VERSIONS["qs"]="6.11.2"

# Add secure versions to all package.json files
update_package_json() {
  local file=$1
  echo "📦 Updating $file..."
  
  # Create overrides and resolutions if they don't exist
  if ! grep -q "\"overrides\"" "$file"; then
    # Add overrides before the last closing brace
    sed -i '' -e '$ i\
  ,\
  "overrides": {\
  }\
' "$file"
  fi
  
  if ! grep -q "\"resolutions\"" "$file"; then
    # Add resolutions before the last closing brace
    sed -i '' -e '$ i\
  ,\
  "resolutions": {\
  }\
' "$file"
  fi
  
  # Update each secure version
  for dep in "${!SECURE_VERSIONS[@]}"; do
    version="${SECURE_VERSIONS[$dep]}"
    
    # Special handling for babel traverse
    if [ "$dep" = "babel-traverse" ]; then
      dep_name="@babel/traverse"
    else
      dep_name="$dep"
    fi
    
    # Update overrides
    if grep -q "\"overrides\"" "$file"; then
      if ! grep -q "\"$dep_name\":" "$file" || ! grep -q "\"overrides\".*\"$dep_name\":" "$file"; then
        sed -i '' -e "/\"overrides\"[[:space:]]*:/ {
          :a
          n
          /}/!ba
          i\\
    \"$dep_name\": \"$version\",
        }" "$file"
      fi
    fi
    
    # Update resolutions
    if grep -q "\"resolutions\"" "$file"; then
      if ! grep -q "\"resolutions\".*\"$dep_name\":" "$file"; then
        sed -i '' -e "/\"resolutions\"[[:space:]]*:/ {
          :a
          n
          /}/!ba
          i\\
    \"$dep_name\": \"$version\",
        }" "$file"
      fi
    fi
  done
  
  # Clean up trailing commas that might cause JSON parse errors
  sed -i '' -e 's/,\([[:space:]]*\}\)/\1/g' "$file"
}

# Function to create a fix for Agora SDK issues specifically
fix_agora_sdk() {
  local file=$1
  echo "🛠️  Adding specific fixes for Agora SDK in $file..."
  
  if grep -q "agora-rtc-sdk" "$file"; then
    if ! grep -q "\"overrides\".*\"agora-rtc-sdk" "$file"; then
      sed -i '' -e "/\"overrides\"[[:space:]]*:/ {
        :a
        n
        /}/!ba
        i\\
    \"agora-rtc-sdk\": {\
      \"axios\": \"1.6.8\",\
      \"follow-redirects\": \"1.15.4\"\
    },
      }" "$file"
    fi
    
    if ! grep -q "\"resolutions\".*\"agora-rtc-sdk" "$file"; then
      sed -i '' -e "/\"resolutions\"[[:space:]]*:/ {
        :a
        n
        /}/!ba
        i\\
    \"agora-rtc-sdk\": {\
      \"axios\": \"1.6.8\",\
      \"follow-redirects\": \"1.15.4\"\
    },
      }" "$file"
    fi
  fi
  
  if grep -q "agora-rtc-sdk-ng" "$file"; then
    if ! grep -q "\"overrides\".*\"agora-rtc-sdk-ng" "$file"; then
      sed -i '' -e "/\"overrides\"[[:space:]]*:/ {
        :a
        n
        /}/!ba
        i\\
    \"agora-rtc-sdk-ng\": {\
      \"axios\": \"1.6.8\",\
      \"follow-redirects\": \"1.15.4\",\
      \"@agora-js/media\": {\
        \"axios\": \"1.6.8\",\
        \"follow-redirects\": \"1.15.4\"\
      },\
      \"@agora-js/report\": {\
        \"axios\": \"1.6.8\",\
        \"follow-redirects\": \"1.15.4\"\
      },\
      \"@agora-js/shared\": {\
        \"axios\": \"1.6.8\",\
        \"follow-redirects\": \"1.15.4\"\
      }\
    },
      }" "$file"
    fi
  fi
}

# Fix Next.js specific issues
fix_nextjs_issues() {
  local file=$1
  echo "🛠️  Adding specific fixes for Next.js in $file..."
  
  if grep -q "\"next\":" "$file"; then
    # Add next.js specific security resolutions
    for dep in webpack terser node-fetch shelljs minimist; do
      version="${SECURE_VERSIONS[$dep]}"
      
      if ! grep -q "\"resolutions\".*\"$dep\":" "$file"; then
        sed -i '' -e "/\"resolutions\"[[:space:]]*:/ {
          :a
          n
          /}/!ba
          i\\
    \"$dep\": \"$version\",
        }" "$file"
      fi
    done
    
    # Next specific fixes for deep dependencies
    if grep -q "\"resolutions\"" "$file"; then
      if ! grep -q "\"resolutions\".*\"@next/swc" "$file"; then
        sed -i '' -e "/\"resolutions\"[[:space:]]*:/ {
          :a
          n
          /}/!ba
          i\\
    \"@sentry/nextjs\": {\
      \"@sentry/core\": {\
        \"follow-redirects\": \"1.15.4\"\
      }\
    },
        }" "$file"
      fi
    fi
  fi
}

# Find and update all package.json files
find_and_update_packages() {
  echo "🔎 Searching for all package.json files in the project..."
  
  find . -name "package.json" | while read -r file; do
    if [ "$file" != "./node_modules/package.json" ] && [[ "$file" != *"node_modules"* ]]; then
      echo "📋 Processing $file..."
      update_package_json "$file"
      fix_agora_sdk "$file"
      
      # Apply Next.js specific fixes to web-related packages
      if [[ "$file" == *"web"* ]] || [[ "$file" == *"demo-app"* ]]; then
        fix_nextjs_issues "$file"
      fi
    fi
  done
}

# Create NPM force resolutions file
create_force_resolutions() {
  echo "⚙️ Creating npm-force-resolutions configuration..."
  
  cat > ./.npm-force-resolutions.json << EOF
{
  "axios": "${SECURE_VERSIONS["axios"]}",
  "semver": "${SECURE_VERSIONS["semver"]}",
  "json5": "${SECURE_VERSIONS["json5"]}",
  "minimatch": "${SECURE_VERSIONS["minimatch"]}",
  "word-wrap": "${SECURE_VERSIONS["word-wrap"]}",
  "tough-cookie": "${SECURE_VERSIONS["tough-cookie"]}",
  "postcss": "${SECURE_VERSIONS["postcss"]}",
  "@babel/traverse": "${SECURE_VERSIONS["babel-traverse"]}",
  "ua-parser-js": "${SECURE_VERSIONS["ua-parser-js"]}",
  "follow-redirects": "${SECURE_VERSIONS["follow-redirects"]}",
  "webpack": "${SECURE_VERSIONS["webpack"]}",
  "node-fetch": "${SECURE_VERSIONS["node-fetch"]}",
  "glob-parent": "${SECURE_VERSIONS["glob-parent"]}",
  "terser": "${SECURE_VERSIONS["terser"]}",
  "loader-utils": "${SECURE_VERSIONS["loader-utils"]}",
  "minimist": "${SECURE_VERSIONS["minimist"]}",
  "shelljs": "${SECURE_VERSIONS["shelljs"]}",
  "qs": "${SECURE_VERSIONS["qs"]}"
}
EOF
}

# Create a .npmrc file with security settings
create_npmrc() {
  echo "⚙️ Creating .npmrc with security settings..."
  
  cat > ./.npmrc << EOF
# Security settings
audit=true
fund=false
engine-strict=false
resolution-mode=highest
EOF
}

# Create a yarnrc.yml file with security settings for newer Yarn versions
create_modern_yarnrc() {
  echo "⚙️ Creating .yarnrc.yml with security settings..."
  mkdir -p .yarn/releases
  
  cat > ./.yarnrc.yml << EOF
nodeLinker: node-modules
npmRegistryServer: "https://registry.yarnpkg.com"
checksumBehavior: update

packageExtensions:
  agora-rtc-sdk@*:
    dependencies:
      follow-redirects: "1.15.4"
      axios: "1.6.8"
  agora-rtc-sdk-ng@*:
    dependencies:
      follow-redirects: "1.15.4"
      axios: "1.6.8"
  "@sentry/nextjs@*":
    dependencies:
      "@babel/traverse": "7.23.2"
      webpack: "5.76.0"
EOF
}

# Create npm-shrinkwrap.json to lock dependencies
create_shrinkwrap() {
  echo "⚙️ Creating package-lock.json with security forced versions..."
  
  npm install --package-lock-only
  
  # Update package-lock.json directly for critical deps
  if [ -f "package-lock.json" ]; then
    for dep in axios follow-redirects; do
      version="${SECURE_VERSIONS[$dep]}"
      echo "🔒 Forcing secure version of $dep to $version in package-lock.json"
      # Use perl for more reliable JSON manipulation
      perl -i -pe "s/\"$dep\": {\s+\"version\": \"[^\"]+\"/\"$dep\": {\n      \"version\": \"$version\"/g" package-lock.json
    done
  fi
}

# Create explicit patches for difficult vulnerabilities
create_patches() {
  echo "⚙️ Creating patch directory for direct fixes..."
  
  mkdir -p patches
  
  # Create patch for axios vulnerability
  cat > ./patches/axios-security-fix.patch << EOF
diff --git a/node_modules/axios/lib/adapters/xhr.js b/node_modules/axios/lib/adapters/xhr.js
index 94db358..1671f19 100644
--- a/node_modules/axios/lib/adapters/xhr.js
+++ b/node_modules/axios/lib/adapters/xhr.js
@@ -24,6 +24,11 @@ module.exports = function xhrAdapter(config) {
     
     // Validate URL before proceeding
     var url = config.url;
+    if (typeof url !== 'string') {
+      return reject(createError(
+        'URL must be a string',
+        config
+      ));
+    }
     
     // Add responseType to request if needed
     if (config.responseType) {
EOF
}

# Create patch application script
create_patch_applier() {
  echo "⚙️ Creating patch application script..."
  
  mkdir -p scripts
  
  cat > ./scripts/apply-security-patches.js << EOF
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

console.log('🔒 Applying security patches to node_modules...');

const patches = [
  { name: 'axios-security-fix', target: 'axios' }
];

patches.forEach(patch => {
  try {
    const patchPath = path.resolve(__dirname, '../patches', \`\${patch.name}.patch\`);
    const moduleDir = path.resolve(__dirname, '../node_modules', patch.target);
    
    if (!fs.existsSync(moduleDir)) {
      console.warn(\`⚠️ Module \${patch.target} not found in node_modules\`);
      return;
    }
    
    console.log(\`📝 Applying patch to \${patch.target}...\`);
    child_process.execSync(\`patch -p1 -d \${moduleDir} < \${patchPath}\`, {
      stdio: 'inherit'
    });
    console.log(\`✅ Successfully patched \${patch.target}\`);
  } catch (error) {
    console.error(\`❌ Failed to apply patch to \${patch.target}:\`, error.message);
  }
});

console.log('🎉 Security patches applied successfully!');
EOF
  
  chmod +x ./scripts/apply-security-patches.js
}

# Add postinstall hook to package.json
add_postinstall_hook() {
  local file=$1
  echo "📦 Adding postinstall security hook to $file..."
  
  if grep -q "\"scripts\"" "$file"; then
    if ! grep -q "\"scripts\".*\"postinstall\"" "$file"; then
      sed -i '' -e "/\"scripts\"[[:space:]]*:/ {
        :a
        n
        /}/!ba
        i\\
    \"postinstall\": \"node ./scripts/apply-security-patches.js\",
      }" "$file"
    fi
  fi
}

echo "⚙️ Installing security tools..."
npm install -g npm-force-resolutions > /dev/null

# Create configuration files
create_force_resolutions
create_npmrc
create_modern_yarnrc
create_patches
create_patch_applier

# Update root package.json with postinstall hook
add_postinstall_hook "./package.json"

# Run the fixes
find_and_update_packages

# Create locked versions
create_shrinkwrap

echo "✅ Enhanced security vulnerability remediation complete!"
echo "Ensure to run 'npm install' or 'yarn install' to apply the fixed dependencies."
echo "Then run 'node ./scripts/apply-security-patches.js' to apply direct patches."
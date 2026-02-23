#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function findPackageJsonFiles(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.name === 'node_modules' || item.name === '.git') continue;
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...findPackageJsonFiles(fullPath));
    } else if (item.name === 'package.json') {
      results.push(fullPath);
    }
  }
  return results;
}

const srcDir = path.join(__dirname, '..', 'src');
const files = findPackageJsonFiles(srcDir);
let errors = 0;

for (const file of files) {
  try {
    const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
    const rel = path.relative(process.cwd(), file);
    if (!pkg.name) { console.error(`FAIL: ${rel} missing "name"`); errors++; }
    if (!pkg.version) { console.error(`FAIL: ${rel} missing "version"`); errors++; }
  } catch (e) {
    console.error(`FAIL: ${file} - ${e.message}`); errors++;
  }
}

console.log(`Checked ${files.length} package.json files, ${errors} errors`);
process.exit(errors > 0 ? 1 : 0);

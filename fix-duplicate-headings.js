#!/usr/bin/env node

/**
 * fix-duplicate-headings.js
 * 
 * This script fixes MD024 errors by adding unique suffixes to duplicate headings.
 * It can be used on specific files or with stdin/stdout for use with editors.
 * 
 * Usage:
 * 1. Fix a file in place:
 *    node fix-duplicate-headings.js path/to/file.md
 * 
 * 2. Process stdin and output to stdout (for use with editors):
 *    cat file.md | node fix-duplicate-headings.js > fixed.md
 */

const fs = require('fs');

// Get input - either from file or stdin
const filePath = process.argv[2];
let content;

if (filePath) {
  // Read from file
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Error reading file ${filePath}: ${err.message}`);
    process.exit(1);
  }
} else {
  // Read from stdin
  content = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      content += chunk;
    }
  });
  
  process.stdin.on('end', () => {
    const fixedContent = fixDuplicateHeadings(content);
    process.stdout.write(fixedContent);
  });
  
  // Return early for stdin mode - the rest will happen in the 'end' event
  if (!filePath) {
    return;
  }
}

function fixDuplicateHeadings(text) {
  // Parse the markdown and track heading text
  const lines = text.split('\n');
  const headings = {}; // Track headings by their text content
  const result = [];
  
  // Regex to match headings (# Heading)
  const headingRegex = /^(#{1,6})\s+(.+)$/;
  
  lines.forEach(line => {
    const match = line.match(headingRegex);
    
    if (match) {
      // This is a heading
      const level = match[1]; // The #'s
      const text = match[2].trim(); // The heading text
      
      if (headings[text]) {
        // This is a duplicate heading, add a suffix
        headings[text]++;
        const newText = `${text} (${headings[text]})`;
        result.push(`${level} ${newText}`);
      } else {
        // First time seeing this heading, record it
        headings[text] = 1;
        result.push(line);
      }
    } else {
      // Not a heading, pass through unchanged
      result.push(line);
    }
  });
  
  return result.join('\n');
}

if (filePath) {
  // Process file mode
  const fixedContent = fixDuplicateHeadings(content);
  
  // Only write if changes were made
  if (content !== fixedContent) {
    try {
      // Create backup of original file
      const backupPath = `${filePath}.bak`;
      fs.writeFileSync(backupPath, content, 'utf8');
      console.log(`Backup created: ${backupPath}`);
      
      // Write fixed content
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed file written: ${filePath}`);
    } catch (err) {
      console.error(`Error writing file ${filePath}: ${err.message}`);
    }
  } else {
    console.log(`No duplicate headings found in: ${filePath}`);
  }
}
const fs = require('fs');
const path = require('path');
const glob = require('glob'); // You may need to install this: npm install glob

/**
 * Enhanced markdown linting error fix script
 * - MD001: Heading increment (ensures headings only increment by one level at a time)
 * - MD004: Unordered list style (converts * to -)
 * - MD012: Multiple consecutive blank lines
 * - MD022: Blanks around headings
 * - MD024: Duplicate headings (improved to add unique suffixes)
 * - MD032: Blanks around lists
 * - MD034: Bare URLs
 * - MD036: Emphasis used as headings
 * - MD040: Code blocks missing language (improved)
 */

// Helper function to escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Get files to process
const filePattern = process.argv[2] || './**/*.md';
const filesToFix = glob.sync(filePattern, { nodir: true });

if (filesToFix.length === 0) {
  console.log(`No files found matching pattern: ${filePattern}`);
  console.log('Usage: node fix-markdown-errors.js "[path/pattern]"');
  console.log('Example: node fix-markdown-errors.js "./docs/**/*.md"');
  process.exit(1);
}

// Process each file
filesToFix.forEach(filePath => {
  console.log(`Processing: ${filePath}`);
  
  // Read the file
  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Error reading file ${filePath}: ${err.message}`);
    return;
  }
  
  // Track if we made changes
  let originalContent = content;
  
  // Fix MD001: Heading increment
  content = fixHeadingIncrement(content);
  
  // Fix MD022: Blanks around headings
  content = fixBlanksAroundHeadings(content);
  
  // Fix MD032: Blanks around lists
  content = fixBlanksAroundLists(content);
  
  // Fix MD034: Bare URLs
  content = fixBareUrls(content);
  
  // Fix MD012: Multiple consecutive blank lines
  content = fixMultipleBlankLines(content);
  
  // Fix MD040: Code blocks missing language (IMPROVED VERSION)
  content = fixCodeBlockLanguage(content);
  
  // Fix MD004: Unordered list style
  content = fixUnorderedListStyle(content);
  
  // Fix MD036: Emphasis used instead of headings
  content = fixEmphasisAsHeadings(content);
  
  // Fix MD024: Duplicate headings (IMPROVED VERSION)
  content = fixDuplicateHeadings(content);
  
  // Only write if changes were made
  if (content !== originalContent) {
    try {
      // Create backup of original file
      const backupPath = `${filePath}.bak`;
      fs.writeFileSync(backupPath, originalContent, 'utf8');
      console.log(`  Backup created: ${backupPath}`);
      
      // Write fixed content
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  Fixed file written: ${filePath}`);
    } catch (err) {
      console.error(`  Error writing file ${filePath}: ${err.message}`);
    }
  } else {
    console.log(`  No changes needed for: ${filePath}`);
  }
});

/**
 * Fix heading increment errors
 * Ensures headings only increment by one level at a time
 */
function fixHeadingIncrement(text) {
  const lines = text.split('\n');
  const resultLines = [...lines];
  
  let lastHeadingLevel = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headingMatch) {
      const currentLevel = headingMatch[1].length;
      const title = headingMatch[2].trim();
      
      // If we're jumping more than one level
      if (currentLevel > lastHeadingLevel + 1 && lastHeadingLevel > 0) {
        // Create a new heading at the appropriate level
        const newLevel = lastHeadingLevel + 1;
        const newHeading = '#'.repeat(newLevel) + ' ' + title;
        
        // Replace the current heading
        resultLines[i] = newHeading;
        
        console.log(`  Fixed heading increment: "${line}" -> "${newHeading}"`);
      }
      
      // Update the last heading level
      lastHeadingLevel = resultLines[i].match(/^(#{1,6})\s+/)[1].length;
    }
  }
  
  return resultLines.join('\n');
}

/**
 * Fix blanks around headings
 */
function fixBlanksAroundHeadings(text) {
  // Match headers and ensure they have blank lines before and after
  let result = text;
  
  // Fix spacing before headers that don't start the file
  result = result.replace(/([^\n])(\n)(#{1,6} .+)(\n)/g, '$1\n\n$3\n');
  
  // Fix spacing after headers
  result = result.replace(/(#{1,6} .+)(\n)([^\n])/g, '$1\n\n$3');
  
  // Handle file-starting headers (no need for blank line before)
  result = result.replace(/^(#{1,6} .+)(\n)([^\n])/gm, '$1\n\n$3');
  
  return result;
}

/**
 * Fix blanks around lists
 */
function fixBlanksAroundLists(text) {
  // Add blank line before lists that don't have one
  let result = text.replace(/([^\n])(\n)([-*+] )/g, '$1\n\n$3');
  
  // Add blank line after lists if needed
  result = result.replace(/^([-*+] .+)(\n)([^-*+\s])/gm, '$1\n\n$3');
  
  // Handle nested lists better by processing line by line
  const lines = result.split('\n');
  let inList = false;
  let indentation = 0;
  const processedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const listMatch = line.match(/^(\s*)([-*+] )/);
    
    if (listMatch) {
      // This is a list item
      const currentIndent = listMatch[1].length;
      
      if (!inList) {
        // Starting a new list
        inList = true;
        indentation = currentIndent;
        // Make sure there's a blank line before if not already there
        if (i > 0 && processedLines.length > 0 && processedLines[processedLines.length - 1] !== '') {
          processedLines.push('');
        }
      }
      
      processedLines.push(line);
    } else if (line.trim() === '') {
      // Blank line
      processedLines.push(line);
      if (inList) {
        inList = false;
      }
    } else {
      // Not a list item
      if (inList) {
        // We were in a list, now we're not
        inList = false;
        // Make sure there's a blank line after if not already there
        if (processedLines[processedLines.length - 1] !== '') {
          processedLines.push('');
        }
      }
      processedLines.push(line);
    }
  }
  
  return processedLines.join('\n');
}

/**
 * Fix bare URLs by wrapping them in angle brackets
 */
function fixBareUrls(text) {
  // This regex tries to match URLs not in markdown link format
  // We need to exclude URLs in code blocks
  const codeBlocks = [];
  
  // First, extract code blocks to prevent changing URLs inside them
  let processedText = text.replace(/```[\s\S]*?```|`[^`]+`/g, match => {
    codeBlocks.push(match);
    return `CODE_BLOCK_${codeBlocks.length - 1}`;
  });
  
  // Fix URLs not in link format
  processedText = processedText.replace(/(?<![(<`])(https?:\/\/[^\s)\]>]+)(?![)>\]])/g, '<$1>');
  
  // Restore code blocks
  processedText = processedText.replace(/CODE_BLOCK_(\d+)/g, (_, index) => codeBlocks[parseInt(index)]);
  
  return processedText;
}

/**
 * Fix multiple consecutive blank lines
 */
function fixMultipleBlankLines(text) {
  return text.replace(/\n{3,}/g, '\n\n');
}

/**
 * Fix code blocks without language specification (IMPROVED VERSION)
 * This will add a language specifier to all code blocks that don't have one
 */
function fixCodeBlockLanguage(text) {
  // Match code blocks that don't have a language specifier
  let result = text;
  
  // Fix open-ended code blocks (```\n)
  result = result.replace(/```(\s*\n)/g, '```markdown$1');
  
  // Fix closed code blocks without language (```)
  result = result.replace(/```\s*$/gm, '```markdown');
  
  // Fix code blocks with no content
  result = result.replace(/```\s*```/g, '```markdown\n```');
  
  // Find more complex code blocks - fences with nothing or whitespace after backticks
  result = result.replace(/```([^a-zA-Z0-9_\n][^\n]*\n)/g, '```markdown$1');
  
  return result;
}

/**
 * Fix unordered list style to use dashes instead of asterisks
 */
function fixUnorderedListStyle(text) {
  return text.replace(/^(\s*)\* /gm, '$1- ');
}

/**
 * Fix emphasis used as headings
 */
function fixEmphasisAsHeadings(text) {
  // Convert **text** on a line by itself to a proper heading
  return text.replace(/^(\s*)\*\*(.+)\*\*\s*$/gm, '$1### $2');
}

/**
 * Fix duplicate headings (IMPROVED VERSION)
 * Better and more intelligent handling of duplicate headings
 */
function fixDuplicateHeadings(text) {
  const headingsByLevel = {};
  const headingsByContent = {};
  const lines = text.split('\n');
  const resultLines = [...lines];
  
  // First pass: identify all headings and their positions
  lines.forEach((line, index) => {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      const key = `${level}:${title}`;
      
      if (!headingsByLevel[level]) {
        headingsByLevel[level] = {};
      }
      
      if (!headingsByContent[key]) {
        headingsByContent[key] = [];
      }
      
      headingsByContent[key].push(index);
    }
  });
  
  // Second pass: fix duplicates by adding unique suffixes
  Object.keys(headingsByContent).forEach(key => {
    const indices = headingsByContent[key];
    
    if (indices.length > 1) {
      // We have duplicates
      const [level, title] = key.split(':', 2);
      
      // Add suffixes, starting with the second occurrence
      for (let i = 1; i < indices.length; i++) {
        const index = indices[i];
        const suffix = ` (${i + 1})`;
        const originalLine = lines[index];
        const newLine = originalLine.replace(title, title + suffix);
        resultLines[index] = newLine;
      }
    }
  });
  
  return resultLines.join('\n');
}
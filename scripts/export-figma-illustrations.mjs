#!/usr/bin/env node
/**
 * Figma Illustration Export Pipeline
 *
 * Exports all illustration assets from the Austa SuperApp Figma file
 * directly via the Figma REST API (bypasses MCP rate limits).
 *
 * Usage:
 *   FIGMA_TOKEN=your_token node scripts/export-figma-illustrations.mjs
 *   FIGMA_TOKEN=your_token node scripts/export-figma-illustrations.mjs --section error-utility
 *   FIGMA_TOKEN=your_token node scripts/export-figma-illustrations.mjs --dry-run
 *
 * Get your token at: https://www.figma.com/developers/api#access-tokens
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const ILLUSTRATIONS_DIR = join(PROJECT_ROOT, 'src/web/design-system/src/assets/illustrations');

// ─── Config ───────────────────────────────────────────────────────────────────

const FIGMA_FILE_KEY = 'OcG9oRNdUEskvAPUcKiKMe';
const FIGMA_API_BASE = 'https://api.figma.com/v1';
const EXPORT_FORMAT = 'svg'; // 'svg' | 'png'
const PNG_SCALE = 3; // @3x for mobile

/**
 * Screen sections with their Figma frame IDs.
 * Each section contains screens that may have illustration child nodes.
 */
const SECTIONS = [
  {
    key: 'error-utility',
    name: 'Error & Utility',
    frameId: '20518:68135',
    expectedIllustrations: [
      'error-404-not-found',
      'error-401-server',
      'error-no-internet',
      'error-maintenance',
    ],
  },
  {
    key: 'welcome',
    name: 'Welcome Screen',
    frameId: '20307:23954',
    expectedIllustrations: [
      'welcome-onboarding-1',
      'welcome-onboarding-2',
      'welcome-onboarding-3',
      'welcome-onboarding-4',
      'welcome-splash',
    ],
  },
  {
    key: 'authentication',
    name: 'Authentication',
    frameId: '20307:23813',
    expectedIllustrations: [
      'auth-login',
      'auth-register',
      'auth-forgot-password',
      'auth-email-verify',
    ],
  },
  {
    key: 'splash',
    name: 'Splash & Loading',
    frameId: '20552:42704',
    expectedIllustrations: ['splash-brand'],
  },
  {
    key: 'health-assessment',
    name: 'Comprehensive Health Assessment',
    frameId: '23431:67051',
    expectedIllustrations: ['assessment-intro', 'assessment-complete'],
  },
  {
    key: 'profile-setup',
    name: 'Profile Setup & Account Completion',
    frameId: '20442:39819',
    expectedIllustrations: ['profile-setup', 'profile-biometric'],
  },
  {
    key: 'ai-companion',
    name: 'AI Wellness Companion',
    frameId: '20414:28939',
    expectedIllustrations: ['ai-companion-intro', 'ai-companion-avatar'],
  },
  {
    key: 'symptom-checker',
    name: 'AI Symptom Checker',
    frameId: '20406:25812',
    expectedIllustrations: ['symptom-checker-intro', 'symptom-checker-body'],
  },
  {
    key: 'medication',
    name: 'Medication Tracker',
    frameId: '20410:27039',
    expectedIllustrations: ['medication-empty'],
  },
  {
    key: 'sleep',
    name: 'Sleep Management',
    frameId: '20477:37838',
    expectedIllustrations: ['sleep-empty'],
  },
  {
    key: 'activity',
    name: 'Activity Tracker',
    frameId: '20482:62038',
    expectedIllustrations: ['activity-empty'],
  },
  {
    key: 'nutrition',
    name: 'Nutrition Monitoring',
    frameId: '20488:45260',
    expectedIllustrations: ['nutrition-empty'],
  },
  {
    key: 'cycle-tracking',
    name: 'Period & Cycle Tracking',
    frameId: '20404:22832',
    expectedIllustrations: ['cycle-tracking-intro'],
  },
  {
    key: 'consultation',
    name: 'Doctor Consultation',
    frameId: '20419:50825',
    expectedIllustrations: ['consultation-waiting', 'consultation-complete'],
  },
  {
    key: 'wellness',
    name: 'Wellness Resources',
    frameId: '20519:43188',
    expectedIllustrations: ['wellness-empty'],
  },
  {
    key: 'community',
    name: 'Health Community',
    frameId: '20519:66013',
    expectedIllustrations: ['community-empty'],
  },
  {
    key: 'achievements',
    name: 'Achievements',
    frameId: '20433:73777',
    expectedIllustrations: ['achievements-empty', 'achievements-celebrate'],
  },
  {
    key: 'notifications',
    name: 'Notification & Search',
    frameId: '20427:72389',
    expectedIllustrations: ['search-no-results', 'notifications-empty'],
  },
];

// ─── Figma API Helpers ────────────────────────────────────────────────────────

const token = process.env.FIGMA_TOKEN;
if (!token) {
  console.error('❌ Missing FIGMA_TOKEN environment variable.');
  console.error('   Get yours at: https://www.figma.com/developers/api#access-tokens');
  console.error('   Usage: FIGMA_TOKEN=xxxx node scripts/export-figma-illustrations.mjs');
  process.exit(1);
}

const headers = { 'X-Figma-Token': token };

async function figmaGet(path) {
  const url = `${FIGMA_API_BASE}${path}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * Get children of a Figma node (one level deep).
 */
async function getNodeChildren(nodeId) {
  const data = await figmaGet(`/files/${FIGMA_FILE_KEY}/nodes?ids=${nodeId}&depth=2`);
  const node = data.nodes[nodeId];
  if (!node || !node.document) return [];
  return node.document.children || [];
}

/**
 * Recursively find nodes that look like illustrations.
 * Heuristic: FRAME or GROUP nodes with image fills, or nodes named with
 * illustration-related keywords, or large visual nodes that aren't text/instances.
 */
function findIllustrationNodes(children, depth = 0) {
  const results = [];

  for (const child of children) {
    const name = (child.name || '').toLowerCase();
    const type = child.type;

    // Skip text nodes, tiny nodes, and pure layout frames
    if (type === 'TEXT') continue;

    // Check for image fills
    const hasImageFill = (child.fills || []).some(
      (f) => f.type === 'IMAGE' && f.visible !== false
    );

    // Check if this looks like an illustration node
    const isIllustrationName =
      /illustr|artwork|graphic|image|hero|visual|picture|drawing|art\b|svg/i.test(child.name);

    // Check if it's a large-ish visual element (likely an illustration)
    const w = child.absoluteBoundingBox?.width || 0;
    const h = child.absoluteBoundingBox?.height || 0;
    const isLargeVisual = w > 80 && h > 80;

    // Check if it's a vector/group that represents an illustration
    const isVectorGroup =
      (type === 'GROUP' || type === 'FRAME' || type === 'COMPONENT' || type === 'INSTANCE') &&
      isLargeVisual;

    if (hasImageFill || isIllustrationName || (isVectorGroup && depth > 0 && !name.includes('status bar'))) {
      results.push({
        id: child.id,
        name: child.name,
        type: child.type,
        width: Math.round(w),
        height: Math.round(h),
        hasImageFill,
        isIllustrationName,
      });
    }

    // Recurse into children (but not too deep)
    if (child.children && depth < 2) {
      results.push(...findIllustrationNodes(child.children, depth + 1));
    }
  }

  return results;
}

/**
 * Export specific node IDs as images from Figma.
 * Returns a map of nodeId -> imageUrl.
 */
async function exportNodes(nodeIds, format = EXPORT_FORMAT, scale = PNG_SCALE) {
  if (nodeIds.length === 0) return {};

  const ids = nodeIds.join(',');
  const scaleParam = format === 'png' ? `&scale=${scale}` : '';
  const data = await figmaGet(
    `/images/${FIGMA_FILE_KEY}?ids=${ids}&format=${format}${scaleParam}`
  );

  return data.images || {};
}

/**
 * Download a URL to a local file.
 */
async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(destPath), { recursive: true });
  await writeFile(destPath, buffer);
  return buffer.length;
}

/**
 * Sanitize a Figma node name to a valid filename.
 */
function sanitizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

// ─── Main Pipeline ────────────────────────────────────────────────────────────

async function processSection(section, dryRun = false) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📂 ${section.name} (${section.key})`);
  console.log(`   Frame ID: ${section.frameId}`);
  console.log(`${'─'.repeat(60)}`);

  // Step 1: Get the section's children (individual screens)
  let screens;
  try {
    screens = await getNodeChildren(section.frameId);
  } catch (err) {
    console.error(`   ❌ Failed to fetch frame: ${err.message}`);
    return { section: section.key, status: 'error', error: err.message, exported: 0 };
  }

  console.log(`   Found ${screens.length} child nodes`);

  // Step 2: For each screen, get its children to find illustrations
  const allScreenNodeIds = screens
    .filter((s) => s.type === 'FRAME' || s.type === 'COMPONENT' || s.type === 'INSTANCE')
    .map((s) => s.id);

  if (allScreenNodeIds.length === 0) {
    console.log('   ⚠️  No screen frames found');
    return { section: section.key, status: 'empty', exported: 0 };
  }

  // We'll export the screen frames themselves — each screen IS the illustration context
  // For error/utility screens, each screen frame contains the full visual
  console.log(`   📱 Screen frames: ${allScreenNodeIds.length}`);

  // Step 3: Also try to identify individual illustration sub-nodes
  const illustrationNodes = [];
  for (const screen of screens) {
    if (screen.children) {
      const found = findIllustrationNodes(screen.children, 0);
      for (const node of found) {
        illustrationNodes.push({
          ...node,
          parentScreen: screen.name,
          parentId: screen.id,
        });
      }
    }
  }

  console.log(`   🎨 Illustration candidates: ${illustrationNodes.length}`);

  if (illustrationNodes.length > 0) {
    for (const ill of illustrationNodes.slice(0, 10)) {
      console.log(`      • ${ill.name} (${ill.type}, ${ill.width}×${ill.height}px${ill.hasImageFill ? ', has image fill' : ''})`);
    }
  }

  if (dryRun) {
    console.log('   🏃 DRY RUN — skipping export');
    return {
      section: section.key,
      status: 'dry-run',
      screens: allScreenNodeIds.length,
      illustrations: illustrationNodes.length,
      exported: 0,
    };
  }

  // Step 4: Export illustration nodes (or screen frames if no illustrations found)
  const nodesToExport =
    illustrationNodes.length > 0
      ? illustrationNodes.map((n) => n.id)
      : allScreenNodeIds;

  console.log(`   📤 Exporting ${nodesToExport.length} nodes as ${EXPORT_FORMAT.toUpperCase()}...`);

  let imageUrls;
  try {
    imageUrls = await exportNodes(nodesToExport);
  } catch (err) {
    console.error(`   ❌ Export failed: ${err.message}`);
    return { section: section.key, status: 'export-error', error: err.message, exported: 0 };
  }

  // Step 5: Download each image
  const outputDir = join(ILLUSTRATIONS_DIR, section.key);
  let exported = 0;
  const exportedFiles = [];

  for (const [nodeId, url] of Object.entries(imageUrls)) {
    if (!url) {
      console.log(`   ⚠️  No image URL for node ${nodeId}`);
      continue;
    }

    // Find a name for this node
    const matchingNode =
      illustrationNodes.find((n) => n.id === nodeId) ||
      screens.find((s) => s.id === nodeId);
    const nodeName = matchingNode ? sanitizeName(matchingNode.name) : `node-${nodeId.replace(':', '-')}`;
    const ext = EXPORT_FORMAT === 'svg' ? 'svg' : 'png';
    const fileName = `${nodeName}.${ext}`;
    const filePath = join(outputDir, fileName);

    try {
      const size = await downloadFile(url, filePath);
      exported++;
      exportedFiles.push({ fileName, nodeId, size });
      console.log(`   ✅ ${fileName} (${(size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`   ❌ Download failed for ${nodeName}: ${err.message}`);
    }
  }

  console.log(`   📦 Exported: ${exported}/${Object.keys(imageUrls).length}`);
  return {
    section: section.key,
    status: 'success',
    exported,
    files: exportedFiles,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const sectionFilter = args.find((a, i) => args[i - 1] === '--section');
  const formatArg = args.find((a, i) => args[i - 1] === '--format');

  if (formatArg === 'png' || formatArg === 'svg') {
    // Override format from CLI
  }

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   Austa SuperApp — Figma Illustration Export Pipeline   ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log(`  File: ${FIGMA_FILE_KEY}`);
  console.log(`  Format: ${EXPORT_FORMAT.toUpperCase()}${EXPORT_FORMAT === 'png' ? ` @${PNG_SCALE}x` : ''}`);
  console.log(`  Output: ${ILLUSTRATIONS_DIR}`);
  console.log(`  Sections: ${sectionFilter || 'all'}`);
  console.log(`  Dry run: ${dryRun}`);

  // Validate token
  try {
    const me = await figmaGet('/me');
    console.log(`  User: ${me.handle || me.email}`);
  } catch (err) {
    console.error(`\n❌ Figma API auth failed: ${err.message}`);
    process.exit(1);
  }

  const sectionsToProcess = sectionFilter
    ? SECTIONS.filter((s) => s.key === sectionFilter)
    : SECTIONS;

  if (sectionsToProcess.length === 0) {
    console.error(`\n❌ Unknown section: ${sectionFilter}`);
    console.error(`   Available: ${SECTIONS.map((s) => s.key).join(', ')}`);
    process.exit(1);
  }

  const results = [];
  for (const section of sectionsToProcess) {
    const result = await processSection(section, dryRun);
    results.push(result);

    // Small delay between sections to be nice to the API
    if (!dryRun) await new Promise((r) => setTimeout(r, 500));
  }

  // Summary
  console.log(`\n${'═'.repeat(60)}`);
  console.log('📊 Export Summary');
  console.log(`${'─'.repeat(60)}`);

  const totalExported = results.reduce((sum, r) => sum + (r.exported || 0), 0);
  const totalFiles = results.flatMap((r) => r.files || []);
  const totalSize = totalFiles.reduce((sum, f) => sum + (f.size || 0), 0);

  for (const r of results) {
    const icon = r.status === 'success' ? '✅' : r.status === 'dry-run' ? '🏃' : '❌';
    console.log(`  ${icon} ${r.section}: ${r.exported || 0} exported`);
  }

  console.log(`\n  Total: ${totalExported} files, ${(totalSize / 1024).toFixed(1)} KB`);

  // Write manifest of exported files
  if (totalExported > 0) {
    const manifest = {
      exportedAt: new Date().toISOString(),
      format: EXPORT_FORMAT,
      totalFiles: totalExported,
      totalSizeKB: Math.round(totalSize / 1024),
      sections: results.filter((r) => r.status === 'success'),
    };
    const manifestPath = join(ILLUSTRATIONS_DIR, 'export-manifest.json');
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`\n  📋 Manifest: ${manifestPath}`);
  }

  // Generate index.ts registry
  if (totalExported > 0) {
    await generateRegistry(results);
  }

  console.log('\n✨ Done!\n');
}

/**
 * Generate a TypeScript registry that exports all illustrations by name.
 */
async function generateRegistry(results) {
  const imports = [];
  const exports = [];

  for (const result of results) {
    if (!result.files || result.files.length === 0) continue;
    for (const file of result.files) {
      const varName = file.fileName
        .replace(/\.[^.]+$/, '')
        .replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const importPath = `./${result.section}/${file.fileName}`;
      imports.push(`import ${varName} from '${importPath}';`);
      exports.push(`  '${file.fileName.replace(/\.[^.]+$/, '')}': ${varName},`);
    }
  }

  const content = `/**
 * Illustration Asset Registry
 * Auto-generated by scripts/export-figma-illustrations.mjs
 *
 * Usage:
 *   import { illustrations } from '@design-system/assets/illustrations';
 *   <Image source={illustrations['error-404-not-found']} />
 */

${imports.join('\n')}

export const illustrations = {
${exports.join('\n')}
} as const;

export type IllustrationName = keyof typeof illustrations;
`;

  const indexPath = join(ILLUSTRATIONS_DIR, 'index.ts');
  await writeFile(indexPath, content);
  console.log(`\n  📝 Registry: ${indexPath}`);
}

main().catch((err) => {
  console.error('\n💥 Fatal error:', err);
  process.exit(1);
});

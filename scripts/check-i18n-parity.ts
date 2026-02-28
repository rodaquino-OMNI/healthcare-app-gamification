/**
 * i18n Key Parity Checker
 *
 * Compares en-US.ts and pt-BR.ts translation files, reporting:
 * - Total keys per locale
 * - Keys present in en-US but missing from pt-BR
 * - Keys present in pt-BR but missing from en-US
 * - Type mismatches (string vs object at the same path)
 *
 * Usage: npx tsx scripts/check-i18n-parity.ts
 * Exit code 0 = full parity, 1 = mismatches found
 */

import path from 'path';

const I18N_DIR = path.resolve(__dirname, '../src/web/mobile/src/i18n');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type TranslationValue = string | Record<string, unknown>;
type TranslationObject = Record<string, TranslationValue>;

/**
 * Recursively flatten a nested object into dot-notation keys.
 * Returns a Map where each key is the dot-path and the value is 'string' | 'object'.
 */
function flattenKeys(
  obj: Record<string, unknown>,
  prefix = '',
): Map<string, 'string' | 'object'> {
  const result = new Map<string, 'string' | 'object'>();

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result.set(fullKey, 'object');
      for (const [k, v] of flattenKeys(value as Record<string, unknown>, fullKey)) {
        result.set(k, v);
      }
    } else {
      result.set(fullKey, 'string');
    }
  }

  return result;
}

function printList(heading: string, items: string[]): void {
  if (items.length === 0) return;
  console.log(`\n${heading} (${items.length}):`);
  for (const item of items.sort()) {
    console.log(`  - ${item}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  // Dynamic import works with tsx for .ts files that use default export
  const enMod = await import(path.join(I18N_DIR, 'en-US'));
  const ptMod = await import(path.join(I18N_DIR, 'pt-BR'));

  const enUS: TranslationObject = enMod.default ?? enMod;
  const ptBR: TranslationObject = ptMod.default ?? ptMod;

  const enKeys = flattenKeys(enUS);
  const ptKeys = flattenKeys(ptBR);

  // Leaf keys only (strings) for missing/extra comparison
  const enLeaves = new Set(
    [...enKeys.entries()].filter(([, t]) => t === 'string').map(([k]) => k),
  );
  const ptLeaves = new Set(
    [...ptKeys.entries()].filter(([, t]) => t === 'string').map(([k]) => k),
  );

  const missingInPt = [...enLeaves].filter((k) => !ptLeaves.has(k));
  const extraInPt = [...ptLeaves].filter((k) => !enLeaves.has(k));

  // Type mismatches: same dot-path exists in both but one is string, other is object
  const typeMismatches: string[] = [];
  for (const [key, enType] of enKeys) {
    const ptType = ptKeys.get(key);
    if (ptType && ptType !== enType) {
      typeMismatches.push(`${key}  (en-US: ${enType}, pt-BR: ${ptType})`);
    }
  }

  // ---------------------------------------------------------------------------
  // Report
  // ---------------------------------------------------------------------------

  console.log('=== i18n Key Parity Report ===\n');
  console.log(`en-US leaf keys : ${enLeaves.size}`);
  console.log(`pt-BR leaf keys : ${ptLeaves.size}`);

  const hasIssues =
    missingInPt.length > 0 || extraInPt.length > 0 || typeMismatches.length > 0;

  if (!hasIssues) {
    console.log('\nFull parity — no mismatches found.');
    process.exit(0);
  }

  printList('Missing in pt-BR (present in en-US)', missingInPt);
  printList('Extra in pt-BR (not in en-US)', extraInPt);
  printList('Type mismatches', typeMismatches);

  console.log(
    `\nTotal issues: ${missingInPt.length + extraInPt.length + typeMismatches.length}`,
  );
  process.exit(1);
}

main().catch((err) => {
  console.error('Fatal error running i18n parity check:', err);
  process.exit(2);
});

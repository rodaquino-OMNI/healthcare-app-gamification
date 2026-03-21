/**
 * Custom Jest transformer using esbuild to handle TypeScript + JSX.
 * This bypasses the broken Babel dependency chain (metro-react-native-babel-preset
 * incompatibility with @babel/traverse@7.23.2 override in the web workspace).
 *
 * esbuild handles TypeScript type-stripping and JSX transformation natively
 * without relying on @babel/traverse, avoiding the version mismatch entirely.
 *
 * For react-native internal .js files that use Flow syntax, we pre-strip
 * Flow annotations BEFORE passing to esbuild (not just as a fallback),
 * because esbuild may not fail on Flow syntax — it can silently mis-parse it.
 */
'use strict';

const path = require('path');

// Use esbuild from the web workspace (it's not in mobile's own node_modules)
const esbuildPath = path.resolve(__dirname, '../node_modules/esbuild');
const { transformSync } = require(esbuildPath);

/**
 * Detect if a file likely contains Flow type annotations.
 * We check for react-native paths and @flow pragma.
 */
function likelyHasFlowTypes(source, sourcePath) {
    // react-native internals always use Flow
    if (sourcePath.includes('node_modules/react-native/') || sourcePath.includes('node_modules/@react-native/')) {
        return true;
    }
    // Files with @flow pragma
    if (source.includes('@flow')) {
        return true;
    }
    // Files with Flow-specific import syntax
    if (/\bimport\s+typeof\b/.test(source)) {
        return true;
    }
    return false;
}

/**
 * Strip Flow type annotations using regex patterns and line-by-line processing.
 * Applied PRE-EMPTIVELY for react-native files (not just as fallback).
 * Handles common Flow syntax found in react-native internals, including
 * complex getter return types that may span multiple lines.
 */
function stripFlowTypes(source) {
    // Phase 1: regex-based stripping for common patterns
    let partial = source
        // Remove ALL forms of 'import typeof ...' — Flow-specific import syntax
        .replace(/^import\s+typeof\b[^\n]*$/gm, '')
        // Remove type imports: import type {...} from '...' or import type Foo from '...'
        .replace(/^import\s+type\s+.*?;?\s*$/gm, '')
        // Remove export type declarations
        .replace(/^export\s+type\s+.*?;?\s*$/gm, '')
        // Remove type declarations: type Foo = ...;
        .replace(/^\s*(?:opaque\s+)?type\s+\w+\b.*$/gm, '')
        // Remove interface declarations (single line)
        .replace(/^\s*(?:export\s+)?interface\s+\w+[^{]*\{[^}]*\}\s*$/gm, '')
        // Remove @flow pragma
        .replace(/\/\/\s*@flow[^\n]*/g, '')
        .replace(/\/\*\s*@flow[^*]*\*\//g, '')
        // Remove Flow type annotations after variable declarations: (x: Type) patterns
        .replace(/:\s*\??\w+(?:\.\w+)*(?:<[^>]*>)?(?:\[\])?\s*(?=[,)=;])/g, '')
        // Remove return type annotations: ): ReturnType {
        .replace(/\)\s*:\s*\??\w+(?:\.\w+)*(?:<[^>]*>)?(?:\[\])?\s*(?=\{)/g, ') ');

    // Phase 2: handle getter/setter return type annotations (possibly multiline).
    // Pattern: "get Name():" followed by a type annotation ending at "{".
    // Examples:
    //   get Animated(): {...$Diff<AnimatedModule, {default: any}>, ...Animated} {
    //   get unstable_batchedUpdates(): $PropertyType<\n  ReactNative,...> {
    //   get requireNativeComponent(): <T>(\n  uiViewClassName: string\n) => HostComponent<T> {
    const lines = partial.split('\n');
    const output = [];
    let skipUntilBodyBrace = false;
    let braceDepth = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (skipUntilBodyBrace) {
            // Count braces to find the body-opening brace at depth 1
            for (let c = 0; c < line.length; c++) {
                if (line[c] === '{') braceDepth++;
                if (line[c] === '}') braceDepth--;
            }
            if (/\{\s*$/.test(line) && braceDepth > 0) {
                // Found the body-opening brace; skip this annotation line
                skipUntilBodyBrace = false;
                braceDepth = 0;
            }
            // Skip annotation lines (the getter decl was already emitted)
            continue;
        }

        // Detect getter with return type annotation
        const getterMatch = line.match(/^(\s*get\s+\w+\(\))\s*:/);
        if (getterMatch) {
            const decl = getterMatch[1]; // e.g. "  get Animated()"
            const afterColon = line.substring(getterMatch[0].length);
            if (/\{\s*$/.test(afterColon)) {
                // Single-line: get Foo(): Type { — replace with: get Foo() {
                output.push(decl + ' {');
            } else {
                // Multiline annotation — emit the declaration and skip until body brace
                output.push(decl + ' {');
                skipUntilBodyBrace = true;
                braceDepth = 0;
                for (let c = 0; c < afterColon.length; c++) {
                    if (afterColon[c] === '{') braceDepth++;
                    if (afterColon[c] === '}') braceDepth--;
                }
            }
            continue;
        }

        output.push(line);
    }

    return output.join('\n').trim();
}

/**
 * Hoist jest.mock/jest.unmock/jest.enableAutomock/jest.disableAutomock calls
 * to the top of the file, before any require() statements.
 * This replicates babel-plugin-jest-hoist without relying on @babel/traverse.
 */
function hoistJestMocks(code) {
    const lines = code.split('\n');
    const hoisted = [];
    const rest = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trimStart();

        // Detect jest.mock/unmock/enableAutomock/disableAutomock calls
        if (/^jest\.(mock|unmock|enableAutomock|disableAutomock)\(/.test(trimmed)) {
            // Collect the full call — it may span multiple lines (count parens)
            let depth = 0;
            let block = '';
            let j = i;
            while (j < lines.length) {
                const l = lines[j];
                block += (j > i ? '\n' : '') + l;
                for (let c = 0; c < l.length; c++) {
                    if (l[c] === '(') depth++;
                    if (l[c] === ')') depth--;
                }
                j++;
                if (depth <= 0) break;
            }
            hoisted.push(block);
            i = j;
            continue;
        }

        rest.push(line);
        i++;
    }

    if (hoisted.length === 0) return code;
    return hoisted.join('\n') + '\n' + rest.join('\n');
}

module.exports = {
    process(sourceText, sourcePath, options) {
        const ext = path.extname(sourcePath);

        // Skip non-transformable files
        if (!['.js', '.jsx', '.ts', '.tsx', '.mjs'].includes(ext)) {
            return { code: sourceText };
        }

        const isTypeScript = ext === '.ts' || ext === '.tsx';
        const loader = isTypeScript ? (ext === '.ts' ? 'ts' : 'tsx') : ext === '.jsx' ? 'jsx' : 'js';

        // For .js files from react-native and other Flow-typed packages,
        // pre-strip Flow annotations BEFORE passing to esbuild.
        // esbuild does not always fail on Flow syntax — it may silently mis-parse,
        // resulting in output that still contains 'import typeof' statements.
        let processedSource = sourceText;
        if (ext === '.js' || ext === '.mjs') {
            if (likelyHasFlowTypes(sourceText, sourcePath)) {
                processedSource = stripFlowTypes(sourceText);
            }
        }

        // Step 1: Strip TypeScript types and transform JSX using esbuild
        let code;
        try {
            const result = transformSync(processedSource, {
                loader,
                format: 'cjs',
                target: 'node16',
                platform: 'node',
                jsx: 'automatic',
                jsxImportSource: 'react',
                sourcemap: 'inline',
                sourcefile: sourcePath,
            });
            code = result.code;
        } catch (err) {
            // If esbuild still fails after Flow stripping, try as plain JS
            const fallback = processedSource === sourceText ? stripFlowTypes(sourceText) : processedSource;
            try {
                const result = transformSync(fallback, {
                    loader: 'js',
                    format: 'cjs',
                    target: 'node16',
                    platform: 'node',
                    sourcemap: 'inline',
                    sourcefile: sourcePath,
                });
                code = result.code;
            } catch (err2) {
                // Last resort: return the stripped source for jest to handle
                return { code: fallback };
            }
        }

        // Step 2: Hoist jest.mock calls to the top of the file
        // so they run before any require() statements.
        code = hoistJestMocks(code);

        return { code };
    },

    getCacheKey(fileData, filePath, options) {
        // Include version in cache key to invalidate on transformer updates
        return `esbuild-transform-v3:${filePath}:${fileData.length}`;
    },
};

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

// Jest mock support: we need babel-plugin-jest-hoist for jest.mock hoisting.
// Use babel-jest only for the hoist plugin (not for TypeScript/JSX transformation).
// Resolve via Node module resolution (may be hoisted to parent node_modules in workspaces).
const babelJest = require('babel-jest');

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
 * Strip Flow type annotations using simple regex patterns.
 * Applied PRE-EMPTIVELY for react-native files (not just as fallback).
 * Handles the most common Flow syntax found in react-native internals.
 */
function stripFlowTypes(source) {
    return (
        source
            // Remove ALL forms of 'import typeof ...' — Flow-specific import syntax
            // Covers: import typeof Foo from '...'
            //         import typeof * as Foo from '...'
            //         import typeof {Foo} from '...'
            //         import typeof {Foo, Bar} from '...'
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
            // Be careful not to break JS object property names
            .replace(/:\s*\??\w+(?:\.\w+)*(?:<[^>]*>)?(?:\[\])?\s*(?=[,)=;])/g, '')
            // Remove return type annotations: ): ReturnType {
            .replace(/\)\s*:\s*\??\w+(?:\.\w+)*(?:<[^>]*>)?(?:\[\])?\s*(?=\{)/g, ') ')
            .trim()
    );
}

// Create a minimal babel-jest transformer that only applies jest-hoist
// without going through TypeScript/JSX transformation (esbuild handles that).
const jestHoistTransformer = babelJest.createTransformer({
    // Only the jest-mock hoisting preset — no TypeScript or JSX plugins.
    // babel-preset-jest does NOT use @babel/traverse for hoisting.
    presets: [require.resolve('babel-preset-jest')],
    babelrc: false,
    configFile: false,
});

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

        // Step 2: Apply jest.mock hoisting via babel-preset-jest
        // This ensures jest.mock() calls are hoisted to the top of the file.
        try {
            const hoisted = jestHoistTransformer.process(code, sourcePath, options);
            return hoisted;
        } catch (err) {
            // If hoisting fails, return esbuild output as-is
            return { code };
        }
    },

    getCacheKey(fileData, filePath, options) {
        // Include version in cache key to invalidate on transformer updates
        return `esbuild-transform-v3:${filePath}:${fileData.length}`;
    },
};

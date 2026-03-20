module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 2021,
    },
    plugins: [
        '@typescript-eslint/eslint-plugin', // v5.59.5
        'prettier', // v4.2.1
        'import', // v2.27.5
        'nestjs', // v1.2.3
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:prettier/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:nestjs/recommended',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js', '**/*.js', '**/*.d.ts', 'node_modules', 'dist', 'coverage'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true,
            },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            },
        ],
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'interface',
                format: ['PascalCase'],
                custom: {
                    regex: '^I[A-Z]',
                    match: false,
                },
            },
            {
                selector: 'typeAlias',
                format: ['PascalCase'],
            },
            {
                selector: 'enum',
                format: ['PascalCase'],
            },
        ],
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        'import/no-duplicates': 'error',
        'nestjs/use-validation-pipe': 'error',
        'nestjs/use-dependency-injection': 'error',
        'max-len': [
            'error',
            {
                code: 100,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            },
        ],
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-duplicate-imports': 'error',
        'no-return-await': 'error',
        eqeqeq: ['error', 'always'],
        curly: ['error', 'all'],
        'prefer-const': 'error',
    },
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: 'tsconfig.json',
            },
            node: {
                extensions: ['.js', '.ts'],
            },
        },
    },
    overrides: [
        {
            files: ['*.spec.ts', '*.test.ts', '*.e2e-spec.ts'],
            parserOptions: {
                project: null,
            },
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/no-unsafe-argument': 'off',
                '@typescript-eslint/require-await': 'off',
                '@typescript-eslint/unbound-method': 'off',
                '@typescript-eslint/no-base-to-string': 'off',
                '@typescript-eslint/await-thenable': 'off',
                '@typescript-eslint/no-floating-promises': 'off',
                '@typescript-eslint/no-misused-promises': 'off',
                '@typescript-eslint/restrict-template-expressions': 'off',
                '@typescript-eslint/restrict-plus-operands': 'off',
                '@typescript-eslint/no-unsafe-enum-comparison': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/naming-convention': 'off',
                '@typescript-eslint/no-duplicate-type-constituents': 'off',
                '@typescript-eslint/no-redundant-type-constituents': 'off',
                '@typescript-eslint/no-unnecessary-type-assertion': 'off',
                '@typescript-eslint/promise-function-async': 'off',
                '@typescript-eslint/prefer-nullish-coalescing': 'off',
                '@typescript-eslint/switch-exhaustiveness-check': 'off',
                '@typescript-eslint/no-implied-eval': 'off',
                '@typescript-eslint/no-throw-literal': 'off',
                'nestjs/use-validation-pipe': 'off',
                'nestjs/use-dependency-injection': 'off',
            },
        },
        {
            files: ['src/main.ts'],
            rules: {
                'no-console': 'off',
            },
        },
    ],
};

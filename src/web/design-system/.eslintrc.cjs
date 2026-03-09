const path = require('path');

module.exports = {
  parserOptions: {
    project: [path.join(__dirname, 'tsconfig.json')],
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx', '**/*.stories.tsx'],
      parserOptions: {
        project: [path.join(__dirname, 'tsconfig.eslint.json')],
        tsconfigRootDir: __dirname,
      },
      rules: {
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
  ],
};

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    plugins: [
        react(),
        dts({
            rollupTypes: false,
            tsconfigPath: './tsconfig.build.json',
        }),
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'AustaDesignSystem',
            formats: ['cjs', 'es'],
            fileName: (format) => (format === 'cjs' ? 'index.js' : 'index.esm.js'),
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react-native', 'styled-components'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'styled-components': 'styled',
                },
            },
        },
        sourcemap: true,
        minify: 'terser',
    },
});

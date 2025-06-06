import react from '@vitejs/plugin-react';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/inject.tsx'),
            name: 'ChatWidget',
            fileName: 'chat-widget',
            formats: ['umd'],
        },
        rollupOptions: {
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react-dom/client': 'ReactDOM',
                },
            },
            external: ['react', 'react-dom', 'react-dom/client'],
        },
        outDir: 'dist-widget',
        emptyOutDir: true,
        minify: true,
    },
}); 
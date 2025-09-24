import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    plugins: [svelte()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: 'popup.html',
                background: 'src/background.ts'
            },
            output: {
                entryFileNames: (chunk) => chunk.name === 'background' ? 'background.js' : '[name].js'
            }
        }
    }
});

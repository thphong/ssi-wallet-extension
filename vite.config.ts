import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from "node:path";

export default defineConfig({
    plugins: [svelte()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: 'popup.html',
                background: 'src/background.ts',                
                content: "src/content.ts"
            },
            output: {
                entryFileNames: (chunk) => chunk.name === 'background' ? 'background.js' : '[name].js'
            }
        }
    },
    resolve: {
        alias: {
            // chỉnh đường dẫn đúng tới file ESM đã build của lib bạn
            "did-core-sdk": resolve(__dirname, "node_modules/did-core-sdk/dist/index.js")
            // hoặc nếu bạn có bản dành cho browser:
            // "did-core-sdk": resolve(__dirname, "node_modules/did-core-sdk/dist/index.browser.js")
        }
    },
    optimizeDeps: {
        include: ["did-core-sdk"],
    },
});

import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [svelte()],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true, // helps debug
        rollupOptions: {
            input: {
                popup: resolve(__dirname, "index.html"),
                options: resolve(__dirname, "options.html"),
                background: resolve(__dirname, "src/background/sw.ts"),
                content: resolve(__dirname, "src/content/content.ts")
            },
            output: {
                entryFileNames: (c) =>
                    c.name === "background" ? "src/background/sw.js"
                        : c.name === "content" ? "src/content/content.js"
                            : "assets/[name].js",
                chunkFileNames: "assets/[name].js",
                assetFileNames: "assets/[name][extname]"
            }
        }
    }
});

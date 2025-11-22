## How to run
1. Install deps: `npm i`
2. Build: `npm run build` → outputs to `dist/`
3. Chrome → `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select the `dist/` folder.
4. npm i src/did-core/did-core-sdk-1.0.1.tgz

> During development, you can also run `npm run dev` and reload the extension after each change. MV3 service workers don’t HMR; a manual reload is normal.

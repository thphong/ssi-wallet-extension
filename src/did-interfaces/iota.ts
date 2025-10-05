import init from "@iota/sdk-wasm/web";
import * as identity from "@iota/identity-wasm/web";

export async function loadWasm() {
    const sdkWasmUrl = chrome.runtime.getURL("iota_sdk_wasm_bg.wasm");
    await init(sdkWasmUrl);

    const wasmUrl = chrome.runtime.getURL("identity_wasm_bg.wasm");
    await identity.init(wasmUrl);
}

(async () => {
    await loadWasm();
})();
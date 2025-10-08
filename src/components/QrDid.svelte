<!-- QrDid.svelte -->
<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import type { QRCodeToCanvasOptions } from "qrcode";
    import { shortenDid } from "../libs/utils";
    import CopyButton from "./CopyButton.svelte";

    export let did = ""; // pass in as prop if you like
    let canvasEl: HTMLCanvasElement;
    // Lazy import ensures it runs only in the browser
    let QRCode: (typeof import("qrcode"))["default"];

    async function renderQR() {
        if (!QRCode) {
            QRCode = (await import("qrcode")).default;
        }
        if (canvasEl && did) {
            const opts: QRCodeToCanvasOptions = {
                width: 256,
                margin: 1,
                errorCorrectionLevel: "H",
            };
            await QRCode.toCanvas(canvasEl, did, opts);
        }
    }

    onMount(renderQR);
    afterUpdate(renderQR);

    function downloadPng() {
        const url = canvasEl.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = "did-qr.png";
        a.click();
    }
</script>

<div class="space-y-2 center">
    <canvas bind:this={canvasEl} aria-label="DID QR code" />
    <div class="text-xs break-all flex">
        {shortenDid(did, 41)}
        <span class="margin-5"><CopyButton content={did} /></span>
        <button
            type="button"
            class="icon-btn icon-btn-small margin-5"
            aria-label="Download QR"
            title="Download"
            on:click={downloadPng}
        >
            <img src="/assets/download.png" alt="download" class="icon" />
        </button>
    </div>
</div>

<style>
    .center {
        text-align: center;
    }

    .flex {
        display: flex;
        gap: 5px;
    }

    .margin-5 {
        margin-top: -5px;
    }
</style>

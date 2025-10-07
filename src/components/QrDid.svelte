<!-- QrDid.svelte -->
<script lang="ts">
    import { onMount } from "svelte";
    import type { QRCodeToCanvasOptions } from "qrcode";
    import { shortenDid } from "../libs/utils";
    export let did = ""; // pass in as prop if you like
    let canvasEl: HTMLCanvasElement;

    // Lazy import ensures it runs only in the browser
    let QRCode: (typeof import("qrcode"))["default"];
    onMount(async () => {
        QRCode = (await import("qrcode")).default;
        const opts: QRCodeToCanvasOptions = {
            width: 256,
            margin: 1,
            errorCorrectionLevel: "M",
        };
        await QRCode.toCanvas(canvasEl, did, opts);
    });

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
    <div class="text-xs break-all">{shortenDid(did, 51)}</div>
    <button on:click={downloadPng}>Download QR</button>
</div>

<style>
    .center {
        text-align: center;
    }
</style>

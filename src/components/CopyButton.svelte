<script lang="ts">
    import { toDisplayString } from "../libs/utils";
    export let content: any;
    let copied = false;
    let copyTimer: number | undefined;

    async function copyToClipboard() {
        const text = toDisplayString(content);
        if (!text) return;

        await navigator.clipboard.writeText(text);
        showCopied();
    }

    function showCopied() {
        copied = true;
        if (copyTimer) clearTimeout(copyTimer);
        copyTimer = window.setTimeout(() => (copied = false), 1200);
    }
</script>

<button
    type="button"
    class="icon-btn icon-btn-small"
    aria-label="Copy DID to clipboard"
    title="Copy"
    on:click={copyToClipboard}
>
    {#if copied}
        <img src="/assets/copy-check.png" alt="copy" class="icon" />
    {:else}
        <img src="/assets/copy.png" alt="copy checked" class="icon" />
    {/if}
</button>

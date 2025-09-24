<script lang="ts">
    let clicks = 0;
    function pingContent() {
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (!tab?.id) return;
            chrome.tabs.sendMessage(tab.id, { type: "SSW_PING" });
        });
    }
</script>

<main style="min-width:300px;padding:12px;font:14px system-ui;">
    <h3>SS Wallet Extension</h3>
    <p>Popup powered by Svelte.</p>
    <button on:click={() => clicks++}>Clicked {clicks} times</button>
    <button on:click={pingContent} style="margin-left:8px;">Ping content</button
    >
    <div style="margin-top:12px;color:#666;">MV3, ESM, TypeScript</div>
</main>

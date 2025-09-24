<script lang="ts">
    let walletLabel = "";
    chrome.storage.sync.get(
        ["walletLabel"],
        (res) => (walletLabel = res.walletLabel ?? ""),
    );
    function save() {
        chrome.storage.sync.set({ walletLabel });
    }
</script>

<main style="padding:16px;font:14px system-ui;">
    <h2>Options</h2>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>Wallet label</label>
    <input bind:value={walletLabel} placeholder="e.g., Mainnet Wallet" />
    <button on:click={save} style="margin-left:8px;">Save</button>
</main>

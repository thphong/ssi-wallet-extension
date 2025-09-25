<script lang="ts">
    export let route: string;

    let name: string = "";
    let didType: "key" | "web" | "blockchain" = "key";
    let urlDid: string = "";
    let submitting = false;

    $: canSubmit =
        name.trim().length > 0 &&
        !submitting &&
        (didType != "web" || (didType == "web" && urlDid.trim().length > 0));

    async function onSubmit(e: Event) {
        e.preventDefault();
        if (!canSubmit) return;
        submitting = true;
        // emit to parent; do real work in parent
        //TODO: create did here
        //submitting = false;
    }
</script>

<header class="sub-header">
    <button
        class="icon-btn"
        aria-label="Back"
        title="Back"
        on:click={() => {
            route = "home";
        }}
    >
        <img src="/assets/left.png" alt="back" class="icon" />
    </button>
    <div class="title">Create User</div>
    <div class="spacer"></div>
</header>

<form on:submit|preventDefault={onSubmit}>
    <div class="field">
        <div class="label">Display Name</div>
        <div class="sublabel">Shown in your wallet</div>
        <input
            class="input"
            type="text"
            placeholder="e.g., your nickname"
            bind:value={name}
            maxlength="64"
            autocomplete="name"
            class:readonly={submitting}
        />
    </div>

    <div class="field">
        <div class="label">DID Type</div>
        <div class="sublabel">Choose how the DID is anchored</div>
        <select class="select" bind:value={didType} class:readonly={submitting}>
            <option value="key">Key (did:key)</option>
            <option value="web">Web (did:web)</option>
            <option value="blockchain">Blockchain (did:iota)</option>
        </select>
    </div>

    {#if didType == "web"}
        <div class="field">
            <div class="label">DID Url</div>
            <div class="sublabel">Url to resolve your did</div>
            <input
                class="input"
                type="text"
                placeholder="e.g., https://yourorg.vn/.well-known/did.json"
                bind:value={urlDid}
                maxlength="64"
                autocomplete="name"
                class:readonly={submitting}
            />
        </div>
    {/if}

    <div class="form-buttons">
        <button class="primary" disabled={!canSubmit}>
            {submitting ? "Creating…" : "Create"}
        </button>
    </div>
</form>

<style>
    
</style>

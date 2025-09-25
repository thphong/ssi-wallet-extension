<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let route: string;

    const dispatch = createEventDispatcher<{
        create: { name: string; didType: "key" | "web" | "blockchain" };
    }>();

    let name = "";
    let didType: "key" | "web" | "blockchain" = "key";
    let submitting = false;

    function canSubmit() {
        return name.trim().length > 0 && !submitting;
    }

    async function onSubmit(e: Event) {
        e.preventDefault();
        if (!canSubmit()) return;
        submitting = true;
        // emit to parent; do real work in parent
        dispatch("create", { name: name.trim(), didType });
        submitting = false;
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
        />
    </div>

    <div class="field">
        <div class="label">DID Type</div>
        <div class="sublabel">Choose how the DID is anchored</div>
        <select class="select" bind:value={didType}>
            <option value="key">Key (did:key)</option>
            <option value="web">Web (did:web)</option>
            <option value="blockchain">Blockchain (did:iota)</option>
        </select>
    </div>

    <div class="form-buttons">
        <button class="primary" disabled={!canSubmit()}>
            {submitting ? "Creating…" : "Create"}
        </button>
    </div>
</form>

<style>
    .field {
        display: flex;
        flex-direction: column;
        gap: 4px; /* spacing between label, sublabel, and input */
        padding: 10px 0;
    }

    .form-buttons {
        padding: 20px 0;
    }

    .label {
        font-size: 13px;
        font-weight: 600;
        color: #111827;
        padding-left: 5px;
    }

    .sublabel {
        font-size: 12px;
        color: #6b7280;
        padding-left: 5px;
    }

    .input,
    .select {
        padding: 6px 10px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: #fff;
        outline: none;
        font-size: 13px;
        color: #111827;
    }

    .input {
        height: 25px;
    }

    .select {
        height: 39px;
    }

    .input:focus,
    .select:focus {
        border-color: #93c5fd;
    }
</style>

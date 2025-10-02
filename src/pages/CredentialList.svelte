<script lang="ts">
    import { type VC } from "did-core-sdk";
    import JsonViewer from "../components/JsonViewer.svelte";
    import { shortenDid, formatDate } from "../libs/utils";
    export let credentials: any[] = [];
    export let selectedVCs: VC[] = [];
    export let needSelection = false;

    function onGetSelection() {
        selectedVCs = credentials.filter((item) => item.selected);
    }
</script>

{#if credentials.length === 0}
    <div class="empty-box">
        <p class="empty">No credentials yet</p>
    </div>
{:else}
    {#each credentials as cred}
        <div class="credential-card">
            <div class="cred-header">
                Credential Subject:
                {#if needSelection}
                    <input
                        type="checkbox"
                        bind:checked={cred.selected}
                        on:change={onGetSelection}
                    />
                {/if}
            </div>

            <div>
                <JsonViewer data={cred.credentialSubject} collapsedAt={1} />
            </div>
            <div class="cred-meta">
                <span class="cred-issuer"
                    >Issuer: {shortenDid(cred.issuer, 31)}</span
                >
                <span class="cred-date"
                    >Issue Date: {formatDate(cred.issuanceDate)}</span
                >
                {#if cred.expirationDate}
                    <span class="expire-date"
                        >Expired Date: {formatDate(cred.expirationDate)}</span
                    >
                {/if}
            </div>
        </div>
    {/each}
{/if}

<style>
    .empty-box {
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 1rem;
        background: #fff;
        min-height: 50px;
    }
    .empty {
        text-align: center;
        color: #3a3a3b;
        font-size: 13.33px;
        padding: 1rem 0;
    }
    .credential-card {
        border: 1px solid #d1d5db;
        border-radius: 10px;
        padding: 0.75rem;
        margin-bottom: 0.75rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    .cred-meta {
        font-size: 13px;
        color: #3a3a3b;
        display: grid;
        justify-content: space-between;
    }

    .cred-header {
        font-size: 13px;
        color: #3a3a3b;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .expire-date {
        font-weight: bold;
    }
</style>

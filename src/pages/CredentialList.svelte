<script lang="ts">
    import { type VC } from "did-core-sdk";
    import { shortenDid, formatDate } from "../libs/utils";
    import JsonCard from "../components/JsonCard.svelte";
    export let credentials: any[] = [];
    export let selectedVCs: VC[] = [];
    export let needSelection = false;
    export let maxIndex = 1;
    export let stepIndex = 2;

    function onGetSelection() {
        selectedVCs = credentials.filter((item) => item.selected);
    }
</script>

{#if credentials.length === 0}
    <div class="empty-box">
        <p class="empty">No credentials yet</p>
    </div>
{:else}
    {#each [...credentials].reverse().slice(0, maxIndex) as cred}
        <JsonCard
            dataDisplay={cred.credentialSubject}
            dataContent={cred}
            collapsedAt={1}
            title={"Credential Subject:"}
            downloadFilename={"credential.json"}
            {needSelection}
            bind:selected={cred.selected}
            on:change={onGetSelection}
        >
            <span slot="custom-meta">
                <span>Issuer: {shortenDid(cred.issuer, 31)}</span>
                <span>Issue Date: {formatDate(cred.issuanceDate)}</span>
                {#if cred.expirationDate}
                    <span class="bold"
                        >Expired Date: {formatDate(cred.expirationDate)}</span
                    >
                {/if}
            </span>
        </JsonCard>
    {/each}
    {#if credentials.length > maxIndex}
        <button
            class="secondary"
            on:click={() => {
                maxIndex += stepIndex;
            }}>Load more...</button
        >
    {/if}
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
</style>

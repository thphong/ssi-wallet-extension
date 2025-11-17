<script lang="ts">
    import { type VP } from "did-core-sdk";
    import JsonViewer from "../components/JsonViewer.svelte";
    import JsonCard from "../components/JsonCard.svelte";
    import { shortenDid } from "../libs/utils";
    export let presentations: VP[] = [];
    export let maxIndex = 1;
    export let stepIndex = 2;
</script>

{#if presentations.length === 0}
    <div class="empty-box">
        <p class="empty">No presentations yet</p>
    </div>
{:else}
    {#each [...presentations].reverse().slice(0, maxIndex) as pre}
        <JsonCard
            dataContent={pre}
            collapsedAt={1}
            title={"Credential Subjects:"}
            downloadFilename={"presentation.json"}
        >
            <div slot="custom-display">
                {#each pre.verifiableCredential as vc}
                    <div class="break-text">
                        <JsonViewer
                            data={vc.credentialSubject}
                            collapsedAt={1}
                        />
                    </div>
                    <div class="cred-meta">
                        <span class="cred-issuer"
                            >Issuer: {shortenDid(vc.issuer, 31)}</span
                        >
                    </div>
                {/each}
            </div>
            <span slot="custom-meta">
                <span class="cred-date">Nonce: {pre.challenge}</span>
            </span>
        </JsonCard>
    {/each}
    {#if presentations.length > maxIndex}
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
    .cred-meta {
        font-size: 13px;
        color: #3a3a3b;
        display: grid;
        justify-content: space-between;
    }
</style>

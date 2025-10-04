<script lang="ts">
    import { type VP } from "did-core-sdk";
    import JsonViewer from "../components/JsonViewer.svelte";
    import { shortenDid } from "../libs/utils";
    import { downloadJSON } from "../libs/utils";
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
        <div class="credential-card">
            <div class="cred-header">
                Credential Subjects:
                <button
                    class="icon-btn icon-btn-small"
                    on:click={() => downloadJSON(pre, "presentation.json")}
                >
                    <img
                        src="/assets/download.png"
                        alt="download"
                        class="icon"
                    />
                </button>
            </div>

            {#each pre.verifiableCredential as vc}
                <div>
                    <JsonViewer data={vc.credentialSubject} collapsedAt={1} />
                </div>
                <div class="cred-meta">
                    <span class="cred-issuer"
                        >Issuer: {shortenDid(vc.issuer, 31)}</span
                    >
                </div>
            {/each}
            <div class="cred-meta">
                <span class="cred-date">Nonce: {pre.challenge}</span>
            </div>
        </div>
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
</style>

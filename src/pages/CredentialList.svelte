<script lang="ts">
    import { type VCIem } from "../types/types";
    export let credentials: VCIem[] = [];
</script>

<div class="credentials-list">
    {#if credentials.length === 0}
        <p class="empty">No credentials yet</p>
    {:else}
        {#each credentials as cred}
            <div class="credential-card">
                <div class="cred-header">
                    <span class="cred-name">{cred.name}</span>
                    <span class="cred-type">{cred.type.join(", ")}</span>
                </div>
                <div class="cred-meta">
                    <span class="cred-issuer">Issuer: {cred.issuer}</span>
                    <span class="cred-date"
                        >{new Date(cred.issuedAt).toLocaleDateString()}</span
                    >
                </div>
            </div>
        {/each}
    {/if}
</div>

<style>
    .credentials-list {
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 1rem;
        background: #fff;
        min-height: 120px;
    }
    .empty {
        text-align: center;
        color: #6b7280;
        font-size: 0.9rem;
        padding: 1rem 0;
    }
    .credential-card {
        border: 1px solid #d1d5db;
        border-radius: 10px;
        padding: 0.75rem;
        margin-bottom: 0.75rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    .cred-header {
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.25rem;
    }
    .cred-meta {
        font-size: 0.8rem;
        color: #6b7280;
        display: flex;
        justify-content: space-between;
    }
</style>

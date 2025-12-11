<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import JsonViewer from "./JsonViewer.svelte";
    import CopyButton from "./CopyButton.svelte";
    import { downloadJSON } from "../libs/utils";
    export let selected = false;
    export let title = "";
    export let dataDisplay: any = null;
    export let dataContent: any = null;
    export let downloadFilename = "download.json";
    export let collapsedAt = 1;
    export let needSelection = false;
    export let revokeHandler: any = null;
    export let customClass: string = "";

    const dispatch = createEventDispatcher();

    function handleChange(event: Event) {
        dispatch("change", {
            value: (event.target as HTMLInputElement).value,
        });
    }
</script>

<div class="card-box {customClass}">
    <div class="cred-header">
        {title}
    </div>
    {#if dataDisplay}
        <div class="break-text">
            <JsonViewer data={dataDisplay} {collapsedAt} />
        </div>
    {/if}
    <slot name="custom-display"></slot>
    <div class="cred-meta">
        <slot name="custom-meta"></slot>
    </div>
    <div class="group-icon">
        <CopyButton content={dataContent}></CopyButton>
        {#if dataContent}
            <button
                class="icon-btn icon-btn-small"
                on:click={() => downloadJSON(dataContent, downloadFilename)}
            >
                <img src="/assets/download.png" alt="download" class="icon" />
            </button>
            {#if revokeHandler}
                <button
                    class="icon-btn icon-btn-small"
                    on:click={revokeHandler}
                >
                    <img src="/assets/undo.png" alt="Revoke" class="icon" />
                </button>
            {/if}
        {/if}
        {#if needSelection}
            <input
                type="checkbox"
                bind:checked={selected}
                on:change={handleChange}
            />
        {/if}
    </div>
</div>

<style>
    .card-box {
        position: relative;
    }

    .cred-header {
        font-size: 13px;
        color: #3a3a3b;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .group-icon {
        display: flex;
        column-gap: 5px;
        position: absolute;
        right: 10px;
        top: 10px;
    }

    .cred-meta {
        font-size: 13px;
        color: #3a3a3b;
        display: grid;
        justify-content: space-between;
    }

    .revoke-vc {
        background-color: antiquewhite;
    }
</style>

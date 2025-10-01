<script lang="ts">
    import { JSONEditor } from "svelte-jsoneditor";

    export let label = "";
    export let sublabel = "";
    export let value: any = {};
    export let readonlyCon = false;
    export let errorMessage = "";
</script>

<div class="field">
    {#if label}
        <div class="label">{label}</div>
    {/if}
    {#if sublabel}
        <div class="sublabel">{sublabel}</div>
    {/if}
    <div>
        <JSONEditor bind:content={value} readOnly={readonlyCon} />
    </div>
    {#if errorMessage}
        <div class="error-message">
            {errorMessage}
        </div>
    {/if}
</div>

<style>
    :global(
            .jse-menu button.jse-group-button,
            .jse-menu button.jse-contextmenu,
            .jse-menu div.jse-separator
        ) {
        display: none !important;
    }
</style>

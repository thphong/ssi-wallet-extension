<script lang="ts">
    import SveltyPicker from "svelty-picker";

    export let label = "";
    export let sublabel = "";
    export let value: string;
    export let readonlyCon = false;
    export let placeholder = "";
    export let errorMessage = "";
</script>

<div class="field">
    {#if label}
        <div class="label">{label}</div>
    {/if}
    {#if sublabel}
        <div class="sublabel">{sublabel}</div>
    {/if}

    <SveltyPicker
        mode="date"
        format="dd-M-yyyy"
        bind:value
        {placeholder}
        inputClasses={"input " + (readonlyCon ? "readonly" : "")}
    />
    {#if errorMessage}
        <div class="error-message">
            {errorMessage}
        </div>
    {/if}
</div>

<style>
    :global(.std-component-wrap) {
        display: contents !important;
    }
</style>

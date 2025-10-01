<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let label = "";
    export let sublabel = "";
    export let value: string;
    export let maxlength = 255;
    export let readonlyCon = false;
    export let placeholder = "";
    export let type = "text";
    export let errorMessage = "";

    function handleChange(event: Event) {
        dispatch("change", {
            value: (event.target as HTMLInputElement).value,
        });
    }
</script>

<div class="field">
    {#if label}
        <div class="label">{label}</div>
    {/if}
    {#if sublabel}
        <div class="sublabel">{sublabel}</div>
    {/if}
    {#if type == "password"}
        <input
            class="input"
            type="password"
            {placeholder}
            bind:value
            {maxlength}
            class:readonly={readonlyCon}
            on:change={handleChange}
        />
    {:else if type == "textarea"}
        <textarea
            class="textarea"
            {placeholder}
            bind:value
            {maxlength}
            class:readonly={readonlyCon}
        />
    {:else}
        <input
            class="input"
            type="text"
            {placeholder}
            bind:value
            {maxlength}
            class:readonly={readonlyCon}
            on:change={handleChange}
        />
    {/if}
    {#if errorMessage}
        <div class="error-message">
            {errorMessage}
        </div>
    {/if}
</div>

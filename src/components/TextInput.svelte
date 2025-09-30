<script lang="ts">
    export let label = "";
    export let sublabel = "";
    export let value: string;
    export let maxlength = 255;
    export let readonlyCon = false;
    export let placeholder = "";
    export let type = "text";
    export let errorMessage = "";
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
        />
    {/if}
    {#if errorMessage}
        <div class="error-message">
            {errorMessage}
        </div>
    {/if}
</div>

<script lang="ts">
    export let label = "";
    export let sublabel = "";
    export let value: string;
    export let readonlyCon = false;
    export let options: any[];
</script>

<div class="field">
    {#if label}
        <div class="label">{label}</div>
    {/if}
    {#if sublabel}
        <div class="sublabel">{sublabel}</div>
    {/if}
    <select class="select" bind:value class:readonly={readonlyCon}>
        {#each options as option}
            <option value={option.value}>{option.name}</option>
        {/each}
    </select>
</div>

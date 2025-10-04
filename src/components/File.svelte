<script lang="ts">
    export let label = "";
    export let sublabel = "";
    export let value: any;
    export let readonlyCon = false;
    export let placeholder = "";
    export let errorMessage = "";

    function handleChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    // Convert file content into JSON object
                    value = JSON.parse(reader.result as string);
                } catch (err) {
                    value = null;
                }
            };
            reader.readAsText(file);
        }
    }
</script>

<div class="field">
    {#if label}
        <div class="label">{label}</div>
    {/if}
    {#if sublabel}
        <div class="sublabel">{sublabel}</div>
    {/if}
    <input
        class="input"
        type="file"
        {placeholder}
        class:readonly={readonlyCon}
        on:change={handleChange}
    />
    {#if errorMessage}
        <div class="error-message">
            {errorMessage}
        </div>
    {/if}
</div>

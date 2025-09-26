<script lang="ts">
    export let route: string = "";
    export let routeBack: string = "";
    export let pageTitle = "";
</script>

<header class="sub-header">
    {#if routeBack}
        <button
            class="icon-btn"
            aria-label="Back"
            title="Back"
            on:click={() => {
                route = routeBack;
            }}
        >
            <img src="/assets/left.png" alt="back" class="icon" />
        </button>
    {:else}
        <div class="spacer"></div>
    {/if}
    <div class="title">{pageTitle}</div>
    <div class="spacer"></div>
</header>

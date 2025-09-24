<script lang="ts">
    import Home from "./Home.svelte";
    import Setting from "./Setting.svelte";

    let route: string = "home";
</script>

<!-- ============ HOME PAGE ============ -->
{#if route === "home"}
    <Home bind:route></Home>
{/if}
<!-- ============ SETTINGS PAGE ============ -->
{#if route === "settings"}
    <Setting bind:route></Setting>
{/if}

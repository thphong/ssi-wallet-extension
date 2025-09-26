<script lang="ts">
    import { ROUTES } from "../types/enums";
    export let route: string;
</script>

<!-- quick actions -->
<section class="main-content">
    <p class="large-text">Welcome to SSI Wallet!</p>
    <p>Get started by creating your first DID with the button below.</p>
    <button
        class="primary"
        on:click={() => {
            route = ROUTES.CREATE_USER_1;
        }}>Create New DID</button
    >
</section>

<style>
    /* Balance section */
    .main-content {
        text-align: left;
        margin: 18px 2px;
        padding-top: 120px;
    }

    p {
        text-align: center;
    }

    .large-text {
        font-size: 15px;
    }
</style>

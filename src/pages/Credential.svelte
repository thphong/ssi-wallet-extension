<script lang="ts">
    import PageHeader from "../components/PageHeader.svelte";
    import CredentialList from "./CredentialList.svelte";
    import { onMount } from "svelte";
    import { ROUTES } from "../types/enums";
    export let route: string;

    let credentials: any[] = [];

    onMount(async () => {
        credentials = [];
    });
</script>

<section class="main-content">
    <button
        class="primary"
        on:click={() => {
            route = ROUTES.CREDENTIAL_CREATE;
        }}>Create Credential</button
    >
    <PageHeader pageTitle="Credentials"></PageHeader>
    <CredentialList {credentials} /><PageHeader pageTitle="Credentials"
    ></PageHeader>
    <CredentialList {credentials} />
</section>

<style>
    /* Balance section */
    .main-content {
        text-align: left;
        margin: 18px 2px;
    }
</style>

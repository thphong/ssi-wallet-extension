<script lang="ts">
    import PageHeader from "../components/PageHeader.svelte";
    import CredentialList from "./CredentialList.svelte";
    import { ROUTES } from "../types/enums";
    import {
        listOwnCredentials,
        listDeliveryCredentials,
        getOwnCredentials,
        getDeliveryCredentials,
    } from "../did-interfaces/credential";
    import { currentUser } from "../did-interfaces/users";
    export let route: string;

    currentUser.subscribe((user) => {
        if (user) {
            getOwnCredentials(user.did);
            getDeliveryCredentials(user.did);
        }
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
    <CredentialList credentials={$listOwnCredentials} /><PageHeader
        pageTitle="Credentials"
    ></PageHeader>
    <CredentialList credentials={$listDeliveryCredentials} />
</section>

<style>
    /* Balance section */
    .main-content {
        text-align: left;
        margin: 18px 2px;
    }
</style>

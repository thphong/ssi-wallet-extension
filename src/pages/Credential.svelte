<script lang="ts">
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
    <div class="list-hear">Credentials You Have</div>
    <CredentialList credentials={$listOwnCredentials} />
    <div class="list-header">Credentials You Issue</div>
    <CredentialList credentials={$listDeliveryCredentials} />
</section>

<style>
    /* Balance section */
    .main-content {
        text-align: left;
        margin: 18px 2px;
    }

    .list-header {
        font-size: 14px;
        padding: 10px 5px 10px 5px;
    }
</style>

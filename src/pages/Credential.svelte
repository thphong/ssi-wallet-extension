<script lang="ts">
    import CredentialList from "./CredentialList.svelte";
    import CredentialNew from "./CredentialNew.svelte";
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

{#if route == ROUTES.CREDENTIAL}
    <section class="main-content">
        <button
            class="primary"
            on:click={() => {
                route = ROUTES.CREDENTIAL_CREATE;
            }}>Create Credential</button
        >
        <div class="list-header">Credentials You Have</div>
        <CredentialList credentials={$listOwnCredentials} />
        <div class="list-header">Credentials You Issue</div>
        <CredentialList credentials={$listDeliveryCredentials} />
    </section>
{:else if route == ROUTES.CREDENTIAL_CREATE}
    <CredentialNew bind:route></CredentialNew>
{/if}

<style>
    /* Balance section */
    .main-content {
        text-align: left;
        margin: 18px 2px;
    }
</style>

<script lang="ts">
    import CredentialList from "./CredentialList.svelte";
    import { ROUTES } from "../types/enums";
    import {
        listOwnCredentials,
        getOwnCredentials,
    } from "../did-interfaces/credential";
    import { currentUser } from "../did-interfaces/users";
    export let route: string;

    currentUser.subscribe((user) => {
        if (user) {
            getOwnCredentials(user.did);
        }
    });
</script>

<section class="main-content">
    <button
        class="primary"
        on:click={() => {
            route = ROUTES.CREDENTIAL_CREATE;
        }}>Make Presentation</button
    >
    <div class="list-header">
        Select credentials you want to make a presentation
    </div>
    <CredentialList credentials={$listOwnCredentials} />
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

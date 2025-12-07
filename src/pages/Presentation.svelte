<script lang="ts">
    import CredentialList from "./CredentialList.svelte";
    import PresentationNew from "./PresentationNew.svelte";
    import { ROUTES } from "../types/enums";
    import {
        listOwnCredentials,
        getOwnCredentials,
    } from "../did-interfaces/credential";
    import { currentUser } from "../did-interfaces/users";
    import { type VC } from "did-core-sdk";

    export let route: string;

    let selectedVCs: VC[] = [];
    let maxIndex = 1;

    currentUser.subscribe((user) => {
        if (user) {
            getOwnCredentials(user.did);
        }
    });
</script>

{#if route == ROUTES.PRESENTATION}
    <section class="main-content">
        <button
            class="primary"
            disabled={selectedVCs.length == 0}
            on:click={() => {
                route = ROUTES.PRESENTATION_CREATE;
            }}>Make Presentation</button
        >
        <div class="list-header">Select credentials to make a presentation</div>
        <CredentialList
            credentials={$listOwnCredentials}
            bind:selectedVCs
            needSelection={true}
            bind:maxIndex
        />
    </section>
{:else if route == ROUTES.PRESENTATION_CREATE}
    <PresentationNew bind:route bind:selectedVCs></PresentationNew>
{/if}

<style>
    /* Balance section */
    .main-content {
        text-align: left;
        margin: 18px 2px;
    }
</style>

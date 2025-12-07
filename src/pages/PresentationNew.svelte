<script lang="ts">
    import TextInput from "../components/TextInput.svelte";
    import PageHeader from "../components/PageHeader.svelte";
    import CredentialList from "./CredentialList.svelte";
    import { ROUTES } from "../types/enums";
    import { createVP } from "did-core-sdk";
    import { currentUser } from "../did-interfaces/users";
    import { loadPrivateKey } from "../did-interfaces/encrypt";
    import { addPresentation } from "../did-interfaces/presentation";
    import { getOwnCredentials } from "../did-interfaces/credential";
    import { getPassword } from "../did-interfaces/session";
    import { downloadJSON } from "../libs/utils";

    export let route: string;
    export let selectedVCs: any[] = [];

    let nonce = "";
    let holderDid = "";

    currentUser.subscribe((user) => {
        if (user) {
            holderDid = user.did;
        }
    });

    let submitting = false;

    $: isValidForm = nonce.trim().length > 0;

    async function onCreatePresentation() {
        if (!isValidForm) return;
        submitting = true;
        const pk = await loadPrivateKey(holderDid, getPassword(holderDid));
        const vcs = selectedVCs.map(({ selected, ...rest }) => rest);
        const vp = await createVP(vcs, holderDid, pk, nonce);
        await addPresentation(holderDid, vp);
        selectedVCs = [];
        downloadJSON(vp, "presentation.json");
        await getOwnCredentials(holderDid);
        route = ROUTES.PRESENTATION;
    }
</script>

<PageHeader
    bind:route
    routeBack={ROUTES.PRESENTATION}
    pageTitle="New Presentation"
></PageHeader>
<div>
    <TextInput
        bind:value={nonce}
        label={"Nonce"}
        sublabel={"Random string which is provided by verifier"}
        placeholder={"Enter nonce"}
        readonlyCon={submitting}
    ></TextInput>

    <div class="form-buttons">
        <button
            class="primary"
            disabled={!isValidForm || submitting}
            on:click={onCreatePresentation}
        >
            {submitting ? "Creating…" : "Finish"}
        </button>
    </div>
</div>
<div class="list-header">Credentials You Selected:</div>
<CredentialList credentials={selectedVCs} maxIndex={selectedVCs.length} />

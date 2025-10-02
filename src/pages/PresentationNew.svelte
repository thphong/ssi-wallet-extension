<script lang="ts">
    import TextInput from "../components/TextInput.svelte";
    import PageHeader from "../components/PageHeader.svelte";
    import CredentialList from "./CredentialList.svelte";
    import { ROUTES } from "../types/enums";
    import { createVP, type VC } from "did-core-sdk";
    import { currentUser } from "../did-interfaces/users";
    import { loadPrivateKey } from "../did-interfaces/encrypt";
    import { addPresentation } from "../did-interfaces/presentation";
    import { getOwnCredentials } from "../did-interfaces/credential";

    export let route: string;
    export let selectedVCs: VC[] = [];

    let password = "";
    let nonce = "";
    let holderDid = "";

    currentUser.subscribe((user) => {
        if (user) {
            holderDid = user.did;
        }
    });

    let submitting = false;
    let IsValidPassword = true;

    $: isValidForm = nonce.trim().length > 0 && IsValidPassword;

    async function onCheckPassword() {
        if (!password) {
            IsValidPassword = false;
            return;
        }
        try {
            const pk = await loadPrivateKey(holderDid, password);
            if (pk) {
                IsValidPassword = true;
            } else {
                IsValidPassword = false;
            }
        } catch {
            IsValidPassword = false;
        }
    }

    async function onCreateCredential() {
        if (!isValidForm) return;
        submitting = true;
        const pk = await loadPrivateKey(holderDid, password);
        const vp = await createVP(selectedVCs, holderDid, pk, nonce);
        await addPresentation(holderDid, vp);
        selectedVCs = [];
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

    <TextInput
        bind:value={password}
        label={"Pasword"}
        sublabel={"Pasword to load your private key to sign credential"}
        placeholder={"Your password"}
        readonlyCon={submitting}
        type="password"
        on:change={onCheckPassword}
        errorMessage={!IsValidPassword ? "password is not valid" : ""}
    ></TextInput>

    <div class="form-buttons">
        <button
            class="primary"
            disabled={!isValidForm || submitting}
            on:click={onCreateCredential}
        >
            {submitting ? "Creating…" : "Finish"}
        </button>
    </div>
</div>
<div class="list-header">Credentials You Selected:</div>
<CredentialList credentials={selectedVCs} maxIndex={selectedVCs.length} />

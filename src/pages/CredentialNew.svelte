<script lang="ts">
    import TextInput from "../components/TextInput.svelte";
    import PageHeader from "../components/PageHeader.svelte";
    import { ROUTES } from "../types/enums";
    import { createVC } from "did-core-sdk";
    import { currentUser } from "../did-interfaces/users";

    export let route: string;

    let dataInput = {
        issuer: "",
        subject: "",
        expirationDate: "",
        credentialSubject: `{
            roles: {
                READ_BANK_ACCOUNT: "Allow to read account balance",
                MAKE_TRANSACTION: "Allow to make a transaction",
            },
        }`,
    };

    currentUser.subscribe((user) => {
        if (user) {
            dataInput.issuer = user.did;
        }
    });

    let submitting = false;

    $: isValidForm =
        dataInput.subject.trim().length > 0 && dataInput.credentialSubject;

    async function onCreateCredential() {
        if (!isValidForm) return;
        submitting = true;
        route = ROUTES.HOME;
    }
</script>

<PageHeader bind:route routeBack={ROUTES.CREDENTIAL} pageTitle="New Credential"
></PageHeader>
<div>
    <TextInput
        bind:value={dataInput.subject}
        label={"Subject"}
        sublabel={"DID of the credential recipient"}
        placeholder={"Enter Subject"}
        readonlyCon={submitting}
    ></TextInput>

    <TextInput
        bind:value={dataInput.expirationDate}
        label={"Expiration Date"}
        sublabel={"Credential valid until"}
        placeholder={"Select Expired Date"}
        readonlyCon={submitting}
    ></TextInput>

    <TextInput
        bind:value={dataInput.credentialSubject}
        label={"Credential Subject"}
        sublabel={"Credential Subject in JSON format"}
        placeholder={"Enter Credential Subject"}
        readonlyCon={submitting}
        type="textarea"
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

<script lang="ts">
    import TextInput from "../components/TextInput.svelte";
    import DatePicker from "../components/DatePicker.svelte";
    import JsonEditor from "../components/JsonEditor.svelte";
    import PageHeader from "../components/PageHeader.svelte";
    import { ROUTES } from "../types/enums";
    import { createVC, resolveDid } from "did-core-sdk";
    import { currentUser } from "../did-interfaces/users";

    export let route: string;

    let dataInput = {
        issuer: "",
        subject: "",
        expirationDate: "",
        credentialSubject: {},
        jsonValue: {
            json: {},
            text: undefined,
        },
    };

    currentUser.subscribe((user) => {
        if (user) {
            dataInput.issuer = user.did;
        }
    });

    let submitting = false;

    $: isValidForm =
        dataInput.subject.trim().length > 0 &&
        dataInput.jsonValue.json &&
        JSON.stringify(dataInput.jsonValue.json) != "{}";

    let IsValidDid = true;

    async function onCheckDid() {
        if (!dataInput.subject) {
            IsValidDid = false;
            return;
        }
        try {
            const res = await resolveDid(dataInput.subject, {
                protocol: "http",
            });
            if (res) {
                IsValidDid = true;
            } else {
                IsValidDid = false;
            }
        } catch {
            IsValidDid = false;
        }
    }

    async function onCreateCredential() {
        if (!isValidForm) return;
        dataInput.credentialSubject = dataInput.jsonValue.json;
        submitting = true;
        //route = ROUTES.HOME;
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
        on:change={onCheckDid}
        errorMessage={!IsValidDid ? "did is not valid, can't resolve" : ""}
    ></TextInput>

    <DatePicker
        bind:value={dataInput.expirationDate}
        label={"Expiration Date"}
        sublabel={"Credential valid until"}
        placeholder={"Select Expired Date"}
        readonlyCon={submitting}
    ></DatePicker>

    <JsonEditor
        bind:value={dataInput.jsonValue}
        label={"Credential Subject"}
        sublabel={"Credential Subject in JSON format"}
        readonlyCon={submitting}
    ></JsonEditor>

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

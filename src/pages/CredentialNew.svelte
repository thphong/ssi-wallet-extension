<script lang="ts">
    import TextInput from "../components/TextInput.svelte";
    import DatePicker from "../components/DatePicker.svelte";
    import JsonEditor from "../components/JsonEditor.svelte";
    import PageHeader from "../components/PageHeader.svelte";
    import { ROUTES } from "../types/enums";
    import { createVC, resolveDid } from "did-core-sdk";
    import { currentUser } from "../did-interfaces/users";
    import { loadPrivateKey } from "../did-interfaces/encrypt";
    import { addDeliveryCredential } from "../did-interfaces/credential";

    export let route: string;

    let dataInput: any = {
        issuer: "",
        subject: "",
        expirationDate: "",
        credentialSubject: {},
        jsonValue: {
            json: {},
            text: undefined,
        },
    };
    let password = "";

    currentUser.subscribe((user) => {
        if (user) {
            dataInput.issuer = user.did;
        }
    });

    let submitting = false;
    let IsValidDid = true;
    let IsValidPassword = true;

    $: isValidForm =
        dataInput.subject.trim().length > 0 &&
        IsValidDid &&
        IsValidPassword &&
        dataInput.jsonValue.json &&
        JSON.stringify(dataInput.jsonValue.json) != "{}";

    async function onCheckDid() {
        if (!dataInput.subject) {
            IsValidDid = false;
            return;
        }
        try {
            const res = await resolveDid(dataInput.subject);
            if (res) {
                IsValidDid = true;
            } else {
                IsValidDid = false;
            }
        } catch {
            IsValidDid = false;
        }
    }

    async function onCheckPassword() {
        if (!password) {
            IsValidPassword = false;
            return;
        }
        try {
            const pk = await loadPrivateKey(dataInput.issuer, password);
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
        dataInput.credentialSubject = dataInput.jsonValue.json;
        submitting = true;
        const pk = await loadPrivateKey(dataInput.issuer, password);
        const vc = await createVC(dataInput, pk);
        await addDeliveryCredential(dataInput.issuer, vc);
        route = ROUTES.CREDENTIAL;
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

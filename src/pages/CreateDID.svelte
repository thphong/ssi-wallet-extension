<script lang="ts">
    import TextInput from "../components/TextInput.svelte";
    import Select from "../components/Select.svelte";
    import PageHeader from "../components/PageHeader.svelte";
    import { type UserInput } from "../types/types";
    import { ROUTES } from "../types/enums";
    import { createUser } from "../did-interfaces/users";
    import { didWeb } from "did-core-sdk";
    import {} from "../did-interfaces/iota";

    export let route: string;

    let dataInput: UserInput = {
        name: "",
        didType: "blockchain",
        didWeb: "",
    };
    let password = "";
    let rePassword = "";
    let submitting = false;
    let isWebDidValid = true;
    let isCheckingDid = false;

    $: isValidUserInfo =
        dataInput.name.trim().length > 0 &&
        (dataInput.didType != "web" ||
            (dataInput.didType == "web" &&
                dataInput.didWeb.trim().length > 0 &&
                isWebDidValid &&
                !isCheckingDid));

    $: isValidForm =
        isValidUserInfo && password == rePassword && !!password && !!rePassword;

    async function onNextStep() {
        if (!isValidUserInfo) return;
        route = ROUTES.CREATE_USER_2;
    }

    async function onCreateUser() {
        if (!isValidForm) return;
        submitting = true;
        await createUser(dataInput, password);
        route = ROUTES.HOME;
    }

    async function onCheckWebDid() {
        isWebDidValid = true;
        isCheckingDid = true;
        try {
            const didDocument = await didWeb.resolve(dataInput.didWeb);
            if (didDocument) {
                isWebDidValid = true;
            }
        } catch {
            isWebDidValid = false;
        } finally {
            isCheckingDid = false;
        }
    }
</script>

{#if route == ROUTES.CREATE_USER_1}
    <PageHeader bind:route routeBack={ROUTES.HOME} pageTitle="Create New DID"
    ></PageHeader>
    <div>
        <TextInput
            bind:value={dataInput.name}
            label={"Display Name"}
            sublabel={"Shown in your wallet"}
            placeholder={"e.g., your nickname"}
            readonlyCon={submitting}
            maxlength={50}
        ></TextInput>

        <Select
            bind:value={dataInput.didType}
            label={"DID Type"}
            sublabel={"Choose how the DID is anchored"}
            readonlyCon={submitting}
            options={[
                { value: "key", name: "Key (did:key)" },
                { value: "web", name: "Web (did:web)" },
                { value: "blockchain", name: "Blockchain (did:iota)" },
            ]}
        ></Select>

        {#if dataInput.didType == "web"}
            <TextInput
                bind:value={dataInput.didWeb}
                label={"Web Did"}
                sublabel={"Your web did to resolve"}
                placeholder={"e.g., did:web:yourorg.vn"}
                readonlyCon={submitting}
                on:change={onCheckWebDid}
                errorMessage={!isWebDidValid &&
                dataInput.didWeb.trim().length > 0
                    ? "Can't resolve your web did"
                    : ""}
            ></TextInput>
        {/if}

        <div class="form-buttons">
            <button
                class="primary"
                disabled={!isValidUserInfo || submitting}
                on:click={onNextStep}
            >
                {submitting ? "Creating…" : "Create"}
            </button>
        </div>
    </div>
{:else if route == ROUTES.CREATE_USER_2}
    <PageHeader
        bind:route
        routeBack={ROUTES.CREATE_USER_1}
        pageTitle="Set Password"
    ></PageHeader>
    <div>
        <TextInput
            bind:value={password}
            label={"Pasword"}
            sublabel={"Pasword to encrypt your data in your wallet"}
            placeholder={"Your password"}
            readonlyCon={submitting}
            type="password"
        ></TextInput>

        <TextInput
            bind:value={rePassword}
            label={"Repeat Password"}
            sublabel={"Repeat your password to make sure you use correct one"}
            placeholder={"Repeat your password"}
            readonlyCon={submitting}
            type="password"
            errorMessage={!!rePassword && !!password && rePassword != password
                ? "Your passwords are not matched"
                : ""}
        ></TextInput>

        <div class="form-buttons">
            <button
                class="primary"
                disabled={!isValidForm || submitting}
                on:click={onCreateUser}
            >
                {submitting ? "Creating…" : "Finish"}
            </button>
        </div>
    </div>
{/if}

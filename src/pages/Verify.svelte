<script lang="ts">
    import PageHeader from "../components/PageHeader.svelte";
    import File from "../components/File.svelte";
    import TextInput from "../components/TextInput.svelte";
    import JsonViewer from "../components/JsonViewer.svelte";
    import { verifyVP } from "did-core-sdk";

    const emptyObject = {};
    let fileContent: any = emptyObject;
    let nonce: string = "";
    let submitting = false;
    let errorMessage = "";
    let verifiedResult: any;

    $: isValidForm =
        nonce.length > 0 && !!fileContent && fileContent != emptyObject;

    async function onVerify() {
        if (!isValidForm) return;
        submitting = true;
        try {
            verifiedResult = await verifyVP(fileContent, nonce);
            errorMessage = "";
        } catch (error: any) {
            errorMessage = error.message;
        } finally {
            submitting = false;
        }
    }
</script>

<PageHeader pageTitle="Verify Presentation"></PageHeader>
<div>
    <File
        bind:value={fileContent}
        label={"Presenation"}
        sublabel={"Json file is provided by holder"}
        placeholder={"e.g., presenation"}
        readonlyCon={submitting}
        errorMessage={!fileContent ? "File is not json object" : ""}
    ></File>
    <TextInput
        bind:value={nonce}
        label={"Nonce"}
        sublabel={"Random string which is used to generate presentation"}
        placeholder={"Enter nonce"}
        readonlyCon={submitting}
    ></TextInput>
    <div class="form-buttons">
        <button
            class="primary"
            disabled={!isValidForm || submitting}
            on:click={onVerify}
        >
            {submitting ? "Verifying…" : "Verify"}
        </button>
    </div>
    {#if errorMessage}
        <div class="verify-result">
            <img src="/assets/error.png" alt="error" class="res-icon" />
            <div class="error-message">
                {errorMessage}
            </div>
        </div>
    {:else if verifiedResult}
        <div class="verify-result">
            <img src="/assets/check.png" alt="sucess" class="res-icon" />
        </div>
        <div class="break-text">
            <JsonViewer data={verifiedResult} collapsedAt={0} />
        </div>
    {/if}
</div>

<style>
    .verify-result {
        margin-top: -10px;
        text-align: center;
    }
</style>

<script lang="ts">
  import CredentialList from "./CredentialList.svelte";
  import CredentialNew from "./CredentialNew.svelte";
  import { ROUTES } from "../types/enums";
  import {
    listOwnCredentials,
    listDeliveryCredentials,
    getOwnCredentials,
    getDeliveryCredentials,
    addOwnCredential,
  } from "../did-interfaces/credential";
  import { currentUser } from "../did-interfaces/users";
  import File from "../components/File.svelte";
  import { verifyVC } from "did-core-sdk";
  export let route: string;
  const emptyObject = {};
  let fileContent: any = emptyObject;
  let did = "";
  let errorMessage = "";
  let sucessMessage = "";

  currentUser.subscribe((user) => {
    if (user) {
      getOwnCredentials(user.did);
      getDeliveryCredentials(user.did);
      did = user.did;
    }
  });

  async function importCredential() {
    errorMessage = "";
    sucessMessage = "";
    try {
      if (!fileContent) {
        throw new Error("File is not json object");
      }
      const ok = await verifyVC(fileContent);
      if (!ok) {
        throw new Error("Credential is not valid");
      }
      if (fileContent.subject != did) {
        throw new Error("This credential is not issued to you");
      }
      await addOwnCredential(did, fileContent);
      sucessMessage = "Credential is imported sucessfully";
    } catch (error: any) {
      errorMessage = error.message;
    }
  }
</script>

{#if route == ROUTES.CREDENTIAL}
  <section class="main-content">
    <button
      class="primary margin-5"
      on:click={() => {
        route = ROUTES.CREDENTIAL_CREATE;
      }}>Issue Credential</button
    >
    <File
      bind:value={fileContent}
      label={"Import Credential"}
      sublabel={"Credential json file is issued by issuer"}
      placeholder={"e.g., credential"}
      {errorMessage}
      {sucessMessage}
      on:change={importCredential}
    ></File>
    <div class="list-header margin--15">Credentials You Have</div>
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

  .margin-5 {
    margin-top: 5px;
  }

  .margin--15 {
    margin-top: -15px;
  }
</style>

<script lang="ts">
  import TextInput from "../components/TextInput.svelte";
  import DatePicker from "../components/DatePicker.svelte";
  import JsonEditor from "../components/JsonEditor.svelte";
  import PageHeader from "../components/PageHeader.svelte";
  import CredentialList from "./CredentialList.svelte";
  import { ROUTES } from "../types/enums";
  import { createVC, resolveDid, createDelegatedVC } from "did-core-sdk";
  import { currentUser } from "../did-interfaces/users";
  import { loadPrivateKey } from "../did-interfaces/encrypt";
  import { getPassword } from "../did-interfaces/session";
  import {
    addDeliveryCredential,
    listOwnCredentials,
    getCurrentIdexCredentials,
    setCurrentIdexCredentials,
  } from "../did-interfaces/credential";

  export let route: string;
  let delegateVC: any[];

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

  currentUser.subscribe((user) => {
    if (user) {
      dataInput.issuer = user.did;
    }
  });

  let submitting = false;
  let IsValidDid = true;

  $: isValidForm =
    dataInput.subject.trim().length > 0 &&
    IsValidDid &&
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

  async function onCreateCredential() {
    if (!isValidForm) return;
    dataInput.credentialSubject = dataInput.jsonValue.json;
    submitting = true;
    const pk = await loadPrivateKey(
      dataInput.issuer,
      getPassword(dataInput.issuer),
    );
    const currentIndex = await getCurrentIdexCredentials(dataInput.issuer);

    if (delegateVC.length > 0) {
      const { selected, ...parentVC } = delegateVC[0];
      const delegatedVC = await createDelegatedVC(
        parentVC,
        dataInput.subject,
        dataInput.credentialSubject,
        pk,
        dataInput.expirationDate,
        currentIndex,
      );
      await addDeliveryCredential(dataInput.issuer, delegatedVC);
    } else {
      dataInput.revocationBitmapIndex = currentIndex;
      const vc = await createVC(dataInput, pk);
      await addDeliveryCredential(dataInput.issuer, vc);
    }
    await setCurrentIdexCredentials(dataInput.issuer);

    route = ROUTES.CREDENTIAL;
  }

  async function onSelectDelegateVC() {
    if (delegateVC.length > 0) {
      const { id, ...credentialSubject } = delegateVC[0].credentialSubject;
      dataInput.jsonValue = {
        json: credentialSubject,
      };
    }
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
  <div class="list-header margin--10">
    Delegate Credential
    {#if delegateVC?.length > 0}
      (Yes)
    {/if}
  </div>
  <CredentialList
    credentials={$listOwnCredentials}
    needSelection={true}
    singleSelection={true}
    bind:selectedVCs={delegateVC}
    on:change={onSelectDelegateVC}
  />
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

<style>
  .margin--10 {
    margin-top: -10px;
  }
</style>

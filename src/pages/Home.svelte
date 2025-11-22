<script lang="ts">
  import { type DidDocument } from "did-core-sdk";
  import QrDid from "../components/QrDid.svelte";
  import {
    currentUser,
    getPublicKey,
    getDidDoc,
  } from "../did-interfaces/users";
  import JsonCard from "../components/JsonCard.svelte";

  let did = "";
  let publicKey: JsonWebKey | undefined;
  let didDoc: DidDocument | undefined;

  currentUser.subscribe(async (user) => {
    if (user) {
      did = user.did;
      publicKey = await getPublicKey(did);
      didDoc = await getDidDoc(did);
    }
  });
</script>

<!-- quick actions -->
<section class="main-content">
  <div class="list-header">Your did:</div>
  <QrDid {did} />
  <div class="list-header">Your public key:</div>
  <JsonCard
    dataDisplay={publicKey}
    dataContent={publicKey}
    collapsedAt={-1}
    downloadFilename={"public-key.json"}
  ></JsonCard>
  <div class="list-header">Your did document:</div>
  <JsonCard
    dataDisplay={didDoc}
    dataContent={didDoc}
    collapsedAt={-1}
    downloadFilename={"DID-document.json"}
  ></JsonCard>
</section>

<style>
  /* Balance section */
  .main-content {
    text-align: left;
    margin: 18px 2px;
  }
</style>

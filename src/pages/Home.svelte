<script lang="ts">
    import JsonViewer from "../components/JsonViewer.svelte";
    import { type DidDocument } from "did-core-sdk";
    import QrDid from "../components/QrDid.svelte";
    import {
        currentUser,
        getPublicKey,
        getDidDoc,
    } from "../did-interfaces/users";

    let did = "";
    let privateKey: JsonWebKey | undefined;
    let didDoc: DidDocument | undefined;

    currentUser.subscribe(async (user) => {
        if (user) {
            did = user.did;
            privateKey = await getPublicKey(did);
            didDoc = await getDidDoc(did);
        }
    });
</script>

<!-- quick actions -->
<section class="main-content">
    <QrDid {did} />
    <div class="list-header">Your public key</div>
    <div class="result-object">
        <JsonViewer data={privateKey} collapsedAt={0} />
    </div>

    <div class="list-header">Your did document</div>
    <div class="result-object">
        <JsonViewer data={didDoc} collapsedAt={0} />
    </div>
</section>

<style>
    /* Balance section */
    .main-content {
        text-align: left;
        margin: 18px 2px;
    }

    .result-object {
        white-space: pre-wrap; /* keep indentation but allow wrapping */
        overflow-wrap: anywhere; /* break very long tokens (e.g., JWS) */
        word-break: break-word; /* fallback for older browsers */
        line-break: anywhere;
        border: 1px solid #d1d5db;
        border-radius: 10px;
        padding: 0.75rem;
        /* margin-bottom: 0.75rem; */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
</style>

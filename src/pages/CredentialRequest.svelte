<script lang="ts">
    import PageHeader from "../components/PageHeader.svelte";
    import TextInput from "../components/TextInput.svelte";
    import { ROUTES } from "../types/enums";
    import API from "../api/Interceptor";
    import {
        encrypt,
        decrypt,
        sign,
        jsonToArrayBuffer,
        resolveDid,
        arrBuftobase64u,
    } from "did-core-sdk";
    import { currentUser, getPublicKey } from "../did-interfaces/users";
    import { loadPrivateKey } from "../did-interfaces/encrypt";
    import { addOwnCredential } from "../did-interfaces/credential";
    import { getPassword } from "../did-interfaces/session";

    export let route: string;
    let submitting = false;
    let IsValidDid = true;
    let userDid: string;
    let userPublicKey: JsonWebKey | undefined;
    let issuerPublicKey = "";
    let hasInitValue = false;

    let dataInput: any = {
        issuer: "",
        api_vc_nonce: "",
        api_vc_request: "",
    };

    let errorMessage = "";

    currentUser.subscribe(async (user) => {
        if (user) {
            userDid = user.did;
            userPublicKey = await getPublicKey(user.did);
        }
    });

    $: isValidForm =
        dataInput.issuer.trim().length > 0 &&
        IsValidDid &&
        dataInput.api_vc_nonce.trim().length > 0 &&
        dataInput.api_vc_request.trim().length > 0;

    async function onCheckDid() {
        if (!dataInput.issuer) {
            IsValidDid = false;
            return;
        }
        try {
            const res = await resolveDid(dataInput.issuer);
            if (res && res?.verificationMethod) {
                issuerPublicKey =
                    res?.verificationMethod[0]?.publicKeyJwk?.x || "";
                IsValidDid = true;
            } else {
                IsValidDid = false;
            }
        } catch {
            IsValidDid = false;
        }
    }

    async function loadPayload() {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage("popup_get_payload", (res) => {
                resolve(res);
            });
        });
    }

    async function init() {
        //Get api url from web
        const res: any = await loadPayload();
        const payload = res?.payload;
        if (payload) {
            dataInput.issuer = payload.issuer;
            dataInput.api_vc_nonce = payload.api_vc_nonce;
            dataInput.api_vc_request = payload.api_vc_request;
            hasInitValue = true;
        }
    }

    async function onRequestCredential() {
        if (!isValidForm) return;
        submitting = true;

        const didDocument = await resolveDid(dataInput.issuer);

        if (!didDocument || !didDocument?.verificationMethod) {
            console.error("didDocument is null");
            submitting = false;
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        issuerPublicKey =
            didDocument?.verificationMethod[0]?.publicKeyJwk?.x || "";

        const requestMessage = await encrypt(issuerPublicKey, {
            didReq: userDid,
            pkReq: userPublicKey?.x,
        });

        const nonceRes = await API.post(dataInput.api_vc_nonce, {
            msg: requestMessage,
        });

        if (nonceRes.error) {
            errorMessage = nonceRes.error;
            submitting = false;
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        const resMsg = nonceRes.resMsg;

        const userPrivateKey = await loadPrivateKey(
            userDid,
            getPassword(userDid),
        );
        if (!userPrivateKey || !userPrivateKey.x || !userPrivateKey.d) {
            throw new Error("Private key is invalid");
        }
        const decryptedMesage = await decrypt(
            userPrivateKey.x,
            userPrivateKey.d,
            resMsg,
        );

        //send request
        if (decryptedMesage.didReq == userDid) {
            const signReq = await sign(
                jsonToArrayBuffer({
                    didReq: userDid,
                    nonce: decryptedMesage.nonce,
                }),
                userPrivateKey,
            );

            const requestMessage = await encrypt(issuerPublicKey, {
                didReq: userDid,
                nonce: decryptedMesage.nonce,
                signReq: arrBuftobase64u(signReq),
            });

            const vcRes = await API.post(dataInput.api_vc_request, {
                msg: requestMessage,
            });

            if (vcRes.error) {
                errorMessage = vcRes.error;
                submitting = false;
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }

            const vc = vcRes.vc;

            if (vc) {
                await addOwnCredential(userDid, vc);
            }
        }

        route = ROUTES.CREDENTIAL;
    }

    init();
</script>

<PageHeader
    bind:route
    routeBack={ROUTES.CREDENTIAL}
    pageTitle="Request Credential"
></PageHeader>
<div>
    {#if errorMessage}
        <div class="error-message">
            {errorMessage}
        </div>
    {/if}
    <TextInput
        bind:value={dataInput.issuer}
        label={"Issuer"}
        sublabel={"DID of the credential issuer"}
        placeholder={"Enter Issuer"}
        readonlyCon={submitting || hasInitValue}
        on:change={onCheckDid}
        errorMessage={!IsValidDid ? "did is not valid, can't resolve" : ""}
    ></TextInput>
    <TextInput
        bind:value={dataInput.api_vc_nonce}
        label={"Nonce URL"}
        sublabel={"Url to get nonce for vc issuance"}
        placeholder={"Enter url"}
        readonlyCon={submitting || hasInitValue}
    ></TextInput>
    <TextInput
        bind:value={dataInput.api_vc_request}
        label={"VC Request URL"}
        sublabel={"Url to get VC"}
        placeholder={"Enter url"}
        readonlyCon={submitting || hasInitValue}
    ></TextInput>
    <div class="form-buttons">
        <button
            class="primary"
            disabled={!isValidForm || submitting}
            on:click={onRequestCredential}
        >
            {submitting ? "Request…" : "Finish"}
        </button>
    </div>
</div>

<style>
</style>

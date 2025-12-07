<script lang="ts">
    import PageHeader from "../components/PageHeader.svelte";
    import TextInput from "../components/TextInput.svelte";
    import { ROUTES } from "../types/enums";
    import API from "../api/Interceptor";
    import { encrypt, decrypt, sign, jsonToArrayBuffer } from "did-core-sdk";
    import { currentUser, getPublicKey } from "../did-interfaces/users";
    import { loadPrivateKey } from "../did-interfaces/encrypt";
    import { addOwnCredential } from "../did-interfaces/credential";
    import { getPassword } from "../did-interfaces/session";

    export let route: string;
    let submitting = false;
    let userDid: string;
    let userPublicKey: JsonWebKey | undefined;
    const issuerPublicKey = "TO-Do";

    let dataInput: any = {
        url_nonce: "",
        url_request: "",
    };

    currentUser.subscribe(async (user) => {
        if (user) {
            userDid = user.did;
            userPublicKey = await getPublicKey(user.did);
        }
    });

    $: isValidForm =
        dataInput.url_nonce.trim().length > 0 &&
        dataInput.url_request.trim().length > 0;

    async function onRequestCredential() {
        if (!isValidForm) return;
        submitting = true;

        const requestMessage = await encrypt(issuerPublicKey, {
            didReq: userDid,
            pkReq: userPublicKey?.x,
        });

        const resMsg = (
            await API.post(dataInput.url_nonce, {
                msg: requestMessage,
            })
        ).resMsg;

        const userPrivateKey = await loadPrivateKey(userDid, getPassword(userDid));
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
                signReq: signReq,
            });

            const vc = (
                await API.post(dataInput.url_request, {
                    msg: requestMessage,
                })
            ).vc;

            await addOwnCredential(userDid, vc);
        }

        route = ROUTES.CREDENTIAL;
    }
</script>

<PageHeader
    bind:route
    routeBack={ROUTES.CREDENTIAL}
    pageTitle="Request Credential"
></PageHeader>
<div>
    <TextInput
        bind:value={dataInput.url_nonce}
        label={"Nonce URL"}
        sublabel={"Url to get nonce for vc issuance"}
        placeholder={"Enter url"}
        readonlyCon={submitting}
    ></TextInput>
    <TextInput
        bind:value={dataInput.url_request}
        label={"VC Request URL"}
        sublabel={"Url to get VC"}
        placeholder={"Enter url"}
        readonlyCon={submitting}
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

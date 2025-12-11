<script lang="ts">
  import CredentialList from "./CredentialList.svelte";
  import { currentUser, getPublicKey } from "../did-interfaces/users";
  import {
    listOwnCredentials,
    getOwnCredentials,
  } from "../did-interfaces/credential";
  import {
    type VC,
    getPublickeyIssuerFromVC,
    encrypt,
    decrypt,
    createVP,
    resolveDid,
  } from "did-core-sdk";
  import API from "../api/Interceptor";
  import { loadPrivateKey } from "../did-interfaces/encrypt";
  import { WALLET_REQUEST_TYPE } from "../types/enums";
  import { getPassword } from "../did-interfaces/session";
  import { loader } from "../components/loader/loader";

  let userPublicKey: JsonWebKey | undefined;
  let userDid: string;

  currentUser.subscribe(async (user) => {
    if (user) {
      userDid = user.did;
      getOwnCredentials(user.did);
      userPublicKey = await getPublicKey(user.did);
    }
  });

  let selectedVCs: VC[] = [];
  let maxIndex = 3;

  let submitting = false;
  let errorMessage = "";

  $: isValidForm = selectedVCs?.length > 0;

  async function loadPayload() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage("popup_get_payload", (res) => {
        resolve(res);
      });
    });
  }

  async function handleLogin() {
    loader.showLoader();
    try {
      submitting = true;

      //Get api url from web
      const res: any = await loadPayload();
      const issuer = res.payload.issuer;

      const didDocument = await resolveDid(issuer);
      let nonce_endpoint = "";
      let authorization_endpoint = "";
      if (didDocument) {
        const serviceVC: any = didDocument.service?.find(
          (item) => item.type.indexOf("OpenID4VP") >= 0,
        )?.serviceEndpoint;

        nonce_endpoint =
          serviceVC?.nonce_endpoint && serviceVC?.nonce_endpoint.length > 0
            ? serviceVC?.nonce_endpoint[0]
            : "";
        authorization_endpoint =
          serviceVC?.authorization_endpoint &&
          serviceVC?.authorization_endpoint.length > 0
            ? serviceVC?.authorization_endpoint[0]
            : "";
      }

      if (!nonce_endpoint || !authorization_endpoint) {
        errorMessage =
          "Can't find end point to get access token in issuer's DID document";
        submitting = false;
        loader.hideLoader();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const vc = selectedVCs[0];
      const {
        didSubject,
        publicKeyJwkIssuer,
        didOri,
        parentPublicKeyJwkIssuer,
      } = await getPublickeyIssuerFromVC(vc);
      const issuerPublicKey = parentPublicKeyJwkIssuer
        ? parentPublicKeyJwkIssuer
        : publicKeyJwkIssuer;
      if (!issuerPublicKey || !issuerPublicKey.x) {
        throw new Error("Verify Credential: Public key is null");
      }
      if (userDid != didSubject) {
        throw new Error("Verify Credential: This is not your Credential");
      }

      //Encrypt message
      const requestMessage = await encrypt(issuerPublicKey.x, {
        didReq: didSubject,
        didOri: didOri,
        pkReq: userPublicKey?.x,
      });

      const nonceRes = await API.post(nonce_endpoint, {
        msg: requestMessage,
      });

      if (nonceRes.error) {
        errorMessage = nonceRes.error;
        submitting = false;
        loader.hideLoader();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const resMsg = nonceRes.resMsg;
      const userPrivateKey = await loadPrivateKey(
        didSubject,
        getPassword(didSubject),
      );
      if (!userPrivateKey || !userPrivateKey.x || !userPrivateKey.d) {
        throw new Error("Private key is invalid");
      }
      const decryptedMesage = await decrypt(
        userPrivateKey.x,
        userPrivateKey.d,
        resMsg,
      );
      const vp = await createVP(
        [vc],
        didSubject,
        userPrivateKey,
        decryptedMesage.nonce,
      );
      const encryptedVP = await encrypt(issuerPublicKey.x, { vp: vp });

      const accesTokenRes = await API.post(authorization_endpoint, {
        msg: encryptedVP,
      });

      if (accesTokenRes.error) {
        errorMessage = accesTokenRes.error;
        submitting = false;
        loader.hideLoader();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      chrome.runtime.sendMessage({
        type: WALLET_REQUEST_TYPE.LOGIN_SUCCESS,
        token: accesTokenRes,
      });

      // Đóng popup sau khi login xong (cửa sổ popup)
      window.close();
    } catch (error) {
      console.error(error);
      submitting = false;
      loader.hideLoader();
      chrome.runtime.sendMessage({
        type: WALLET_REQUEST_TYPE.LOGIN_FAILED,
        error: error,
      });
    }
  }
</script>

<section class="main-content">
  {#if errorMessage}
    <div class="error-message">
      {errorMessage}
    </div>
  {/if}
  <div class="list-header margin--15">Select credentials to login</div>
  <CredentialList
    credentials={$listOwnCredentials}
    bind:selectedVCs
    needSelection={true}
    bind:maxIndex
    singleSelection={true}
  />
  <div class="form-buttons">
    <button
      class="primary"
      disabled={!isValidForm || submitting}
      on:click={handleLogin}>{submitting ? "Verifying…" : "Verify"}</button
    >
  </div>
</section>

<style>
  /* Balance section */
  .main-content {
    text-align: left;
    margin: 18px 2px;
  }

  .margin--15 {
    margin-top: -15px;
  }

  .error-message {
    padding-bottom: 10px;
  }
</style>

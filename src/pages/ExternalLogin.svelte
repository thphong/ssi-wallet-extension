<script lang="ts">
  import TextInput from "../components/TextInput.svelte";
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
  } from "did-core-sdk";
  import API from "../api/Interceptor";
  import { loadPrivateKey } from "../did-interfaces/encrypt";
  let userPublicKey: JsonWebKey | undefined;
  let password: string = "";
  let IsValidPassword = true;
  let userDid: string;

  currentUser.subscribe(async (user) => {
    if (user) {
      userDid = user.did;
      getOwnCredentials(user.did);
      userPublicKey = await getPublicKey(user.did);
    }
  });

  const LOGIN_SUCCESS = "SSI_WALLET_LOGIN_SUCCESS";
  let selectedVCs: VC[] = [];
  let maxIndex = 3;

  let submitting = false;

  $: isValidForm =
    selectedVCs?.length > 0 && password.trim().length > 0 && IsValidPassword;

  async function onCheckPassword() {
    if (!password) {
      IsValidPassword = false;
      return;
    }
    try {
      const pk = await loadPrivateKey(userDid, password);
      if (pk) {
        IsValidPassword = true;
      } else {
        IsValidPassword = false;
      }
    } catch {
      IsValidPassword = false;
    }
  }

  async function loadPayload() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage("popup_get_payload", (res) => {
        resolve(res);
      });
    });
  }

  async function handleLogin() {
    try {
      submitting = true;
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
      //Get api url from web
      const res: any = await loadPayload();
      const payload = res.payload;
      alert(payload);
      // const payload = {
      //   api_nonce: "https://sample-bank-api.onrender.com/auth/nonce",
      //   api_token: "https://sample-bank-api.onrender.com/auth/access-token",
      // };

      //Encrypt message
      const requestMessage = await encrypt(issuerPublicKey.x, {
        didReq: didSubject,
        didOri: didOri,
        pkReq: userPublicKey?.x,
      });
      const nonceRes = await API.get(payload.api_nonce, {
        msg: requestMessage,
      });
      const userPrivateKey = await loadPrivateKey(didSubject, password);
      if (!userPrivateKey || !userPrivateKey.x || !userPrivateKey.d) {
        throw new Error("Private key is invalid");
      }
      const decryptedMesage = await decrypt(
        userPrivateKey.x,
        userPrivateKey.d,
        nonceRes
      );
      const vp = await createVP(
        [vc],
        didSubject,
        userPrivateKey,
        decryptedMesage.nonce
      );
      const encryptedVP = await encrypt(issuerPublicKey.x, vp);
      const accesTokenRes = await API.get(payload.api_token, {
        msg: encryptedVP,
      });

      chrome.runtime.sendMessage({
        type: LOGIN_SUCCESS,
        token: accesTokenRes,
      });

      // Đóng popup sau khi login xong (cửa sổ popup)
      window.close();
    } catch (error) {
      chrome.runtime.sendMessage({
        type: LOGIN_FAILED,
        error: error,
      });
    }
  }
</script>

<section class="main-content">
  <TextInput
    bind:value={password}
    label={"Pasword"}
    sublabel={"Pasword to load your private key to sign presentation"}
    placeholder={"Your password"}
    readonlyCon={submitting}
    type="password"
    on:change={onCheckPassword}
    errorMessage={!IsValidPassword ? "password is not valid" : ""}
  ></TextInput>
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
</style>

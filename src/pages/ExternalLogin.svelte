<script lang="ts">
  import CredentialList from "./CredentialList.svelte";
  import { currentUser } from "../did-interfaces/users";
  import {
    listOwnCredentials,
    getOwnCredentials,
  } from "../did-interfaces/credential";
  import { type VC } from "did-core-sdk";

  currentUser.subscribe((user) => {
    if (user) {
      getOwnCredentials(user.did);
    }
  });

  const LOGIN_SUCCESS = "SSI_WALLET_LOGIN_SUCCESS";
  let selectedVCs: VC[] = [];
  let maxIndex = 3;

  async function handleLogin() {
    // TODO: thực hiện logic thật (VP/VC, ký, gọi backend...)
    const token = "mocked-ssi-token-" + Date.now();

    chrome.runtime.sendMessage(
      {
        type: LOGIN_SUCCESS,
        token,
      },
      (res) => {
        if (chrome.runtime.lastError) {
          console.error("[POPUP] sendMessage error:", chrome.runtime.lastError);
        } else {
          console.log("[POPUP] Background receievd:", res);
          // Đóng popup sau khi login xong (cửa sổ popup)
          window.close();
        }
      }
    );
  }
</script>

<section class="main-content">
  <button class="primary" on:click={handleLogin}>Login</button>
  <div class="list-header">Select credentials to login</div>
  <CredentialList
    credentials={$listOwnCredentials}
    bind:selectedVCs
    needSelection={true}
    bind:maxIndex
    singleSelection={true}
  />
</section>

<style>
  /* Balance section */
  .main-content {
    text-align: left;
    margin: 18px 2px;
  }
</style>

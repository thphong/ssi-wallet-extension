// Listen for messages from the webpage
const LOGIN_REQUEST = "SSI_WALLET_LOGIN_REQUEST";
const LOGIN_SUCCESS = "SSI_WALLET_LOGIN_SUCCESS";
const LOGIN_FAILED = "SSI_WALLET_LOGIN_FAILED";

window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || !data?.payload?.api_nonce || !data?.payload?.api_token) return;

    if (data.type === LOGIN_REQUEST) {

        //Forward to background script
        chrome.runtime.sendMessage(
            {
                type: LOGIN_REQUEST,
                payload: data.payload
            }
        );
    }
});

// 2. Nhận token từ background → gửi lại cho web
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    window.postMessage(
        {
            source: "ssi-wallet",
            type: msg.type,
            token: msg.token,
            error: msg.error
        },
        "*");
});

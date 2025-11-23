// Listen for messages from the webpage
const LOGIN_REQUEST = "SSI_WALLET_LOGIN_REQUEST";
const LOGIN_SUCCESS = "SSI_WALLET_LOGIN_SUCCESS";
const LOGIN_FAILED = "SSI_WALLET_LOGIN_FAILED";

console.log("[CONTENT] loaded at", window.location.href);

window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || !data?.payload?.api_nonce || !data?.payload?.api_token) return;

    if (data.type === LOGIN_REQUEST) {
        console.log("[CONTENT] web asks to open wallet popup");

        //Forward to background script
        chrome.runtime.sendMessage(
            {
                type: LOGIN_REQUEST,
                payload: data.payload
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("[CONTENT] sendMessage error:", chrome.runtime.lastError);
                    return;
                }
                console.log("[CONTENT] Background finish opening popup:", response);
            }
        );
    }
});

// 2. Nhận token từ background → gửi lại cho web
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log("[CONTENT] Receive token from background:", msg);
    window.postMessage(
        {
            source: "ssi-wallet",
            type: msg.type,
            token: msg.token,
            error: msg.error
        },
        "*");
});

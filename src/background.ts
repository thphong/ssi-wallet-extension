/// <reference types="chrome" />

chrome.runtime.onInstalled.addListener(() => {
    console.log('SSI Wallet Extension installed (MV3 background)');
    // Initialize extension storage or perform setup tasks
    chrome.storage.local.set({ onboarded: false });
});

// Lưu tabId đã yêu cầu login, để lát gửi token về đúng tab
let pendingLoginTabId: number | null = null;
let lastPopupTrigger: "login-flow" | "manual-click" | null = null;
let payload: any;

// Example: Listener for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    const LOGIN_REQUEST = "SSI_WALLET_LOGIN_REQUEST";
    const LOGIN_SUCCESS = "SSI_WALLET_LOGIN_SUCCESS";
    const LOGIN_FAILED = "SSI_WALLET_LOGIN_FAILED";

    console.log("[Background] listsen message", message);

    if (message === 'getVersion') {
        sendResponse({ version: chrome.runtime.getManifest().version });
    }
    else if (message.type === LOGIN_REQUEST) {

        if (sender.tab && sender.tab.id !== undefined) {
            pendingLoginTabId = sender.tab.id;
            console.log("[Background] Save pendingLoginTabId =", pendingLoginTabId);
        }
        console.log("[Background] open extension popup (browser action)");
        lastPopupTrigger = "login-flow";
        payload = message.payload;
        // MV3: chrome.action.openPopup
        chrome.action.openPopup(() => {
            if (chrome.runtime.lastError) {
                console.error("[Background] openPopup error:", chrome.runtime.lastError);
            }
        });

        sendResponse({ ok: true });
    }
    else if (message.type === LOGIN_SUCCESS) {
        console.log("[Background] Doing login...");

        if (pendingLoginTabId != null) {
            chrome.tabs.sendMessage(
                pendingLoginTabId,
                {
                    type: LOGIN_SUCCESS,
                    token: message.token
                },
                () => {
                    if (chrome.runtime.lastError) {
                        console.error(
                            "[Background] tabs.sendMessage error:",
                            chrome.runtime.lastError
                        );
                    } else {
                        console.log(
                            "[Background] Sent token to tab",
                            pendingLoginTabId
                        );
                    }
                }
            );
        } else {
            console.warn("[Background] No pendingLoginTabId To send token");
        }
    }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg === "popup_get_state") {
        sendResponse({ source: lastPopupTrigger });

        // Reset để tránh reuse state cho lần mở kế tiếp
        lastPopupTrigger = null;
    }
    else if (msg === "popup_get_payload") {
        sendResponse({ payload });
    }
});
console.log("[background] service worker running");


chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg?.type === "SSW_PONG") {
        console.log("[background] content responded:", msg, "from", sender.tab?.url);
    }
});
/// <reference types="chrome" />

chrome.runtime.onInstalled.addListener(() => {
    console.log('SSI Wallet Extension installed (MV3 background)');
    // Initialize extension storage or perform setup tasks
    chrome.storage.local.set({ onboarded: false });
});

// Example: Listener for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'getVersion') {
        sendResponse({ version: chrome.runtime.getManifest().version });
    }
});

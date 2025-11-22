import './global.css';
import App from './App.svelte';

async function loadState() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage("popup_get_state", (res) => {
            resolve(res);
        });
    });
}


async function init() {
    const state: any = await loadState();

    const target = document.getElementById('app');
    if (target) {
        new App({
            target: target,
            props: {
                popupState: state.source
            }
        });
    }
}

init();

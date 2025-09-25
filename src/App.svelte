<script lang="ts">
    import Home from "./Home.svelte";
    import Setting from "./Setting.svelte";
    import NoUser from "./NoUser.svelte";
    import { type UserInfo } from "./types/users";

    let route: string = "home";
    // Mocked wallet data (replace with real data later)
    export let userinfo: UserInfo;
    // userinfo = {
    //     displayName: "thphong",
    //     avatar: "T",
    //     did: "did:web:localhost:5173:did:phong",
    // };
    if (!userinfo) {
        route = "no-user";
    }

    async function openAsTab() {
        const url = chrome.runtime.getURL("popup.html");
        await chrome.tabs.create({ url });
        window.close();
    }
</script>

<div class="wrap">
    <!-- Header -->
    <header class="header">
        {#if userinfo}
            <div class="id">
                <div class="avatar" aria-hidden="true">
                    {userinfo?.avatar}
                </div>
                <div class="meta">
                    <div class="name">{userinfo?.displayName}</div>
                    <div class="did">{userinfo?.did}</div>
                </div>
            </div>
        {:else}
            <div class="id">
                <button class="icon-btn">
                    <img
                        src="/assets/no-profile.png"
                        alt="no-profile"
                        class="icon"
                    />
                </button>
                <div class="meta">
                    <div class="name">No account</div>
                </div>
            </div>
        {/if}
        <button
            class="icon-btn"
            on:click={() => {
                openAsTab();
            }}
        >
            <img src="/assets/expand.png" alt="settings" class="icon" />
        </button>
    </header>

    <!-- ============ HOME PAGE ============ -->

    {#if route === "home"}
        <Home></Home>
    {:else if route === "settings"}
        <Setting bind:route></Setting>
    {:else if route === "no-user"}
        <NoUser></NoUser>
    {/if}

    <!-- Bottom nav -->
    {#if userinfo}
        <nav class="tabbar" aria-label="Bottom navigation">
            <button class="tab active" title="Home">
                <img src="/assets/home.png" alt="home" class="icon" />
            </button>
            <button class="tab" title="Credential">
                <img
                    src="/assets/credential.png"
                    alt="credential"
                    class="icon"
                />
            </button>
            <button class="tab" title="Presentation">
                <img
                    src="/assets/presentation.png"
                    alt="presentation"
                    class="icon"
                />
            </button>
            <button class="tab" title="Verify">
                <img src="/assets/verify.png" alt="verify" class="icon" />
            </button>
            <button
                class="tab"
                title="Settings"
                on:click={() => {
                    route = "settings";
                }}
            >
                <img src="/assets/settings.png" alt="settings" class="icon" />
            </button>
        </nav>
    {/if}
</div>

<style>
    .wrap {
        min-width: 360px;
        width: 360px;
        min-height: 560px;
        box-sizing: border-box;
        padding: 16px 16px 84px;
        background: #fff;
        color: #111827;
        font-family:
            ui-sans-serif,
            system-ui,
            -apple-system,
            Segoe UI,
            Roboto,
            "Helvetica Neue",
            Arial,
            "Noto Sans",
            "Apple Color Emoji",
            "Segoe UI Emoji";
        border-radius: 12px;
        border: 1px solid #6aa3ff;
        margin-left: calc(50% - 180px);
        position: relative;
    }

    /* Header */
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
    }

    .id {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        color: #fff;
        display: grid;
        place-items: center;
        font-weight: 700;
        background: radial-gradient(circle at 30% 30%, #6aa3ff, #3b82f6);
    }

    .meta .name {
        font-weight: 600;
    }
    .meta .did {
        font-size: 12px;
        color: #6b7280;
    }

    /* Bottom tab bar */
    .tabbar {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 10px 16px 14px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
        background: #fff;
        border-top: 1px solid #e5e7eb;
        border-radius: 0px 0px 12px 12px;
    }
    .tab {
        height: 40px;
        width: 40px;
        margin: 0 auto;
        border-radius: 12px;
        border: none;
        background: #f3f4f6;
        cursor: pointer;
        display: grid;
        place-items: center;
        color: #6b7280;
    }
    .tab:hover {
        background: #e5e7eb;
    }
    .tab.active {
        background: #eaf1ff;
        color: #2563eb;
    }
</style>

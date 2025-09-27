<script lang="ts">
    import Home from "./pages/Home.svelte";
    import Setting from "./pages/Setting.svelte";
    import NoUser from "./pages/NoUser.svelte";
    import CreateDID from "./pages/CreateDID.svelte";
    import Credential from "./pages/Credential.svelte";
    import Presentation from "./pages/Presentation.svelte";
    import Verify from "./pages/Verify.svelte";
    import { type UserInfo } from "./types/types";
    import { ROUTES } from "./types/enums";
    import { getUsers, getCurrentUserDid } from "./did-interfaces/storage";
    import { onMount } from "svelte";
    import { stringToColor } from "./libs/utils";

    let route: string = ROUTES.HOME;
    let listUsers: UserInfo[];
    let currentUser: UserInfo | undefined;
    let showMenu = false;

    function switchUser(user: UserInfo) {
        currentUser = user;
        showMenu = false;
    }

    async function openAsTab() {
        const url = chrome.runtime.getURL("popup.html");
        await chrome.tabs.create({ url });
        window.close();
    }

    function openTab(tab: string) {
        route = tab;
    }

    onMount(async () => {
        listUsers = await getUsers();
        const currentDid = await getCurrentUserDid();
        if (listUsers?.length > 0) {
            currentUser = listUsers.find((item) => item.did == currentDid);
            if (!currentUser) {
                currentUser = listUsers[0];
            }
        }
    });
</script>

<div class="wrap">
    <!-- Header -->
    <header class="header">
        {#if currentUser}
            <div class="id">
                <div
                    class="avatar"
                    style="background:{stringToColor(currentUser?.did)}"
                    aria-hidden="true"
                    on:click={() => (showMenu = !showMenu)}
                >
                    {currentUser?.avatar}
                </div>
                <div class="meta">
                    <div class="name">{currentUser?.displayName}</div>
                    <div class="did">{currentUser?.did}</div>
                </div>
            </div>
            <!-- Dropdown user list -->
            {#if showMenu}
                <div class="user-menu">
                    {#each listUsers as user}
                        {#if user.did != currentUser?.did}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div
                                class="user-item"
                                on:click={() => switchUser(user)}
                            >
                                <div
                                    class="avatar"
                                    style="background:{stringToColor(user.did)}"
                                    aria-hidden="true"
                                >
                                    {user.avatar}
                                </div>
                                <div class="meta">
                                    <div class="name">{user.displayName}</div>
                                    <div class="did">{user.did}</div>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
            {/if}
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
            class="icon-btn expand-icon"
            on:click={() => {
                openAsTab();
            }}
        >
            <img src="/assets/expand.png" alt="settings" class="icon" />
        </button>
    </header>

    <!-- ============ HOME PAGE ============ -->

    {#if route === ROUTES.HOME}
        {#if currentUser}
            <Home></Home>
        {:else}
            <NoUser bind:route></NoUser>
        {/if}
    {:else if route === ROUTES.CREDENTIAL}
        <Credential></Credential>
    {:else if route === ROUTES.PRESENTATION}
        <Presentation></Presentation>
    {:else if route === ROUTES.VERIFY}
        <Verify></Verify>
    {:else if route === ROUTES.SETTINGS}
        <Setting bind:route></Setting>
    {:else if route === ROUTES.CREATE_USER_1 || route == ROUTES.CREATE_USER_2}
        <CreateDID bind:route></CreateDID>
    {/if}

    <!-- Bottom nav -->
    {#if currentUser}
        <nav class="tabbar" aria-label="Bottom navigation">
            <button
                class="tab"
                title="Home"
                class:active={route == ROUTES.HOME}
                on:click={() => {
                    openTab(ROUTES.HOME);
                }}
            >
                <img src="/assets/home.png" alt="home" class="icon" />
            </button>
            <button
                class="tab"
                title="Credential"
                class:active={route == ROUTES.CREDENTIAL}
                on:click={() => {
                    openTab(ROUTES.CREDENTIAL);
                }}
            >
                <img
                    src="/assets/credential.png"
                    alt="credential"
                    class="icon"
                />
            </button>
            <button
                class="tab"
                title="Presentation"
                class:active={route == ROUTES.PRESENTATION}
                on:click={() => {
                    openTab(ROUTES.PRESENTATION);
                }}
            >
                <img
                    src="/assets/presentation.png"
                    alt="presentation"
                    class="icon"
                />
            </button>
            <button
                class="tab"
                title="Verify"
                class:active={route == ROUTES.VERIFY}
                on:click={() => {
                    openTab(ROUTES.VERIFY);
                }}
            >
                <img src="/assets/verify.png" alt="verify" class="icon" />
            </button>
            <button
                class="tab"
                title="Settings"
                class:active={route == ROUTES.SETTINGS}
                on:click={() => {
                    openTab(ROUTES.SETTINGS);
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
        cursor: pointer;
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

    .user-menu {
        position: absolute;
        top: 55px;
        left: 10px;
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        min-width: 220px;
        z-index: 1000;
        padding: 5px 5px 5px 5px;
    }

    .user-item {
        padding: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .user-item:hover {
        background: #f0f0f0;
    }
</style>

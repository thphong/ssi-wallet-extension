<script lang="ts">
    export let route: string;
    // Mocked wallet data (replace with real data later)
    const user = { name: "thphong", avatar: "T" };
    const address = "0x5514...c57d";
    const balance = 0;
</script>

<div class="wrap">
    <!-- Header -->
    <header class="header">
        <div class="id">
            <div class="avatar" aria-hidden="true">{user.avatar}</div>
            <div class="meta">
                <div class="name">{user.name}</div>
                <div class="addr">{address}</div>
            </div>
        </div>

        <button
            class="icon-btn"
            aria-label="Open settings"
            title="Settings"
            on:click={() => {
                route = "settings";
            }}
        >
            <img src="/assets/settings.png" alt="settings" class="icon" />
            <!-- gear icon -->
            <!-- <svg viewBox="0 0 24 24" class="icon">
                <path
                    d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.43-2.77.92-1.6a.75.75 0 0 0-.28-1.02l-1.3-.75c.02-.2.03-.4.03-.61s0-.41-.03-.61l1.3-.75a.75.75 0 0 0 .28-1.02l-.92-1.6a.75.75 0 0 0-.97-.32l-1.3.54a7.7 7.7 0 0 0-1.05-.61l-.2-1.39a.75.75 0 0 0-.74-.64h-1.84a.75.75 0 0 0-.74.64l-.2 1.39c-.36.17-.71.38-1.05.61l-1.3-.54a.75.75 0 0 0-.97.32l-.92 1.6a.75.75 0 0 0 .28 1.02l1.3.75c-.02.2-.03.4-.03.61s0 .41.03.61l-1.3.75a.75.75 0 0 0-.28 1.02l.92 1.6c.2.35.62.49.97.32l1.3-.54c.33.23.68.44 1.05.61l.2 1.39c.06.37.37.64.74.64h1.84c.37 0 .68-.27.74-.64l.2-1.39c.36-.17.71-.38 1.05-.61l1.3.54c.35.17.77.03.97-.32Z"
                />
            </svg> -->
        </button>
    </header>

    <!-- Balance + quick actions -->
    <section class="balance">
        <div class="amount">{balance}</div>
        <div class="unit">IOTA</div>

        <div class="quick-actions">
            <button class="round-btn" title="Receive">
                <!-- arrow down-left -->
                <svg viewBox="0 0 24 24" class="icon">
                    <path
                        d="M17 7 7 17m0 0h10M7 17V7"
                        stroke="currentColor"
                        stroke-width="1.6"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>

            <button class="round-btn" title="Send">
                <!-- paper plane -->
                <svg viewBox="0 0 24 24" class="icon">
                    <path d="M4 12l16-7-7 16-2-6-7-3z" />
                </svg>
            </button>
        </div>

        <button class="primary">Unlock your Account</button>
    </section>

    <!-- Bottom nav -->
    <nav class="tabbar" aria-label="Bottom navigation">
        <button class="tab active" title="Home">
            <svg class="icon" viewBox="0 0 24 24"
                ><path
                    d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z"
                /></svg
            >
        </button>
        <button class="tab" title="Activity">
            <svg class="icon" viewBox="0 0 24 24"
                ><path
                    d="M3 12h4l3 7 4-14 3 7h4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /></svg
            >
        </button>
        <button class="tab" title="DApps">
            <svg class="icon" viewBox="0 0 24 24"
                ><path d="M3 7h8v6H3zM13 11h8v6h-8zM9 15h6v6H9z" /></svg
            >
        </button>
        <button class="tab" title="Markets">
            <svg class="icon" viewBox="0 0 24 24"
                ><path d="M4 14h3v6H4zM10.5 10h3v10h-3zM17 6h3v14h-3z" /></svg
            >
        </button>
    </nav>
</div>

<style>
    .id {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #6aa3ff, #3b82f6);
        color: #fff;
        display: grid;
        place-items: center;
        font-weight: 700;
    }

    .meta .name {
        font-weight: 600;
    }
    .meta .addr {
        font-size: 12px;
        color: #6b7280;
    }

    /* Balance section */
    .balance {
        text-align: left;
        margin: 18px 2px;
    }
    .amount {
        font-size: 48px;
        font-weight: 700;
        line-height: 1;
    }
    .unit {
        color: #6b7280;
        margin-top: 6px;
    }

    .quick-actions {
        display: flex;
        gap: 12px;
        margin: 18px 0;
    }

    .round-btn {
        width: 40px;
        height: 40px;
        border-radius: 9999px;
        border: none;
        background: #eef2ff;
        color: #374151;
        cursor: pointer;
        display: grid;
        place-items: center;
    }
    .round-btn:hover {
        background: #e0e7ff;
    }

    .primary {
        width: 100%;
        border: none;
        height: 44px;
        border-radius: 9999px;
        background: #e5ecf7;
        color: #111827;
        cursor: pointer;
        font-weight: 600;
    }
    .primary:hover {
        background: #dbe6f5;
    }

    /* Bottom tab bar */
    .tabbar {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 10px 16px 14px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        background: #fff;
        border-top: 1px solid #e5e7eb;
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

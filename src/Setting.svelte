<script lang="ts">
    export let route: string;
</script>

<div class="wrap">
    <header class="header">
        <button
            class="icon-btn"
            aria-label="Back"
            title="Back"
            on:click={() => {
                route = "home";
            }}
        >
            <!-- back arrow -->
            <svg viewBox="0 0 24 24" class="icon">
                <path
                    d="M15 6 9 12l6 6"
                    stroke="currentColor"
                    stroke-width="1.8"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </button>
        <div class="title">Settings</div>
        <div class="spacer"></div>
    </header>

    <section class="settings">
        <div class="card">
            <div class="row">
                <div>
                    <div class="label">Network</div>
                    <div class="sub">Shimmer Testnet</div>
                </div>
                <span class="chip">Testnet</span>
            </div>
            <hr />
            <div class="row">
                <div>
                    <div class="label">Currency</div>
                    <div class="sub">IOTA</div>
                </div>
                <div class="muted">Default</div>
            </div>
            <hr />
            <div class="row">
                <div>
                    <div class="label">Security</div>
                    <div class="sub">Lock after 5 minutes</div>
                </div>
                <button class="link">Change</button>
            </div>
        </div>

        <button class="danger">Lock & Sign Out</button>
    </section>
</div>

<style>
    /* Settings page */
    .title {
        font-weight: 700;
    }
    .spacer {
        width: 36px;
    } /* balance header spacing */

    .settings {
        margin-top: 16px;
    }

    .card {
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        padding: 12px 14px;
        background: #fff;
    }
    .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 4px;
    }
    .label {
        font-weight: 600;
    }
    .sub {
        font-size: 12px;
        color: #6b7280;
    }
    .chip {
        padding: 2px 8px;
        border-radius: 9999px;
        background: #eef2ff;
        color: #3730a3;
        font-size: 12px;
    }
    .link {
        border: none;
        background: transparent;
        color: #2563eb;
        cursor: pointer;
        font-weight: 600;
    }
    .danger {
        margin-top: 16px;
        width: 100%;
        height: 44px;
        border-radius: 12px;
        border: 1px solid #fecaca;
        background: #fff5f5;
        color: #b91c1c;
        font-weight: 700;
        cursor: pointer;
    }

    /* HR in card */
    .card hr {
        border: none;
        height: 1px;
        background: #f1f5f9;
        margin: 2px 0;
    }
</style>

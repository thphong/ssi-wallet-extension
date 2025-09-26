<script lang="ts">
    import { ROUTES } from "../types/enums";
    import PageHeader from "../components/PageHeader.svelte";
    export let route: string;
</script>

<PageHeader bind:route routeBack={ROUTES.HOME} pageTitle="Settings"
></PageHeader>

<section class="main-content">
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

    <button class="danger">Expand</button>
</section>

<style>
    .main-content {
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
    }
    .link {
        border: none;
        background: transparent;
        color: #2563eb;
        cursor: pointer;
        font-weight: 600;
    }

    /* HR in card */
    .card hr {
        border: none;
        height: 1px;
        background: #f1f5f9;
        margin: 2px 0;
    }
</style>

<script lang="ts">
    // Self-import enables recursion
    import Tree from "./Tree.svelte";

    export let data: any;
    export let depth: number = 0;
    export let collapsedAt: number = 1;

    // Node open/close state: default open if within collapsedAt
    let expanded = depth <= collapsedAt;

    function toggle() {
        expanded = !expanded;
    }

    function isPrimitive(v: any) {
        return (
            v === null ||
            ["string", "number", "boolean", "bigint"].includes(typeof v)
        );
    }

    function renderPrimitive(v: any) {
        if (typeof v === "string") return `"${v}"`;
        if (typeof v === "bigint") return `${v}n`;
        if (v === null) return "null";
        return String(v);
    }

    function typeLabel(obj: any) {
        if (Array.isArray(obj)) return `Array(${obj.length})`;
        if (obj instanceof Date) return `Date(${obj.toISOString()})`;
        if (obj instanceof RegExp) return `RegExp(${obj.toString()})`;
        if (obj && typeof obj === "object")
            return `Object(${Object.keys(obj).length})`;
        return typeof obj;
    }

    function entries(obj: any): Array<[string | number, any]> {
        if (Array.isArray(obj)) return obj.map((v, i) => [i, v]);
        if (obj && typeof obj === "object") return Object.entries(obj);
        return [];
    }
</script>

{#if isPrimitive(data)}
    <span class={"value " + typeof data}>{renderPrimitive(data)}</span>
{:else if data instanceof Date}
    <span class="value date">"{data.toISOString()}"</span>
{:else if data instanceof RegExp}
    <span class="value regex">"{String(data)}"</span>
{:else if typeof data === "undefined"}
    <span class="value undefined">undefined</span>
{:else if typeof data === "function"}
    <span class="value function">[Function]</span>
{:else if expanded}
    <div class="node open" style="--pad:{depth}">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span class="caret" on:click={toggle} title="Collapse">▼</span>
        <span class="bracket">{Array.isArray(data) ? "[" : "{"}</span>
        <div class="children">
            {#each entries(data) as [k, v], i (k)}
                <div class="row">
                    <span class="key">{k}</span><span class="colon">: </span>
                    <Tree data={v} depth={depth + 1} {collapsedAt} />
                    {#if i < entries(data).length - 1}<span class="comma"
                            >,</span
                        >{/if}
                </div>
            {/each}
        </div>
        <div class="closing">
            <span class="bracket">{Array.isArray(data) ? "]" : "}"}</span>
        </div>
    </div>
{:else}
    <div class="node closed" style="--pad:{depth}">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span class="caret" on:click={toggle} title="Expand">▶</span>
        <span class="summary">{typeLabel(data)}</span>
    </div>
{/if}

<style>
    .node {
        padding-left: calc(var(--pad, 0) * 16px);
        position: relative;
    }
    .caret {
        cursor: pointer;
        margin-right: 6px;
        user-select: none;
        opacity: 0.8;
    }
    .children {
        border-left: 1px dashed #e5e7eb;
        margin-left: 10px;
        padding-left: 10px;
    }
    .row {
        display: flex;
        align-items: baseline;
        gap: 4px;
    }
    .key {
        color: #0366d6;
    }
    .colon,
    .comma {
        opacity: 0.6;
    }
    .bracket {
        color: #111827;
        font-weight: 600;
    }
    .summary {
        color: #6b7280;
    }

    /* Values */
    .value.string {
        color: #10b981;
    }
    .value.number {
        color: #2563eb;
    }
    .value.boolean {
        color: #f59e0b;
    }
    .value.bigint {
        color: #1f2937;
    }
    .value.undefined {
        color: #9ca3af;
        font-style: italic;
    }
    .value.function {
        color: #7c3aed;
    }
    .value.date {
        color: #059669;
    }
    .value.regex {
        color: #ef4444;
    }
</style>

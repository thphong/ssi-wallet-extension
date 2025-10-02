<script lang="ts">
    import Tree from "./Tree.svelte";
    export let data: any;
    export let collapsedAt: number = 1;

</script>

<div class="viewer">
    <div class="tree-wrap">
        <Tree {data} depth={0} {collapsedAt} />
    </div>
</div>

<style>
    .viewer {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 13px;
        line-height: 1.5;
        color: #111827;
    }
    .tree-wrap {
        padding: 4px 0;
    }
</style>

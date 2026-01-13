<script lang="ts">
    // props
    export let type: "success" | "error" | "warning" | "info" = "info";
    export let title = "";
    export let message = "";

    export let okText = "OK";
    export let cancelText = "Cancel";

    export let showActions = true;

    // callbacks (no-op by default → SSR safe)
    export let onOk: () => void = () => {};
    export let onCancel: () => void = () => {};
</script>

<div class={`alert alert-soft alert-${type}`} role="alert">
    <div class="flex flex-col gap-2">
        {#if title}
            <h3 class="font-semibold text-base">
                {title}
            </h3>
        {/if}

        {#if message}
            <p class="text-sm">
                {message}
            </p>
        {/if}
    </div>

    {#if showActions}
        <div class="mt-4 flex gap-2">
            <button
                type="button"
                class="btn btn-primary btn-sm"
                on:click={onOk}
            >
                {okText}
            </button>

            <button
                type="button"
                class="btn btn-outline btn-secondary btn-sm"
                on:click={onCancel}
            >
                {cancelText}
            </button>
        </div>
    {/if}
</div>

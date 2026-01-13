<script>
    export let type = "success";
    // success | error | warning | info

    export let title = "Alert Title";
    export let message = "Alert message here";
    export let linkText = "";
    export let linkHref = "#";

    export let showActions = true;
    export let okText = "Ok";
    export let cancelText = "Cancel";

    export let onOk = () => {};
    export let onCancel = () => {};
</script>

<div class={`alert alert-soft alert-${type}`} role="alert">
    <div>
        <h3 class="font-semibold">{title}</h3>

        <p class="mt-1">
            {message}
            {#if linkText}
                <a href={linkHref} class="link link-primary font-semibold">
                    {linkText}
                </a>
            {/if}
        </p>
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

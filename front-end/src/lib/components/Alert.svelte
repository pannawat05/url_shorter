<script lang="ts">
    import { fly, fade } from "svelte/transition";

    export let type: "success" | "error" | "warning" | "info" = "info";
    export let title = "";
    export let message = "";
    export let okText = "OK";
    export let cancelText = "Cancel";
    export let showActions = true;

    export let onOk: () => void = () => {};
    export let onCancel: () => void = () => {};

    // กำหนดสีและ Icon ตามประเภท
    const configs = {
        success: {
            bg: "bg-green-50 border-green-200",
            text: "text-green-800",
            iconColor: "text-green-500",
            btn: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />`,
        },
        error: {
            bg: "bg-red-50 border-red-200",
            text: "text-red-800",
            iconColor: "text-red-500",
            btn: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />`,
        },
        warning: {
            bg: "bg-amber-50 border-amber-200",
            text: "text-amber-800",
            iconColor: "text-amber-500",
            btn: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />`,
        },
        info: {
            bg: "bg-blue-50 border-blue-200",
            text: "text-blue-800",
            iconColor: "text-blue-500",
            btn: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
        },
    };

    $: config = configs[type];
</script>

<div
    in:fly={{ y: -20, duration: 300 }}
    out:fade
    class={`relative flex flex-col p-5 border rounded-2xl shadow-sm ${config.bg} ${config.text}`}
>
    <div class="flex items-start gap-4">
        <div class={`flex-shrink-0 ${config.iconColor}`}>
            <svg
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                {@html config.icon}
            </svg>
        </div>

        <div class="flex-1 min-w-0">
            {#if title}
                <h3
                    class="text-sm font-bold uppercase tracking-wide opacity-90 mb-1"
                >
                    {title}
                </h3>
            {/if}
            {#if message}
                <p class="text-sm leading-relaxed opacity-80">
                    {message}
                </p>
            {/if}
        </div>
    </div>

    {#if showActions}
        <div class="mt-5 flex justify-end gap-3">
            <button
                type="button"
                on:click={onCancel}
                class="px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors duration-200 hover:bg-black/5"
            >
                {cancelText}
            </button>
            <button
                type="button"
                on:click={onOk}
                class={`px-5 py-1.5 text-xs font-bold text-white rounded-lg shadow-md transform active:scale-95 transition-all duration-200 ${config.btn}`}
            >
                {okText}
            </button>
        </div>
    {/if}
</div>

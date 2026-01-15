<script lang="ts">
    export let type: "success" | "error" = "success";
    export let title = "";
    export let message = "";
    export let okText = "OK";
    export let cancelText = "Cancel";

    export let onOk: () => void;
    export let onCancel: () => void;
</script>

<!-- Overlay -->
<div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        on:click={onCancel}
    ></div>

    <!-- Modal -->
    <div
        class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-scale-in"
        role="dialog"
        aria-modal="true"
    >
        <!-- Icon -->
        <div class="flex justify-center mb-4">
            {#if type === "success"}
                <div
                    class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"
                >
                    <svg
                        class="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
            {:else}
                <div
                    class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center"
                >
                    <svg
                        class="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>
            {/if}
        </div>

        <!-- Title -->
        <h2 class="text-lg font-semibold text-center text-gray-800 mb-2">
            {title}
        </h2>

        <!-- Message -->
        <p class="text-sm text-gray-600 text-center mb-6">
            {message}
        </p>

        <!-- Actions -->
        <div class="flex gap-3">
            <button
                class="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                on:click={onCancel}
            >
                {cancelText}
            </button>

            <button
                class={`flex-1 px-4 py-2 rounded-xl text-white transition
                    ${
                        type === "success"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                    }`}
                on:click={onOk}
            >
                {okText}
            </button>
        </div>
    </div>
</div>

<style>
    @keyframes scale-in {
        from {
            transform: scale(0.9);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    .animate-scale-in {
        animation: scale-in 0.2s ease-out;
    }
</style>

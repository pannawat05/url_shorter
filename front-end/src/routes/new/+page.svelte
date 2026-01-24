<script lang="ts">
    import { onMount } from "svelte";
    import Nav from "$lib/components/Nav.svelte";

    let originalUrl = "";
    let shortenedUrl = "";
    let isLoading = false;
    let copied = false;
    let errorMessage = "";
    let focused = false;
    let uid = "";

    // safe for SSR
    onMount(() => {
        try {
            const user = localStorage.getItem("user");
            if (user) {
                const parsed = JSON.parse(user);
                uid = parsed?.id ?? "";
            }
        } catch (err) {
            console.error("Invalid user in localStorage", err);
            uid = "";
        }
    });

    async function shortenUrl() {
        errorMessage = "";
        shortenedUrl = "";

        if (!originalUrl.trim()) {
            errorMessage = "Please enter a URL";
            return;
        }

        if (!uid) {
            errorMessage = "User not logged in";
            return;
        }

        isLoading = true;

        try {
            const response = await fetch("/api/shorturl", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    original_url: originalUrl.trim(),
                    user_id: uid
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || "Failed to shorten URL");
            }

            if (data.short_url.startsWith("http")) {
                shortenedUrl = data.short_url;
            } else {
                const shortCode = String(data.short_url)
                    .replace(/^\/+/, "")
                    .trim();

                shortenedUrl = `https://shorturl.panplay-itgoeasy.xyz/${shortCode}`;
            }
        } catch (err: any) {
            errorMessage = err.message || "Unexpected error";
        } finally {
            isLoading = false;
        }
    }

    function copyToClipboard(text: string) {
        if (!text) return;

        try {
            if (
                typeof navigator !== "undefined" &&
                navigator.clipboard &&
                window.isSecureContext
            ) {
                navigator.clipboard.writeText(text).then(triggerCopyState);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = text;
                textarea.style.position = "fixed";
                textarea.style.left = "-9999px";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
                triggerCopyState();
            }
        } catch (err) {
            console.error("Copy failed:", err);
        }
    }

    function triggerCopyState() {
        copied = true;
        setTimeout(() => (copied = false), 2000);
    }

    function reset() {
        originalUrl = "";
        shortenedUrl = "";
        errorMessage = "";
        copied = false;
    }
</script>


<Nav />

<div
    class="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden"
>
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
            class="absolute -top-1/2 -left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"
        ></div>
        <div
            class="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"
            style="animation-delay: 1.5s;"
        ></div>
    </div>

    <div class="relative w-full max-w-2xl">
        <div
            class="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-lg opacity-75"
        ></div>

        <div
            class="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12"
        >
            <div class="text-center mb-10">
                <div
                    class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl mb-6 shadow-xl transform hover:scale-110 transition-all duration-300 hover:rotate-6 cursor-pointer"
                >
                    <svg
                        class="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
                        />
                    </svg>
                </div>
                <h1
                    class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2"
                >
                    new short URL
                </h1>
                <p class="text-gray-600 text-lg font-medium">
                    Transform long links into short, shareable URLs instantly
                </p>
            </div>

            {#if errorMessage}
                <div
                    class="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
                >
                    <span>{errorMessage}</span>
                </div>
            {/if}

            <div class="space-y-6">
                <div class="relative group">
                    <input
                        type="url"
                        bind:value={originalUrl}
                        on:focus={() => (focused = true)}
                        on:blur={() => (focused = false)}
                        placeholder="https://example.com/your-url"
                        class="block w-full pl-6 pr-4 py-4 text-gray-900 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 outline-none text-lg"
                    />
                </div>

                <button
                    on:click={shortenUrl}
                    disabled={isLoading || !originalUrl}
                    class="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                >
                    {#if isLoading}
                        <span>Shortening...</span>
                    {:else}
                        <span>Shorten URL</span>
                    {/if}
                </button>
            </div>

            {#if shortenedUrl}
                <div
                    class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-2xl"
                >
                    <p class="text-sm font-semibold text-gray-600 mb-3">
                        Your shortened URL:
                    </p>
                    <div
                        class="flex items-center gap-3 bg-white p-4 rounded-xl border border-indigo-200"
                    >
                        <a
                            href={shortenedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex-1 text-indigo-600 font-bold text-lg truncate"
                        >
                            {shortenedUrl}
                        </a>

                        <button
                            on:click={() => copyToClipboard(shortenedUrl)}
                            class="flex-shrink-0 p-3 {copied
                                ? 'bg-green-500'
                                : 'bg-indigo-600'} text-white rounded-lg transition-all duration-200 shadow-lg"
                            title="Copy to clipboard"
                        >
                            {#if copied}
                                <svg
                                    class="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            {:else}
                                <svg
                                    class="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>
                            {/if}
                        </button>
                    </div>

                    {#if copied}
                        <p
                            class="text-green-600 text-sm font-medium mt-3 text-center animate-bounce"
                        >
                            ✓ Copied to clipboard!
                        </p>
                    {/if}

                    <button
                        on:click={reset}
                        class="mt-4 w-full py-2 text-indigo-600 hover:underline font-medium text-sm"
                    >
                        Shorten another URL
                    </button>
                </div>
            {/if}

            <div
                class="mt-10 grid grid-cols-3 gap-4 pt-8 border-t border-gray-200"
            >
                <div class="text-center">
                    <div class="text-3xl mb-2">⚡</div>
                    <div class="text-sm font-semibold text-gray-700">Fast</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl mb-2">🎁</div>
                    <div class="text-sm font-semibold text-gray-700">Free</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl mb-2">✨</div>
                    <div class="text-sm font-semibold text-gray-700">Easy</div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
</style>

<script lang="ts">
    import { onMount } from "svelte";
    import Nav from "$lib/components/Nav.svelte";
    import { PUBLIC_API_URL } from "$env/static/public";

    let originalUrl = "";
    let shortenedUrl = "";
    let isLoading = false;
    let copied = false;
    let errorMessage = "";
    let focused = false;

    let uid = "";

    // ✅ safe for SSR
    onMount(() => {
        try {
            const user = localStorage.getItem("user");
            if (user) {
                const parsed = JSON.parse(user);
                uid = parsed?.id ?? null;
                console.log("User ID:", uid);
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
            const response = await fetch(`/api/shorturl`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    original_url: originalUrl.trim(),
                    user_id: uid,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || "Failed to shorten URL");
            }

            shortenedUrl = data.short_url;
        } catch (error) {
            console.error(error);
            errorMessage =
                (error instanceof Error ? error.message : String(error)) ||
                "Network error";
        } finally {
            isLoading = false;
        }
    }

    function copyToClipboard(text: string) {
        try {
            // Modern API (ต้องมี + secure)
            if (navigator?.clipboard?.writeText && window.isSecureContext) {
                navigator.clipboard.writeText(text);
            } else {
                // Fallback (รองรับ HTTP / browser เก่า)
                const textarea = document.createElement("textarea");
                textarea.value = text;
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }

            copiedSsid = text;
            setTimeout(() => (copiedSsid = null), 2000);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    }

    function reset() {
        originalUrl = "";
        shortenedUrl = "";
        errorMessage = "";
    }
</script>

<Nav />

<div
    class="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center p-4 relative overflow-hidden"
>
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
            class="absolute -top-1/2 -left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"
        ></div>
        <div
            class="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"
            style="animation-delay: 1.5s;"
        ></div>
        <div
            class="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-pulse"
            style="animation-delay: 0.5s;"
        ></div>
    </div>

    <!-- Main container -->
    <div class="relative w-full max-w-2xl">
        <div
            class="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-lg opacity-75"
        ></div>

        <div
            class="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12"
        >
            <!-- Header -->
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
                        ></path>
                    </svg>
                </div>

                <h1
                    class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-2"
                >
                    new short URL
                    <svg
                        class="w-8 h-8 text-purple-500 animate-pulse"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        ></path>
                    </svg>
                </h1>

                <p class="text-gray-600 text-lg font-medium">
                    Transform long links into short, shareable URLs instantly
                </p>
            </div>

            <!-- Error message -->
            {#if errorMessage}
                <div
                    class="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
                >
                    <svg
                        class="w-5 h-5 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd"
                        />
                    </svg>
                    <span>{errorMessage}</span>
                </div>
            {/if}

            <!-- Input Section -->
            <div class="space-y-6">
                <div class="relative group">
                    <div
                        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                    >
                        <svg
                            class={"w-5 h-5 transition-colors duration-200 " +
                                (focused ? "text-indigo-500" : "text-gray-400")}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            ></path>
                        </svg>
                    </div>

                    <input
                        type="url"
                        bind:value={originalUrl}
                        on:focus={() => (focused = true)}
                        on:blur={() => (focused = false)}
                        placeholder="https://example.com/your-very-long-url-here"
                        class="block w-full pl-12 pr-4 py-4 text-gray-900 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 outline-none text-lg"
                        required
                    />
                </div>

                <button
                    on:click={shortenUrl}
                    disabled={isLoading || !originalUrl}
                    class="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
                >
                    {#if isLoading}
                        <svg
                            class="animate-spin h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span>Shortening...</span>
                    {:else}
                        <svg
                            class="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
                            ></path>
                        </svg>
                        <span>Shorten URL</span>
                    {/if}
                </button>
            </div>

            <!-- Result -->
            {#if shortenedUrl}
                <div
                    class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-2xl"
                >
                    <p
                        class="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2"
                    >
                        <svg
                            class="w-5 h-5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        Your shortened URL:
                    </p>

                    <div
                        class="flex items-center gap-3 bg-white p-4 rounded-xl border border-indigo-200"
                    >
                        <a
                            href={shortenedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex-1 text-indigo-600 font-bold text-lg hover:text-indigo-700 transition-colors truncate"
                        >
                            {shortenedUrl}
                        </a>

                        <button
                            on:click={copyToClipboard}
                            class="flex-shrink-0 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
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
                                    ></path>
                                </svg>
                            {/if}
                        </button>
                    </div>

                    {#if copied}
                        <p
                            class="text-green-600 text-sm font-medium mt-3 text-center animate-pulse"
                        >
                            ✓ Copied to clipboard!
                        </p>
                    {/if}

                    <button
                        on:click={reset}
                        class="mt-4 w-full py-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
                    >
                        Shorten another URL
                    </button>
                </div>
            {/if}

            <!-- Features -->
            <div
                class="mt-10 grid grid-cols-3 gap-4 pt-8 border-t border-gray-200"
            >
                <div class="text-center">
                    <div class="text-3xl mb-2">⚡</div>
                    <div class="text-sm font-semibold text-gray-700">Fast</div>
                    <div class="text-xs text-gray-500 mt-1">
                        Instant results
                    </div>
                </div>
                <div class="text-center">
                    <div class="text-3xl mb-2">🎁</div>
                    <div class="text-sm font-semibold text-gray-700">Free</div>
                    <div class="text-xs text-gray-500 mt-1">No cost ever</div>
                </div>
                <div class="text-center">
                    <div class="text-3xl mb-2">✨</div>
                    <div class="text-sm font-semibold text-gray-700">Easy</div>
                    <div class="text-xs text-gray-500 mt-1">Simple to use</div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
            Ubuntu, Cantarell, sans-serif;
    }
</style>

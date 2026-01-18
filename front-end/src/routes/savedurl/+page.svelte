<script lang="ts">
    import { onMount } from "svelte";
    import Alert from "$lib/components/Alert.svelte"; // นำเข้า Alert
    import Nav from "$lib/components/Nav.svelte";
    import { PUBLIC_API_URL } from "$env/static/public";
    import { PUBLIC_HOST } from "$env/static/public";

    let token: string = "";
    let urls: any[] = [];
    let hostname: string = "";
    let error: string = "";
    let loading: boolean = false;
    const API_URL = import.meta.env.VITE_API_URL;
    const host = import.meta.env.VITE_HOST;
    let errorMessage = "";
    let successMessage = "";
    let showAlert = false;
    let alertType: "success" | "error" = "success";
    let isLoading = false;

    let copied = false;

    onMount(async () => {
        token = localStorage.getItem("authToken") ?? "";
        hostname = window.location.hostname;

        if (!token) {
            error = "No authentication token found. Please log in.";
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.exp * 1000 < Date.now()) {
                error = "Token has expired. Please log in again.";
                localStorage.removeItem("authToken");
                token = "";
                return;
            }
        } catch (e) {
            console.error("Invalid token format");
        }

        loading = true;
        try {
            const res = await fetch(`/api/savedurls`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `Error ${res.status}`);
            }

            const data = await res.json();
            urls = data.savedUrls || [];
            console.log("Updated URLs state:", urls);
        } catch (err: any) {
            error = err.message;
            if (error.includes("expired") || error.includes("401")) {
                localStorage.removeItem("authToken");
                token = "";
            }
        } finally {
            loading = false;
        }
    });
    function copyToClipboard(shortenedUrl: string) {
        navigator.clipboard.writeText(shortenedUrl);
        copied = true;
        setTimeout(() => (copied = false), 2000);
    }

    async function deleteUrl(ssid: string) {
        isLoading = true;
        showAlert = false;
        errorMessage = "";
        successMessage = "";
        try {
            const res = await fetch(`/api/savedurls/${ssid}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `Error ${res.status}`);
            }

            // Remove the deleted URL from the local state
            urls = urls.filter((url) => url.ssid !== ssid);
            alertType = "success";
            successMessage = "url delete successful 🎉";
            showAlert = true;
        } catch (err: any) {
            error = err.message;
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <title>Saved URLs</title>
</svelte:head>

<Nav />

<button
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full float-end mr-25 mt-5"
    ><a href="/new">
        <span class="mr-1">🔗</span>shorten another urls</a
    ></button
>

<div class="p-6 max-w-6xl mx-auto mt-25">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Saved URLs</h1>
        <span
            class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
        >
            Total: {urls.length}
        </span>
    </div>

    {#if loading}
        <div class="flex justify-center p-10">
            <p class="animate-pulse text-gray-500">Loading data...</p>
        </div>
    {:else if error}
        <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p class="text-red-700">{error}</p>
            {#if !token}
                <a
                    href="/login"
                    class="text-red-800 underline font-bold mt-2 inline-block"
                    >Go to login</a
                >
            {/if}
        </div>
    {:else if urls && urls.length > 0}
        <div
            class="overflow-x-auto shadow-md sm:rounded-lg border border-gray-200"
        >
            <table class="w-full text-sm text-left text-gray-500">
                <thead
                    class="text-xs text-gray-700 uppercase bg-gray-50 border-b"
                >
                    <tr>
                        <th scope="col" class="px-6 py-3 w-1/3">Short URL</th>
                        <th scope="col" class="px-6 py-3 w-2/3">Original URL</th
                        >
                        <th scope="col" class="px-6 py-3 w-1/3 text-center"
                            >Actions</th
                        >
                    </tr>
                </thead>
                <tbody>
                    {#each urls as url}
                        <tr
                            class="bg-white border-b hover:bg-gray-50 transition-colors"
                        >
                            <td
                                class="px-6 py-4 font-medium text-blue-600 whitespace-nowrap"
                            >
                                <div style="display: flex;">
                                    <a
                                        href={`${PUBLIC_HOST}${url.ssid}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="hover:underline flex items-center"
                                    >
                                        <span class="mr-1">🔗</span>
                                        {PUBLIC_HOST}{url.ssid}
                                    </a>
                                    <p>&nbsp;&nbsp;</p>
                                    <button
                                        on:click={() =>
                                            copyToClipboard(
                                                `${PUBLIC_HOST}/${url.ssid}`,
                                            )}
                                        class="flex-shrink-0 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 transform hover:scale-65 active:scale-70 shadow-lg"
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
                            </td>
                            <td class="px-6 py-4">
                                <div
                                    class="max-w-md md:max-w-xl truncate text-gray-400 italic"
                                    title={url.original_url}
                                >
                                    {url.original_url}
                                </div>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <button
                                    on:click={() => deleteUrl(url.ssid)}
                                    class="flex-shrink-0 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 transform hover:scale-65 active:scale-70 shadow-lg"
                                    title="Delete URL"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        x="0px"
                                        y="0px"
                                        width="50"
                                        height="50"
                                        viewBox="0 0 48 48"
                                        class="w-5 h-5 align-center"
                                    >
                                        <path
                                            d="M 20 2 C 18.35503 2 17 3.3550302 17 5 L 17 7 L 4 7 A 1.0001 1.0001 0 1 0 4 9 L 17.832031 9 A 1.0001 1.0001 0 0 0 18.158203 9 L 29.832031 9 A 1.0001 1.0001 0 0 0 30.158203 9 L 44 9 A 1.0001 1.0001 0 1 0 44 7 L 31 7 L 31 5 C 31 3.3550302 29.64497 2 28 2 L 20 2 z M 20 4 L 28 4 C 28.56503 4 29 4.4349698 29 5 L 29 7 L 19 7 L 19 5 C 19 4.4349698 19.43497 4 20 4 z M 6.9804688 10.986328 A 1.0001 1.0001 0 0 0 5.9941406 12.09375 L 8.6640625 40.462891 C 8.900709 43.030242 11.061274 45 13.640625 45 L 34.359375 45 C 36.938726 45 39.099291 43.030242 39.335938 40.462891 L 39.335938 40.460938 L 42.005859 12.09375 A 1.0004955 1.0004955 0 1 0 40.013672 11.90625 L 37.34375 40.275391 A 1.0001 1.0001 0 0 0 37.34375 40.279297 C 37.199488 41.851004 35.939375 43 34.359375 43 L 13.640625 43 C 12.060625 43 10.800512 41.850998 10.65625 40.279297 A 1.0001 1.0001 0 0 0 10.65625 40.275391 L 7.9863281 11.90625 A 1.0001 1.0001 0 0 0 6.9804688 10.986328 z"
                                            fill="white"
                                        ></path>
                                    </svg>
                                </button></td
                            >
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {:else}
        <div
            class="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed"
        >
            <p class="text-gray-500">No saved URLs found in your account.</p>
        </div>
    {/if}
</div>

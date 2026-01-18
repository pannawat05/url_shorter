<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Nav from "$lib/components/Nav.svelte";
    import Alert from "$lib/components/Alert.svelte";
    import { PUBLIC_HOST } from "$env/static/public";

    let token = "";
    let urls: any[] = [];
    let error = "";
    let loading = false;
    let actionLoading = false;

    let showAlert = false;
    let alertType: "success" | "error" = "success";
    let successMessage = "";
    let errorMessage = "";

    let copiedSsid: string | null = null;

    onMount(async () => {
        token = localStorage.getItem("authToken") ?? "";

        if (!token) {
            error = "No authentication token found. Please log in.";
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.exp * 1000 < Date.now()) {
                throw new Error("Token expired");
            }
        } catch {
            localStorage.removeItem("authToken");
            error = "Session expired. Please log in again.";
            return;
        }

        await loadUrls();
    });

    async function loadUrls() {
        loading = true;
        error = "";

        try {
            const res = await fetch("/api/savedurls", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const e = await res.json();
                throw new Error(e.error || "Failed to load URLs");
            }

            const data = await res.json();
            urls = data.savedUrls ?? [];
        } catch (err: any) {
            error = err.message;
        } finally {
            loading = false;
        }
    }

    function copyToClipboard(text: string, ssid: string) {
        try {
            if (
                typeof navigator !== "undefined" &&
                navigator.clipboard &&
                typeof navigator.clipboard.writeText === "function" &&
                window.isSecureContext
            ) {
                navigator.clipboard.writeText(text);
            } else {
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

            copiedSsid = ssid;
            setTimeout(() => (copiedSsid = null), 2000);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    }
    async function deleteUrl(ssid: string) {
        actionLoading = true;

        try {
            const res = await fetch(`/api/savedurls/${ssid}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const e = await res.json();
                throw new Error(e.error || "Delete failed");
            }

            urls = urls.filter((u) => u.ssid !== ssid);
            alertType = "success";
            successMessage = "URL deleted successfully 🎉";
            showAlert = true;
        } catch (err: any) {
            alertType = "error";
            errorMessage = err.message;
            showAlert = true;
        } finally {
            actionLoading = false;
        }
    }

    function closeAlert() {
        showAlert = false;
    }
</script>

<svelte:head>
    <title>Saved URLs</title>
</svelte:head>

<Nav />

<div
    class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex justify-center p-6"
>
    <div class="relative w-full max-w-6xl">
        {#if showAlert}
            <Alert
                type={alertType}
                title={alertType === "success" ? "Success" : "Error"}
                message={alertType === "success"
                    ? successMessage
                    : errorMessage}
                okText="OK"
                cancelText="Close"
                onOk={closeAlert}
                onCancel={closeAlert}
            />
        {/if}

        <div class="bg-white rounded-2xl shadow-xl p-6 mt-6">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-bold text-gray-800">Saved URLs</h1>
                <a
                    href="/new"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
                >
                    🔗 Shorten new URL
                </a>
            </div>

            {#if loading}
                <p class="text-center text-gray-500 py-10 animate-pulse">
                    Loading...
                </p>
            {:else if error}
                <div class="bg-red-50 border-l-4 border-red-500 p-4">
                    <p class="text-red-700">{error}</p>
                    <a href="/login" class="underline text-red-800 font-bold">
                        Go to login
                    </a>
                </div>
            {:else if urls.length === 0}
                <div
                    class="text-center py-12 border-2 border-dashed rounded-lg"
                >
                    <p class="text-gray-500">No saved URLs found.</p>
                </div>
            {:else}
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-600">
                        <thead class="bg-gray-100 uppercase text-xs">
                            <tr>
                                <th class="px-6 py-3">Short URL</th>
                                <th class="px-6 py-3">Original URL</th>
                                <th class="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each urls as url}
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="px-6 py-4 text-blue-600">
                                        <a
                                            href={`${PUBLIC_HOST}/${url.ssid}`}
                                            target="_blank"
                                            class="hover:underline"
                                        >
                                            {PUBLIC_HOST}/{url.ssid}
                                        </a>
                                    </td>

                                    <td
                                        class="px-6 py-4 truncate max-w-xl text-gray-400"
                                    >
                                        {url.original_url}
                                    </td>

                                    <td class="px-6 py-4 text-center space-x-2">
                                        <button
                                            on:click={() =>
                                                copyToClipboard(url.ssid)}
                                            class="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                        >
                                            {copiedSsid === url.ssid
                                                ? "✔"
                                                : "📋"}
                                        </button>

                                        <button
                                            on:click={() => deleteUrl(url.ssid)}
                                            disabled={actionLoading}
                                            class="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                        >
                                            🗑
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        </div>
    </div>
</div>

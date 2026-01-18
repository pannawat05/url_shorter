<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Alert from "$lib/components/Alert.svelte";
    import Nav from "$lib/components/Nav.svelte";
    import { PUBLIC_HOST } from "$env/static/public";

    let token = "";
    let urls: any[] = [];
    let error = "";
    let loading = false;

    let errorMessage = "";
    let successMessage = "";
    let showAlert = false;
    let alertType: "success" | "error" = "success";
    let isLoading = false;

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
                error = "Token has expired. Please log in again.";
                localStorage.removeItem("authToken");
                token = "";
                return;
            }
        } catch {
            error = "Invalid token";
            return;
        }

        loading = true;
        try {
            const res = await fetch(`/api/savedurls`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
    });

    function copyToClipboard(ssid: string) {
        const url = `${PUBLIC_HOST}/${ssid}`;
        navigator.clipboard.writeText(url);
        copiedSsid = ssid;
        setTimeout(() => (copiedSsid = null), 2000);
    }

    async function deleteUrl(ssid: string) {
        isLoading = true;
        try {
            const res = await fetch(`/api/savedurls/${ssid}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
            isLoading = false;
        }
    }

    function handleOk() {
        showAlert = false;
    }

    function handleCancel() {
        showAlert = false;
    }
</script>

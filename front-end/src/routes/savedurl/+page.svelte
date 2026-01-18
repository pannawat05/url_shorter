<script lang="ts">
    import { onMount } from "svelte";
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

    /** ✅ สร้าง URL เต็มจาก ssid (ใช้จุดเดียวทั้งไฟล์) */
    function buildShortUrl(ssid: string) {
        return `${PUBLIC_HOST}/${ssid}`;
    }

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

    /** ✅ copy ได้ทั้ง desktop / mobile / http */
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

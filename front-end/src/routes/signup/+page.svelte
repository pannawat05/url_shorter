<script lang="ts">
    import Alert from "$lib/components/Alert.svelte";
    import { goto } from "$app/navigation";

    let email = "";
    let password = "";
    let focused = "";

    let isLoading = false;
    let showAlert = false;
    let alertType: "success" | "error" = "success";
    let errorMessage = "";
    let successMessage = "";

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        isLoading = true;
        showAlert = false;
        errorMessage = "";
        successMessage = "";

        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alertType = "success";
                successMessage = "Sign up successful 🎉";
                showAlert = true;

                setTimeout(() => {
                    goto("/login");
                }, 1200);
            } else {
                alertType = "error";
                errorMessage = data?.message || "Sign up failed. Please try again.";
                showAlert = true;
            }
        } catch (err) {
            alertType = "error";
            errorMessage = "Network error. Please try again.";
            showAlert = true;
        } finally {
            isLoading = false;
        }
    };

    function handleOk() {
        showAlert = false;
    }

    function handleCancel() {
        showAlert = false;
    }
</script>

<!-- Alert wrapper -->
<div class="relative bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
    {#if showAlert}
        <div class="mb-6">
            <Alert
                type={alertType}
                title={alertType === "success" ? "Success" : "Error"}
                message={alertType === "success" ? successMessage : errorMessage}
                okText="OK"
                cancelText="Close"
                onOk={handleOk}
                onCancel={handleCancel}
            />
        </div>
    {/if}
</div>

<!-- Page layout -->
<div
    class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden"
>
    <!-- Background blobs -->
    <div class="absolute inset-0 overflow-hidden">
        <div
            class="absolute -top-1/2 -left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"
        ></div>
        <div
            class="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"
            style="animation-delay: 1s;"
        ></div>
    </div>

    <!-- Card -->
    <div class="relative w-full max-w-md">
        <div
            class="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75"
        ></div>

        <div class="relative bg-white rounded-2xl shadow-2xl p-8">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1
                    class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2"
                >
                    Create Account
                </h1>
                <p class="text-gray-500 text-sm">
                    Start your journey with us today
                </p>
            </div>

            <!-- Form -->
            <form on:submit={handleSubmit} class="space-y-6">
                <!-- Email -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        required
                        bind:value={email}
                        on:focus={() => (focused = "email")}
                        on:blur={() => (focused = "")}
                        class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="you@example.com"
                    />
                </div>

                <!-- Password -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        required
                        bind:value={password}
                        on:focus={() => (focused = "password")}
                        on:blur={() => (focused = "")}
                        class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="••••••••"
                    />
                </div>

                <!-- Submit -->
                <button
                    type="submit"
                    disabled={isLoading}
                    class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
                >
                    {isLoading ? "Creating..." : "Sign Up"}
                </button>
            </form>

            <!-- Footer -->
            <p class="mt-6 text-center text-sm text-gray-600">
                Already have an account?
                <a href="/login" class="text-indigo-600 hover:underline">
                    Sign in
                </a>
            </p>
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

<script lang="ts">
    import Alert from "$lib/components/Alert.svelte"; // นำเข้า Alert
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";

    let errorMessage = "";
    let successMessage = "";
    let showAlert = false;
    let alertType: "success" | "error" = "success";
    let isLoading = false;

    let email = "";
    let password = "";
    let focused = "";

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault();
        isLoading = true;
        showAlert = false;
        errorMessage = "";
        successMessage = "";

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alertType = "success";
                successMessage = "Login successful 🎉";
                showAlert = true;

                if (browser) {
                    if (data.token)
                        localStorage.setItem("authToken", data.token);
                    if (data.user)
                        localStorage.setItem("user", JSON.stringify(data.user));
                }
            } else {
                alertType = "error";
                errorMessage =
                    data.message || "Login failed. Please try again.";
                showAlert = true;
            }
        } catch (error) {
            alertType = "error";
            errorMessage = "Network error. Please check your connection.";
            showAlert = true;
        } finally {
            isLoading = false;
        }
    };

    function handleOk() {
        if (alertType === "success") {
            showAlert = false;
            goto("/");
        } else {
            showAlert = false;
        }
    }

    function handleCancel() {
        showAlert = false;
    }
</script>

<div
    class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden"
>
    <div class="absolute inset-0 overflow-hidden text-black">
        <div
            class="absolute -top-1/2 -left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"
        ></div>
        <div
            class="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"
            style="animation-delay: 1s;"
        ></div>
    </div>

    <div class="relative w-full max-w-md">
        <div
            class="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75 transition duration-1000"
        ></div>
        <div
            class="relative bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm"
        >
            {#if showAlert}
                <div class="mb-6 transform transition-all duration-300">
                    <Alert
                        type={alertType}
                        title={alertType === "success" ? "Success" : "Error"}
                        message={alertType === "success"
                            ? successMessage
                            : errorMessage}
                        okText="OK"
                        cancelText="Close"
                        onOk={handleOk}
                        onCancel={handleCancel}
                    />
                </div>
            {/if}

            <div class="text-center mb-8">
                <div
                    class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300"
                >
                    <svg
                        class="w-8 h-8 text-white"
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
                </div>
                <h1
                    class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2"
                >
                    Welcome Back
                </h1>
                <p class="text-gray-500 text-sm">Sign in to your account</p>
            </div>

            <form on:submit={handleSubmit} class="space-y-6">
                <div class="relative">
                    <label
                        for="email"
                        class="block text-sm font-medium text-gray-700 mb-2"
                        >Email Address</label
                    >
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <svg
                                class={"w-5 h-5 transition-colors duration-200 " +
                                    (focused === "email"
                                        ? "text-indigo-500"
                                        : "text-gray-400")}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                ></path>
                            </svg>
                        </div>
                        <input
                            type="email"
                            id="email"
                            required
                            bind:value={email}
                            on:focus={() => (focused = "email")}
                            on:blur={() => (focused = "")}
                            class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none text-black"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div class="relative">
                    <label
                        for="password"
                        class="block text-sm font-medium text-gray-700 mb-2"
                        >Password</label
                    >
                    <div class="relative">
                        <div
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <svg
                                class={"w-5 h-5 transition-colors duration-200 " +
                                    (focused === "password"
                                        ? "text-indigo-500"
                                        : "text-gray-400")}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                ></path>
                            </svg>
                        </div>
                        <input
                            type="password"
                            id="password"
                            required
                            bind:value={password}
                            on:focus={() => (focused = "password")}
                            on:blur={() => (focused = "")}
                            class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none text-black"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {#if isLoading}
                        Logging in...
                    {:else}
                        Sign in
                    {/if}
                </button>
            </form>

            <p class="mt-6 text-center text-sm text-gray-600">
                don't have an account?
                <a
                    href="/signup"
                    class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                    Sign up
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

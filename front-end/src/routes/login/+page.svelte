<script lang="ts">
    import Alert from "$lib/components/Alert.svelte";

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
        errorMessage = "";
        successMessage = "";
        showAlert = false;
        isLoading = true;

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

                if (data.token) {
                    localStorage.setItem("authToken", data.token);
                }

                if (data.user) {
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
            errorMessage =
                "Network error. Please check your connection and try again.";
            showAlert = true;
        } finally {
            isLoading = false;
        }
    };

    function handleOk() {
        if (alertType === "success") {
            window.location.href = "/";
        }
        showAlert = false;
    }

    function handleCancel() {
        showAlert = false;
    }
</script>

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

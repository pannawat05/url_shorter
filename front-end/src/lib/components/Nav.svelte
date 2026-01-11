<script lang="ts">
  import { onMount } from "svelte";

  let isLogin = false;
  let menuOpen = false;

  onMount(() => {
    isLogin = !!localStorage.getItem("authToken");
  });

  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  }
</script>

<menu class="bg-white shadow-md mb-6">
  <!-- จำกัดความกว้าง + padding -->
  <div class="max-w-7xl mx-auto px-4 py-4">
    <div class="flex items-center">
      
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <img src="favicon.png" alt="Logo" class="w-10 h-10" />
        <h2 class="text-xl font-bold text-indigo-600">
          UrlShortener
        </h2>
      </div>

      <!-- Hamburger (mobile) -->
      <button
        class="ml-auto md:hidden text-gray-700"
        on:click={() => (menuOpen = !menuOpen)}
      >
        <svg
          class="w-7 h-7"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Menu (desktop) -->
      <ul class="hidden md:flex items-center gap-8 ml-auto">
        <li>
          <a href="/" class="font-medium text-gray-700 hover:text-indigo-600 transition">
            Home
          </a>
        </li>

        <li>
          <a href="/about" class="font-medium text-gray-700 hover:text-indigo-600 transition">
            About
          </a>
        </li>

        {#if !isLogin}
          <li>
            <a href="/login" class="font-medium text-gray-700 hover:text-indigo-600 transition">
              Login
            </a>
          </li>
        {/if}

        {#if isLogin}
          <li>
            <a href="/savedurl" class="font-medium text-gray-700 hover:text-indigo-600 transition">
              Your saved URL
            </a>
          </li>

          <li>
            <button
              on:click={logout}
              class="font-medium text-gray-700 hover:text-indigo-600 transition"
            >
              Logout
            </button>
          </li>
        {/if}
      </ul>
    </div>

    <!-- Menu (mobile dropdown) -->
    {#if menuOpen}
      <ul class="mt-4 flex flex-col gap-4 md:hidden">
        <li><a href="/" class="block text-gray-700">Home</a></li>
        <li><a href="/about" class="block text-gray-700">About</a></li>

        {#if !isLogin}
          <li><a href="/login" class="block text-gray-700">Login</a></li>
        {/if}

        {#if isLogin}
          <li><a href="/savedurl" class="block text-gray-700">Your saved URL</a></li>
          <li>
            <button on:click={logout} class="text-left text-gray-700">
              Logout
            </button>
          </li>
        {/if}
      </ul>
    {/if}
  </div>
</menu>

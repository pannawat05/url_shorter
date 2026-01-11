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

<menu class="bg-white p-4 rounded-xl shadow-md mb-6">
  <!-- Top bar -->
  <div class="flex items-center justify-between">
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <img src="favicon.png" alt="Logo" class="w-10 h-10" />
      <h2 class="text-xl font-bold text-indigo-600">UrlShortener</h2>
    </div>

    <!-- Hamburger (mobile only) -->
    <button
      class="md:hidden text-gray-700 focus:outline-none"
      on:click={() => (menuOpen = !menuOpen)}
    >
      <!-- icon -->
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
  </div>

  <!-- Menu -->
  <ul
    class={`mt-4 flex flex-col gap-5 items-center
      ${menuOpen ? "flex" : "hidden"}
      md:flex md:flex-row md:gap-8 md:mt-0`}
  >
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
</menu>

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
  <!-- Navbar container -->
  <div class="flex flex-col md:flex-row md:items-center md:justify-between">
    
    <!-- Logo -->
    <div class="flex items-center gap-2">
      <img src="favicon.png" alt="Logo" class="w-10 h-10" />
      <h2 class="text-xl font-bold text-indigo-600">UrlShortener</h2>
    </div>

    <!-- Hamburger (mobile only) -->
    <button
      class="md:hidden mt-2 self-end text-gray-700"
      on:click={() => (menuOpen = !menuOpen)}
    >
      <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Menu -->
    <ul
      class={`mt-4 flex flex-col gap-5 items-center
        ${menuOpen ? "flex" : "hidden"}
        md:flex md:flex-row md:gap-8 md:mt-0`}
    >
      <li><a href="/" class="font-medium text-gray-700 hover:text-indigo-600">Home</a></li>
      <li><a href="/about" class="font-medium text-gray-700 hover:text-indigo-600">About</a></li>
      <li><a href="/login" class="font-medium text-gray-700 hover:text-indigo-600">Login</a></li>
    </ul>
  </div>
</menu>

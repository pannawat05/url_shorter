<script lang="ts">
  import { onMount } from "svelte";

  let isLogin = false;

  onMount(() => {
    isLogin = !!localStorage.getItem("authToken");
  });

  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  }
</script>

<menu
  class="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col items-center gap-4 md:flex-row  md:gap-250"
>
<div class="title flex items-center gap-2">
  <img  src="favicon.png" alt="Logo" class="w-15 h-15"/>
  <h2 class="text-xl font-bold text-indigo-600">
    UrlShortener
  </h2>
  </div>

  <ul class="flex flex-col gap-5 md:flex-row md:gap-8 items-center">
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

     <li>
      <a href="/login" class="font-medium text-gray-700 hover:text-indigo-600 transition">
       login
      </a>
    </li>

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

<script>
  import Nav from "$lib/components/Nav.svelte";
</script>

<Nav />

<section class="max-w-3xl mx-auto py-20 px-6">
  <h1 class="text-4xl font-bold mb-6">
    About UrlShortener
  </h1>

  <p class="text-gray-700 mb-6 leading-relaxed">
    UrlShortener is a simple web application that helps users
    manage and store their shortened URLs in one place.
  </p>

  <p class="text-gray-700 mb-6 leading-relaxed">
    This project is designed to be fast, minimal, and easy to use,
    focusing on productivity and clean UI.
  </p>

  <h2 class="text-2xl font-semibold mt-10 mb-4">
    Features
  </h2>

  <ul class="list-disc pl-6 text-gray-700 space-y-2">
    <li>Create and save short URLs</li>
    <li>Manage your saved links</li>
    <li>Fast redirect performance</li>
    <li>Simple and clean interface</li>
  </ul>

  <h2 class="text-2xl font-semibold mt-10 mb-4">
    Tech Stack
  </h2>

  <p class="text-gray-700">
    SvelteKit • Tailwind CSS • REST API Backend (MERN)
  </p>
</section>

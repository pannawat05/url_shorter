<script>
  import Nav from "$lib/components/Nav.svelte";
</script>

<Nav />

<section class="text-center py-24 px-6">
  <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
    Short links.<br />Simple & Powerful.
  </h1>

  <p class="max-w-xl mx-auto text-gray-600 text-lg mb-10">
    UrlShortener helps you create clean, memorable short links
    and manage them in one place.
  </p>

  <div class="flex justify-center gap-4">
    <a
      href="/login"
      class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
    >
      Get Started
    </a>

    <a
      href="/about"
      class="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
    >
      Learn More
    </a>
  </div>
</section>

<section class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6 pb-20">
  <div class="p-6 border rounded-xl text-center">
    <h3 class="font-bold text-lg mb-2">⚡ Fast</h3>
    <p class="text-gray-600">
      Create and redirect short links instantly.
    </p>
  </div>

  <div class="p-6 border rounded-xl text-center">
    <h3 class="font-bold text-lg mb-2">📊 Trackable</h3>
    <p class="text-gray-600">
      Keep track of your saved URLs.
    </p>
  </div>

  <div class="p-6 border rounded-xl text-center">
    <h3 class="font-bold text-lg mb-2">🔐 Secure</h3>
    <p class="text-gray-600">
      Your links are private and safe.
    </p>
  </div>
</section>

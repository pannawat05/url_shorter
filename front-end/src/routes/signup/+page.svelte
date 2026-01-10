<script lang="ts">
  import { PUBLIC_API_URL } from '$env/static/public';
  let email: string = '';
  let password: string = '';
  let focused = '';
   const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const response = await fetch(`${PUBLIC_API_URL}signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Handle successful signup (e.g., redirect to login or dashboard)
      console.log('Signup successful');
    } else {
      // Handle errors (e.g., display error message)
      console.error('Signup failed');
    }
  };
</script>

<div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
  <!-- Animated background elements -->
  <div class="absolute inset-0 overflow-hidden">
    <div class="absolute -top-1/2 -left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
    <div class="absolute -bottom-1/2 -right-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse" style="animation-delay: 1s;"></div>
  </div>

  <!-- Main card -->
  <div class="relative w-full max-w-md">
    <div class="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75 transition duration-1000"></div>
    <div class="relative bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>
        <p class="text-gray-500 text-sm">Start your journey with us today</p>
      </div>

      <!-- Form -->
      <form on:submit={handleSubmit} class="space-y-6">
        <!-- Email field -->
        <div class="relative">
          <label 
            for="email" 
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class={"w-5 h-5 transition-colors duration-200 " + (focused === 'email' ? 'text-indigo-500' : 'text-gray-400')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <input
              type="email"
              id="email"
              required
              bind:value={email}
              on:focus={() => focused = 'email'}
              on:blur={() => focused = ''}
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <!-- Password field -->
        <div class="relative">
          <label 
            for="password" 
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class={"w-5 h-5 transition-colors duration-200 " + (focused === 'password' ? 'text-indigo-500' : 'text-gray-400')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <input
              type="password"
              id="password"
              required
              bind:value={password}
              on:focus={() => focused = 'password'}
              on:blur={() => focused = ''}
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Sign Up
        </button>
      </form>

      <!-- Footer -->
      <p class="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
          Sign in
        </a>
      </p>
    </div>
  </div>
</div>

<style>
  /* Ensure Tailwind utilities work properly */
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
</style>
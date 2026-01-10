import staticAdapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    adapter: staticAdapter({
      fallback: 'index.html'
    })
  }
};

export default config;

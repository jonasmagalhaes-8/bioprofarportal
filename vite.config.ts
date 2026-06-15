import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import routify from '@roxi/routify/vite-plugin';

export default defineConfig({
  plugins: [
    routify({
      routesDir: {
        default: 'src/routes',
      },
    }),
    svelte({
      compilerOptions: {
        customElement: false,
      },
    }),
  ],
  resolve: {
    alias: {
      $models: '/src/models',
      $controllers: '/src/controllers',
      $services: '/src/services',
      $components: '/src/components',
      $stores: '/src/stores',
    },
  },
  server: {
    port: 5173,
  },
});

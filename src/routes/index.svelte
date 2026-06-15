<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '@roxi/routify';

  onMount(() => {
    $goto('/inicio');
  });
</script>

<div class="loading-page">
  <p>Carregando...</p>
</div>

<style>
  .loading-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #7a8a6a;
  }
</style>

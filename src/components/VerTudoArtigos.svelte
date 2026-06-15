<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let artigos: any[] = [];
  export let tema: number = 1;

  const dispatch = createEventDispatcher();

  let busca: string = '';
  let overlayEl: HTMLDivElement | undefined;

  const temas = {
    1: { bg: '#ffffff', text: '#333333', accent: '#4a5d3c', secondaryAccent: '#7a8a6a', border: '#e0e0e0', headerBg: '#4a5d3c' },
    2: { bg: '#ffffff', text: '#4a3728', accent: '#c97b3a', secondaryAccent: '#b8935e', border: '#e8d5c0', headerBg: '#c97b3a' },
    3: { bg: '#2d3a24', text: '#d4e0cc', accent: '#8cb369', secondaryAccent: '#6b8f5b', border: '#3d4f31', headerBg: '#1f2b1a' },
    4: { bg: '#ffffff', text: '#2c3e50', accent: '#4a5d3c', secondaryAccent: '#7a8a6a', border: '#e0e0e0', headerBg: '#4a5d3c' },
    5: { bg: '#2d3a24', text: '#c8d6c0', accent: '#6b8f5b', secondaryAccent: '#8cb369', border: '#3d4f31', headerBg: '#1a2615' }
  };

  $: temaAtual = temas[tema] || temas[1];
  $: artigosFiltrados = artigos.filter(a => {
    if (!busca.trim()) return true;
    const termo = busca.toLowerCase().trim();
    return (
      (a.titulo && a.titulo.toLowerCase().includes(termo)) ||
      (a.autores && a.autores.toLowerCase().includes(termo)) ||
      (a.journal && a.journal.toLowerCase().includes(termo)) ||
      (a.resumo && a.resumo.toLowerCase().includes(termo))
    );
  });

  function handleClose() {
    dispatch('close');
  }

  function handleSelect(artigo: any) {
    dispatch('select', { artigo });
  }

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === overlayEl) {
      handleClose();
    }
  }

  function onDocumentKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }

  function formatarData(data: string): string {
    if (!data) return '';
    try {
      return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return data;
    }
  }

  function truncar(texto: string, max: number = 200): string {
    if (!texto) return '';
    return texto.length > max ? texto.substring(0, max) + '...' : texto;
  }

  onMount(() => {
    document.addEventListener('keydown', onDocumentKeydown);
    document.body.style.overflow = 'hidden';
  });

  onDestroy(() => {
    document.removeEventListener('keydown', onDocumentKeydown);
    document.body.style.overflow = '';
  });
</script>

<div class="overlay" bind:this={overlayEl} on:click={handleOverlayClick}>
  <div class="modal" on:click|stopPropagation>
    <div class="modal-header" style="background: {temaAtual.headerBg};">
      <h2 class="modal-title" style="color: #ffffff;">Todos os Artigos</h2>
      <button class="close-btn" style="color: #ffffff;" on:click={handleClose} aria-label="Fechar">&times;</button>
    </div>

    <div class="modal-body">
      <div class="search-bar">
        <span class="search-icon">&#128269;</span>
        <input
          type="text"
          bind:value={busca}
          placeholder="Buscar artigo..."
          class="search-input"
        />
        {#if busca}
          <button class="search-clear" on:click={() => (busca = '')} aria-label="Limpar busca">&times;</button>
        {/if}
      </div>

      <p class="result-count">
        {artigosFiltrados.length} {artigosFiltrados.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
      </p>

      {#if artigosFiltrados.length === 0}
        <div class="empty">
          <p>{busca ? 'Nenhum artigo encontrado para esta busca.' : 'Nenhum artigo disponível.'}</p>
        </div>
      {:else}
        <div class="artigos-list">
          {#each artigosFiltrados as artigo, i}
            <div
              class="artigo-card"
              style="background: {temaAtual.bg}; color: {temaAtual.text}; border-color: {temaAtual.border};"
              on:click={() => handleSelect(artigo)}
              on:keydown={(e) => e.key === 'Enter' && handleSelect(artigo)}
              role="button"
              tabindex="0"
            >
              <div class="artigo-indice" style="background: {temaAtual.accent};">
                {i + 1}
              </div>

              <div class="artigo-conteudo">
                <h3 class="artigo-titulo" style="color: {temaAtual.accent};">
                  {artigo.titulo || 'Sem título'}
                </h3>

                {#if artigo.autores}
                  <p class="artigo-autores">
                    <span class="label">Autores:</span> {artigo.autores}
                  </p>
                {/if}

                <div class="artigo-meta">
                  {#if artigo.journal}
                    <span class="meta-journal" style="color: {temaAtual.secondaryAccent};">{artigo.journal}</span>
                  {/if}
                  {#if artigo.data}
                    <span class="meta-separator">•</span>
                    <span class="meta-date">{formatarData(artigo.data)}</span>
                  {/if}
                  {#if artigo.ano}
                    <span class="meta-separator">•</span>
                    <span class="meta-date">{artigo.ano}</span>
                  {/if}
                </div>

                {#if artigo.resumo}
                  <p class="artigo-resumo">{truncar(artigo.resumo)}</p>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    overflow-y: auto;
    padding: 20px;
  }

  .modal {
    background-color: #ffffff;
    border-radius: 8px;
    width: 98%;
    height: 95vh;
    max-height: 98vh;
    overflow-y: auto;
    position: relative;
  }

  .modal-header {
    padding: 20px 40px;
    border-bottom: 2px solid #e8ddc5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: #ffffff;
    z-index: 10;
  }

  .modal-title {
    margin: 0;
    color: #4a5d3c;
    font-size: 28px;
    font-weight: bold;
  }

  .close-btn {
    padding: 8px;
    background-color: transparent;
    color: #4a5d3c;
    border: none;
    cursor: pointer;
    font-size: 24px;
    font-weight: bold;
    line-height: 1;
  }

  .modal-body {
    padding: 20px;
  }

  .search-bar {
    /* Container if needed, but styling goes to input */
  }

  .search-icon {
    display: none;
  }

  .search-input {
    width: 100%;
    padding: 12px;
    margin-bottom: 20px;
    border: 2px solid #e8ddc5;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .search-clear {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #888;
    font-size: 18px;
  }

  .result-count {
    display: none; /* Not in React */
  }

  .empty {
    text-align: center;
    padding: 40px;
    color: #7a8a6a;
  }

  .artigos-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
    margin-bottom: 20px;
  }

  .artigo-card {
    padding: 20px;
    border-radius: 8px;
    border: 2px solid #e8ddc5;
    background-color: #ffffff;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    display: block; /* React does not use flex for card content here */
  }

  .artigo-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .artigo-indice {
    display: none; /* Not in React */
  }

  .artigo-conteudo {
    /* No special flex styling in React */
  }

  .artigo-titulo {
    margin-bottom: 10px;
    color: #4a5d3c;
    font-size: 18px;
    margin-top: 0;
  }

  .artigo-autores {
    font-size: 13px;
    color: #7a8a6a;
    margin-bottom: 8px;
    margin-top: 0;
  }

  .artigo-autores .label {
    font-weight: bold;
  }

  .artigo-meta {
    font-size: 13px;
    color: #666;
    margin-bottom: 10px;
  }

  .meta-journal {
    /* Just normal text */
  }

  .meta-date {
    /* Just normal text */
  }

  .meta-separator {
    /* Just normal text */
  }

  .artigo-resumo {
    line-height: 1.6;
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  @media (max-width: 768px) {
    .modal {
      width: 100%;
      height: 100%;
      max-height: 100vh;
      border-radius: 0;
    }
  }
</style>

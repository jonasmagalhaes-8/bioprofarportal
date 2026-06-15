<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let noticias: any[] = [];
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
  $: noticiasFiltradas = noticias.filter(n => {
    if (!busca.trim()) return true;
    const termo = busca.toLowerCase().trim();
    return (
      (n.titulo && n.titulo.toLowerCase().includes(termo)) ||
      (n.conteudo && n.conteudo.toLowerCase().includes(termo)) ||
      (n.autor && n.autor.toLowerCase().includes(termo))
    );
  });

  function handleClose() {
    dispatch('close');
  }

  function handleSelect(noticia: any) {
    dispatch('select', { noticia });
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

  function truncar(texto: string, max: number = 150): string {
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
      <h2 class="modal-title" style="color: #ffffff;">Todas as Notícias</h2>
      <button class="close-btn" style="color: #ffffff;" on:click={handleClose} aria-label="Fechar">&times;</button>
    </div>

    <div class="modal-body">
      <div class="search-bar">
        <span class="search-icon">&#128269;</span>
        <input
          type="text"
          bind:value={busca}
          placeholder="Buscar notícias..."
          class="search-input"
        />
        {#if busca}
          <button class="search-clear" on:click={() => (busca = '')} aria-label="Limpar busca">&times;</button>
        {/if}
      </div>

      <p class="result-count">
        {noticiasFiltradas.length} {noticiasFiltradas.length === 1 ? 'notícia encontrada' : 'notícias encontradas'}
      </p>

      {#if noticiasFiltradas.length === 0}
        <div class="empty">
          <p>{busca ? 'Nenhuma notícia encontrada para esta busca.' : 'Nenhuma notícia disponível.'}</p>
        </div>
      {:else}
        <div class="noticias-grid">
          {#each noticiasFiltradas as noticia, i}
            <div
              class="noticia-card"
              style="background: {temaAtual.bg}; color: {temaAtual.text}; border-color: {temaAtual.border};"
              on:click={() => handleSelect(noticia)}
              on:keydown={(e) => e.key === 'Enter' && handleSelect(noticia)}
              role="button"
              tabindex="0"
            >
              {#if noticia.imagens && noticia.imagens.length > 0}
                <div class="noticia-imagem-wrapper">
                  <img src={noticia.imagens[0]} alt={noticia.titulo || 'Notícia'} class="noticia-imagem" />
                </div>
              {:else if noticia.imagemUrl}
                <div class="noticia-imagem-wrapper">
                  <img src={noticia.imagemUrl} alt={noticia.titulo || 'Notícia'} class="noticia-imagem" />
                </div>
              {/if}

              <div class="noticia-conteudo">
                <h3 class="noticia-titulo" style="color: {temaAtual.accent};">
                  {noticia.titulo || 'Sem título'}
                </h3>

                <div class="noticia-meta">
                  {#if noticia.data}
                    <span class="meta-item">{formatarData(noticia.data)}</span>
                  {/if}
                  {#if noticia.autor}
                    <span class="meta-separator">•</span>
                    <span class="meta-item">{noticia.autor}</span>
                  {/if}
                </div>

                {#if noticia.conteudo}
                  <p class="noticia-preview">{truncar(noticia.conteudo)}</p>
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
    /* Container */
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
    display: none;
  }

  .empty {
    text-align: center;
    padding: 40px;
    color: #7a8a6a;
  }

  .noticias-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 25px;
    margin-bottom: 20px;
  }

  .noticia-card {
    padding: 0;
    border-radius: 8px;
    border: 2px solid #e8ddc5;
    background-color: #ffffff;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .noticia-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .noticia-imagem-wrapper {
    /* Structure */
  }

  .noticia-imagem {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    object-position: top;
    background-color: #f4f5f1;
    border-radius: 0;
    margin-bottom: 0;
    display: block;
  }

  .noticia-conteudo {
    padding: 20px;
    flex: 1;
  }

  .noticia-titulo {
    margin-bottom: 10px;
    color: #4a5d3c;
    font-size: 18px;
    margin-top: 0;
  }

  .noticia-meta {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }

  .meta-separator {
    /* Normal text */
  }

  .noticia-preview {
    line-height: 1.6;
    color: #666;
    font-size: 14px;
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

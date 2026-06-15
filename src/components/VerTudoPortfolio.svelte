<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let itens: any[] = [];
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
  $: itensFiltrados = itens.filter(item => {
    if (!busca.trim()) return true;
    const termo = busca.toLowerCase().trim();
    return (
      (item.titulo && item.titulo.toLowerCase().includes(termo)) ||
      (item.tipo && item.tipo.toLowerCase().includes(termo)) ||
      (item.descricao && item.descricao.toLowerCase().includes(termo)) ||
      (item.ano && String(item.ano).includes(termo))
    );
  });

  function handleClose() {
    dispatch('close');
  }

  function handleSelect(item: any) {
    dispatch('select', { item });
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
      <h2 class="modal-title" style="color: #ffffff;">Todo o Portfólio</h2>
      <button class="close-btn" style="color: #ffffff;" on:click={handleClose} aria-label="Fechar">&times;</button>
    </div>

    <div class="modal-body">
      <div class="search-bar">
        <span class="search-icon">&#128269;</span>
        <input
          type="text"
          bind:value={busca}
          placeholder="Buscar item..."
          class="search-input"
        />
        {#if busca}
          <button class="search-clear" on:click={() => (busca = '')} aria-label="Limpar busca">&times;</button>
        {/if}
      </div>

      <p class="result-count">
        {itensFiltrados.length} {itensFiltrados.length === 1 ? 'item encontrado' : 'itens encontrados'}
      </p>

      {#if itensFiltrados.length === 0}
        <div class="empty">
          <p>{busca ? 'Nenhum item encontrado para esta busca.' : 'Nenhum item do portfólio disponível.'}</p>
        </div>
      {:else}
        <div class="portfolio-grid">
          {#each itensFiltrados as item, i}
            <div
              class="portfolio-card"
              style="background: {temaAtual.bg}; color: {temaAtual.text}; border-color: {temaAtual.border};"
              on:click={() => handleSelect(item)}
              on:keydown={(e) => e.key === 'Enter' && handleSelect(item)}
              role="button"
              tabindex="0"
            >
              {#if item.imagemUrl}
                <div class="portfolio-imagem-wrapper">
                  <img src={item.imagemUrl} alt={item.titulo || 'Item'} class="portfolio-imagem" />
                  {#if item.tipo || item.ano}
                    <div class="portfolio-badge" style="background: {temaAtual.accent};">
                      {item.tipo || ''}{item.tipo && item.ano ? ' • ' : ''}{item.ano || ''}
                    </div>
                  {/if}
                </div>
              {:else}
                {#if item.tipo || item.ano}
                  <div class="portfolio-badge-only" style="background: {temaAtual.accent}; color: #ffffff;">
                    {item.tipo || ''}{item.tipo && item.ano ? ' • ' : ''}{item.ano || ''}
                  </div>
                {/if}
              {/if}

              <div class="portfolio-conteudo">
                <h3 class="portfolio-titulo" style="color: {temaAtual.accent};">
                  {item.titulo || 'Sem título'}
                </h3>

                {#if !item.imagemUrl && (item.tipo || item.ano)}
                  <!-- badge already shown above -->
                {:else if item.tipo || item.ano}
                  <p class="portfolio-tipo-ano">
                    {item.tipo || ''}{item.tipo && item.ano ? ' • ' : ''}{item.ano || ''}
                  </p>
                {/if}

                {#if item.descricao}
                  <p class="portfolio-descricao">{truncar(item.descricao)}</p>
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

  .portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
    margin-bottom: 20px;
  }

  .portfolio-card {
    padding: 20px;
    border-radius: 8px;
    border: 2px solid #e8ddc5;
    background-color: #ffffff;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .portfolio-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .portfolio-imagem-wrapper {
    /* Structure */
  }

  .portfolio-imagem {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 6px;
    margin-bottom: 15px;
  }

  .portfolio-badge {
    display: none;
  }

  .portfolio-badge-only {
    display: none;
  }

  .portfolio-conteudo {
    /* Structure */
  }

  .portfolio-titulo {
    margin-bottom: 10px;
    color: #4a5d3c;
    font-size: 18px;
    margin-top: 0;
  }

  .portfolio-tipo-ano {
    font-size: 13px;
    color: #7a8a6a;
    margin-bottom: 8px;
    font-weight: bold;
    margin-top: 0;
  }

  .portfolio-descricao {
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

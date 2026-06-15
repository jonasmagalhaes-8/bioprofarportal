<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let membros: any[] = [];
  export let tema: number = 1;
  export let titulo: string = 'Toda a Equipe';

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
  $: membrosFiltrados = membros.filter(m => {
    if (!busca.trim()) return true;
    const termo = busca.toLowerCase().trim();
    return (
      (m.nome && m.nome.toLowerCase().includes(termo)) ||
      (m.cargo && m.cargo.toLowerCase().includes(termo)) ||
      (m.instituicao && m.instituicao.toLowerCase().includes(termo)) ||
      (m.descricao && m.descricao.toLowerCase().includes(termo))
    );
  });

  function handleClose() {
    dispatch('close');
  }

  function handleSelect(membro: any) {
    dispatch('select', { membro });
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

  function truncar(texto: string, max: number = 120): string {
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
      <h2 class="modal-title" style="color: #ffffff;">{titulo}</h2>
      <button class="close-btn" style="color: #ffffff;" on:click={handleClose} aria-label="Fechar">&times;</button>
    </div>

    <div class="modal-body">
      <div class="search-bar">
        <span class="search-icon">&#128269;</span>
        <input
          type="text"
          bind:value={busca}
          placeholder="Buscar membro..."
          class="search-input"
        />
        {#if busca}
          <button class="search-clear" on:click={() => (busca = '')} aria-label="Limpar busca">&times;</button>
        {/if}
      </div>

      <p class="result-count">
        {membrosFiltrados.length} {membrosFiltrados.length === 1 ? 'membro encontrado' : 'membros encontrados'}
      </p>

      {#if membrosFiltrados.length === 0}
        <div class="empty">
          <p>{busca ? 'Nenhum membro encontrado para esta busca.' : 'Nenhum membro da equipe disponível.'}</p>
        </div>
      {:else}
        <div class="equipe-grid">
          {#each membrosFiltrados as membro, i}
            <div
              class="membro-card"
              style="background: {temaAtual.bg}; color: {temaAtual.text}; border-color: {temaAtual.border};"
              on:click={() => handleSelect(membro)}
              on:keydown={(e) => e.key === 'Enter' && handleSelect(membro)}
              role="button"
              tabindex="0"
            >
              <div class="membro-foto-wrapper">
                {#if membro.fotoUrl}
                  <img src={membro.fotoUrl} alt={membro.nome || 'Membro'} class="membro-foto" />
                {:else}
                  <div class="membro-foto-placeholder" style="background: {temaAtual.accent};">
                    {membro.nome ? membro.nome.charAt(0).toUpperCase() : '?'}
                  </div>
                {/if}
              </div>

              <div class="membro-info">
                <h3 class="membro-nome" style="color: {temaAtual.accent};">
                  {membro.nome || 'Sem nome'}
                </h3>

                {#if membro.cargo}
                  <p class="membro-cargo">{membro.cargo}</p>
                {/if}

                {#if membro.instituicao}
                  <p class="membro-instituicao">{membro.instituicao}</p>
                {/if}

                {#if membro.descricao}
                  <p class="membro-descricao">{truncar(membro.descricao)}</p>
                {/if}

                {#if membro.lattes}
                  <a
                    href={membro.lattes}
                    target="_blank"
                    rel="noopener"
                    class="lattes-link"
                    style="color: {temaAtual.accent};"
                    on:click|stopPropagation
                  >
                    Currículo Lattes
                  </a>
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

  .equipe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
    margin-bottom: 20px;
  }

  .membro-card {
    padding: 25px;
    border-radius: 8px;
    text-align: center;
    background-color: #ffffff;
    border: 2px solid #e8ddc5;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s;
    cursor: pointer;
  }

  .membro-card:hover {
    transform: translateY(-5px);
  }

  .membro-foto-wrapper {
    /* Structure */
  }

  .membro-foto {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 15px;
    border: 4px solid #7a8a6a;
    display: block; /* React img usually renders block or inline-block, margin 0 auto centres it */
  }

  .membro-foto-placeholder {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 2rem;
    font-weight: 700;
  }

  .membro-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .membro-nome {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
    color: #4a5d3c;
    margin-top: 0;
  }

  .membro-cargo {
    font-size: 14px;
    color: #7a8a6a;
    margin-bottom: 8px;
    font-weight: bold;
    margin-top: 0;
  }

  .membro-instituicao {
    font-size: 13px;
    color: #7a8a6a;
    margin-bottom: 10px;
    margin-top: 0;
  }

  .membro-descricao {
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 10px;
    color: #666;
    margin-top: 0;
  }

  .lattes-link {
    font-size: 12px;
    color: #7a8a6a;
    text-decoration: underline;
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

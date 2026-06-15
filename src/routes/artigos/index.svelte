<script lang="ts">
  import { onMount } from 'svelte';
  import {
    tema, layout, usuario, isAdmin, refreshTrigger,
    showFormArtigo, showGerenciarArtigos,
    artigoEditando
  } from '../../stores/appStore';
  import { controllerListarArtigos, controllerDeletarArtigo } from '../../controllers/ArtigoController';






  let artigos: any[] = [];
  let busca: string = '';
  let artigoExpandido: number | null = null;
  let confirmarDelete: any = null;

  const temas = {
    1: { bg: '#f5f5f0', cardBg: '#ffffff', text: '#333333', heading: '#2c3e2c', accent: '#4a5d3c', accentLight: '#8cb369', border: '#e0e0e0', headerBg: '#4a5d3c' },
    2: { bg: '#fef5e7', cardBg: '#ffffff', text: '#5a4a3a', heading: '#4a3728', accent: '#c97b3a', accentLight: '#e8a85c', border: '#e8d5c0', headerBg: '#c97b3a' },
    3: { bg: '#1a2615', cardBg: '#2d3a24', text: '#c8d6c0', heading: '#e0ead8', accent: '#8cb369', accentLight: '#6b8f5b', border: '#3d4f31', headerBg: '#1f2b1a' },
    4: { bg: '#f8f9fa', cardBg: '#ffffff', text: '#2c3e50', heading: '#1a252f', accent: '#4a5d3c', accentLight: '#7a8a6a', border: '#dee2e6', headerBg: '#4a5d3c' },
    5: { bg: '#0f1a0a', cardBg: '#1f2b1a', text: '#a8b8a0', heading: '#d4e0cc', accent: '#6b8f5b', accentLight: '#8cb369', border: '#2d3a24', headerBg: '#1a2615' }
  };

  $: temaAtual = temas[$tema] || temas[1];

  $: artigosFiltrados = artigos.filter(a => {
    if (!busca.trim()) return true;
    const termo = busca.toLowerCase().trim();
    return (
      (a.titulo && a.titulo.toLowerCase().includes(termo)) ||
      (a.autores && a.autores.toLowerCase().includes(termo)) ||
      (a.resumo && a.resumo.toLowerCase().includes(termo)) ||
      (a.revista && a.revista.toLowerCase().includes(termo)) ||
      (a.doi && a.doi.toLowerCase().includes(termo))
    );
  });

  onMount(async () => {
    await loadArtigos();
  });

  $: if ($refreshTrigger) {
    loadArtigos();
  }

  async function loadArtigos() {
    try {
      const resultado = await controllerListarArtigos();
      artigos = resultado.response || resultado || [];
    } catch (err) {
      console.error('Erro ao carregar artigos:', err);
    }
  }

  function formatarData(data: string) {
    if (!data) return '';
    try {
      return new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return data; }
  }

  function truncar(texto: string, max: number = 200) {
    if (!texto) return '';
    return texto.length > max ? texto.substring(0, max) + '...' : texto;
  }

  function toggleExpand(artigo: any) {
    artigoExpandido = artigoExpandido === artigo.id ? null : artigo.id;
  }

  function openAddArtigo() {
    artigoEditando.set(null);
    showFormArtigo.set(true);
  }

  function openEditArtigo(artigo: any) {
    artigoEditando.set(artigo);
    showFormArtigo.set(true);
  }

  function solicitarDelete(artigo: any) {
    confirmarDelete = artigo;
  }

  function cancelarDelete() {
    confirmarDelete = null;
  }

  async function confirmarDeleteAction() {
    if (!confirmarDelete) return;
    try {
      await controllerDeletarArtigo(confirmarDelete.id);
      artigos = artigos.filter(a => a.id !== confirmarDelete.id);
      confirmarDelete = null;
    } catch (err) {
      console.error('Erro ao deletar artigo:', err);
      confirmarDelete = null;
    }
  }
</script>

<div class="page-artigos" style="background: {temaAtual.bg}; color: {temaAtual.text};">

  <!-- HERO BANNER -->
  <section class="artigos-hero" style="background: {temaAtual.headerBg};">
    <div class="artigos-hero-inner">
      <h1 class="artigos-hero-titulo" style="color: #ffffff;">Artigos</h1>
      <p class="artigos-hero-sub" style="color: rgba(255,255,255,0.85);">Publicações científicas da rede BioprFar-BA</p>
    </div>
  </section>

  <div class="artigos-content">
    <!-- SEARCH BAR -->
    <div class="search-section">
      <div class="search-bar" style="border-color: {temaAtual.border};">
        <span class="search-icon">&#128269;</span>
        <input
          type="text"
          bind:value={busca}
          placeholder="Buscar artigo por título, autor, revista..."
          class="search-input"
          style="background: {temaAtual.cardBg}; color: {temaAtual.text}; border-color: {temaAtual.border};"
        />
        {#if busca}
          <button class="search-clear" on:click={() => busca = ''}>&times;</button>
        {/if}
      </div>
      <p class="result-count" style="color: {temaAtual.accentLight};">
        {artigosFiltrados.length} {artigosFiltrados.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
      </p>
    </div>

    <!-- ADMIN ACTIONS -->
    {#if $isAdmin}
      <div class="admin-bar" style="border-color: {temaAtual.border};">
        <button class="btn-admin" style="background: {temaAtual.accent}; color: #ffffff;" on:click={openAddArtigo}>
          + Novo Artigo
        </button>
        <button class="btn-admin" style="background: none; color: {temaAtual.accent}; border: 1px solid {temaAtual.accent};" on:click={() => showGerenciarArtigos.set(true)}>
          Gerenciar Artigos
        </button>
      </div>
    {/if}

    <!-- ARTIGOS LIST -->
    {#if artigosFiltrados.length === 0}
      <div class="empty">
        <p>{busca ? 'Nenhum artigo encontrado para esta busca.' : 'Nenhum artigo disponível.'}</p>
      </div>
    {:else}
      <div class="artigos-list">
        {#each artigosFiltrados as artigo, i}
          <div class="artigo-card" style="background: {temaAtual.cardBg}; border-color: {temaAtual.border};">
            <div class="artigo-top" on:click={() => toggleExpand(artigo)} role="button" tabindex="0">
              <div class="artigo-indice" style="background: {temaAtual.accent};">
                {i + 1}
              </div>
              <div class="artigo-main">
                <h3 class="artigo-titulo" style="color: {temaAtual.accent};">{artigo.titulo || 'Sem título'}</h3>
                {#if artigo.autores}
                  <p class="artigo-autores"><span class="label">Autores:</span> {artigo.autores}</p>
                {/if}
                <div class="artigo-meta">
                  {#if artigo.revista}
                    <span class="meta-journal" style="color: {temaAtual.accentLight};">{artigo.revista}</span>
                  {/if}
                  {#if artigo.dataPublicacao}
                    <span class="meta-sep">&bull;</span>
                    <span class="meta-date">{formatarData(artigo.dataPublicacao)}</span>
                  {/if}
                </div>
                {#if artigo.resumo && artigoExpandido !== artigo.id}
                  <p class="artigo-resumo">{truncar(artigo.resumo)}</p>
                {/if}
              </div>
              <div class="expand-icon" style="color: {temaAtual.accent};">
                {artigoExpandido === artigo.id ? '▲' : '▼'}
              </div>
            </div>

            {#if artigoExpandido === artigo.id}
              <div class="artigo-expanded">
                {#if artigo.resumo}
                  <div class="expanded-section">
                    <h4 class="expanded-label" style="color: {temaAtual.heading};">Resumo</h4>
                    <p class="expanded-text">{artigo.resumo}</p>
                  </div>
                {/if}
                {#if artigo.conteudo}
                  <div class="expanded-section">
                    <h4 class="expanded-label" style="color: {temaAtual.heading};">Conteúdo</h4>
                    <p class="expanded-text">{artigo.conteudo}</p>
                  </div>
                {/if}
                {#if artigo.doi}
                  <p class="artigo-doi">
                    DOI: <a href="https://doi.org/{artigo.doi}" target="_blank" rel="noopener" style="color: {temaAtual.accent};">{artigo.doi}</a>
                  </p>
                {/if}
                {#if $isAdmin}
                  <div class="artigo-actions">
                    <button class="btn-action btn-edit" style="border-color: {temaAtual.accent}; color: {temaAtual.accent};" on:click={() => openEditArtigo(artigo)}>Editar</button>
                    <button class="btn-action btn-delete" on:click={() => solicitarDelete(artigo)}>Excluir</button>
                  </div>
                {/if}
              </div>
            {/if}

            {#if $isAdmin && artigoExpandido !== artigo.id}
              <div class="artigo-quick-actions">
                <button class="btn-action-sm" style="color: {temaAtual.accentLight};" on:click|stopPropagation={() => openEditArtigo(artigo)}>Editar</button>
                <button class="btn-action-sm btn-delete-sm" on:click|stopPropagation={() => solicitarDelete(artigo)}>Excluir</button>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- DELETE CONFIRMATION -->
  {#if confirmarDelete}
    <div class="confirm-overlay" on:click={cancelarDelete}>
      <div class="confirm-dialog" on:click|stopPropagation style="background: {temaAtual.cardBg};">
        <p>Tem certeza que deseja excluir <strong>{confirmarDelete.titulo}</strong>?</p>
        <div class="confirm-actions">
          <button class="btn-cancel" on:click={cancelarDelete}>Cancelar</button>
          <button class="btn-confirm-delete" on:click={confirmarDeleteAction}>Excluir</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .page-artigos {
    min-height: 100vh;
  }

  .artigos-hero {
    padding: 60px 0;
  }

  .artigos-hero-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
  }

  .artigos-hero-titulo {
    margin: 0 0 8px;
    font-size: 2.5rem;
    font-weight: 800;
  }

  .artigos-hero-sub {
    margin: 0;
    font-size: 1.1rem;
  }

  .artigos-content {
    max-width: 1000px;
    margin: 0 auto;
    padding: 30px 20px 60px;
  }

  /* SEARCH */
  .search-section {
    margin-bottom: 24px;
  }

  .search-bar {
    position: relative;
    display: flex;
    align-items: center;
    border: 2px solid;
    border-radius: 10px;
    overflow: hidden;
  }

  .search-icon {
    position: absolute;
    left: 14px;
    font-size: 1rem;
    opacity: 0.5;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 12px 40px 12px 42px;
    border: none;
    font-size: 0.95rem;
    transition: border-color 0.2s;
    box-sizing: border-box;
    outline: none;
  }

  .search-input:focus {
    box-shadow: 0 0 0 3px rgba(74, 93, 60, 0.15);
  }

  .search-input::placeholder { color: #999; }

  .search-clear {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.3rem;
    cursor: pointer;
    color: #888;
    padding: 4px 8px;
    line-height: 1;
  }

  .result-count {
    margin: 10px 0 0;
    font-size: 0.85rem;
    font-weight: 500;
  }

  /* ADMIN BAR */
  .admin-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid;
  }

  .btn-admin {
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-admin:hover { opacity: 0.85; }

  /* EMPTY */
  .empty {
    text-align: center;
    padding: 60px 20px;
    font-size: 1rem;
    opacity: 0.7;
  }

  /* ARTIGOS LIST */
  .artigos-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .artigo-card {
    border: 1px solid;
    border-radius: 12px;
    overflow: hidden;
    transition: box-shadow 0.2s;
  }

  .artigo-card:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  }

  .artigo-top {
    display: flex;
    gap: 18px;
    align-items: flex-start;
    padding: 20px 24px;
    cursor: pointer;
  }

  .artigo-indice {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 0.88rem;
    font-weight: 700;
  }

  .artigo-main {
    flex: 1;
    min-width: 0;
  }

  .artigo-titulo {
    margin: 0 0 8px;
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.35;
  }

  .artigo-autores {
    margin: 0 0 8px;
    font-size: 0.88rem;
    opacity: 0.85;
  }

  .artigo-autores .label {
    font-weight: 600;
    opacity: 0.7;
  }

  .artigo-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 0.82rem;
  }

  .meta-journal {
    font-weight: 600;
    font-style: italic;
  }

  .meta-date {
    opacity: 0.7;
  }

  .meta-sep {
    opacity: 0.4;
    font-size: 0.75rem;
  }

  .artigo-resumo {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.55;
    opacity: 0.75;
  }

  .expand-icon {
    flex-shrink: 0;
    font-size: 0.8rem;
    padding-top: 6px;
    transition: transform 0.2s;
  }

  /* EXPANDED */
  .artigo-expanded {
    padding: 0 24px 20px;
    border-top: 1px solid rgba(128,128,128,0.15);
    margin-top: 0;
    padding-top: 16px;
  }

  .expanded-section {
    margin-bottom: 16px;
  }

  .expanded-label {
    font-size: 0.92rem;
    margin: 0 0 8px;
  }

  .expanded-text {
    font-size: 0.92rem;
    line-height: 1.7;
    margin: 0;
  }

  .artigo-doi {
    font-size: 0.88rem;
    margin: 12px 0 0;
  }

  .artigo-doi a {
    text-decoration: none;
  }

  .artigo-doi a:hover { text-decoration: underline; }

  /* ACTIONS */
  .artigo-actions {
    display: flex;
    gap: 10px;
    margin-top: 16px;
  }

  .btn-action {
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
    background: none;
    border: 1px solid;
  }

  .btn-action:hover { opacity: 0.8; }

  .btn-delete, .btn-confirm-delete {
    border-color: #c44;
    color: #c44;
  }

  .btn-confirm-delete {
    background: #c44;
    color: #ffffff;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
  }

  .artigo-quick-actions {
    display: flex;
    gap: 8px;
    padding: 0 24px 12px;
  }

  .btn-action-sm {
    background: none;
    border: none;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-action-sm:hover { opacity: 0.7; }

  .btn-delete-sm { color: #c44; }

  /* CONFIRM DIALOG */
  .confirm-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .confirm-dialog {
    padding: 28px;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    max-width: 400px;
    width: 100%;
    text-align: center;
  }

  .confirm-dialog p {
    margin: 0 0 20px;
    font-size: 0.95rem;
  }

  .confirm-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .btn-cancel {
    padding: 8px 20px;
    border: 2px solid #7a8a6a;
    background: #ffffff;
    color: #7a8a6a;
    border-radius: 6px;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
  }

  .btn-cancel:hover {
    background: #7a8a6a;
    color: #ffffff;
  }

  .btn-confirm-delete:hover { opacity: 0.85; }

  @media (max-width: 768px) {
    .artigos-hero-titulo {
      font-size: 1.8rem;
    }

    .artigo-top {
      padding: 16px 18px;
    }

    .artigo-expanded {
      padding: 0 18px 16px;
      padding-top: 12px;
    }

    .artigo-quick-actions {
      padding: 0 18px 10px;
    }
  }

  @media (max-width: 480px) {
    .artigo-top {
      flex-wrap: wrap;
    }

    .artigo-indice {
      width: 32px;
      height: 32px;
      font-size: 0.82rem;
    }

    .artigo-titulo {
      font-size: 1rem;
    }
  }
</style>

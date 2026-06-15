<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { controllerListarNoticias, controllerDeletarNoticia } from '../controllers/NoticiaController';
  import { refreshTrigger } from '../stores/appStore';

  const dispatch = createEventDispatcher();

  let noticias: any[] = [];
  let carregando: boolean = true;
  let erro: string = '';
  let confirmarDelete: any = null;
  let overlayEl: HTMLDivElement | undefined = undefined;
  let busca: string = '';

  $: noticiasFiltradas = noticias.filter(n => {
    const termo = busca.toLowerCase();
    return n.titulo.toLowerCase().includes(termo) ||
      (n.autor && n.autor.toLowerCase().includes(termo)) ||
      (n.conteudo && n.conteudo.toLowerCase().includes(termo));
  });

  onMount(async () => {
    await carregarNoticias();
  });

  $: if ($refreshTrigger) {
    carregarNoticias();
  }

  async function carregarNoticias() {
    carregando = true;
    erro = '';
    try {
      const resultado = await controllerListarNoticias();
      noticias = resultado.response || resultado || [];
    } catch (err) {
      erro = err.message || 'Erro ao carregar notícias.';
    } finally {
      carregando = false;
    }
  }

  function handleClose() {
    dispatch('close');
  }

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === overlayEl) {
      handleClose();
    }
  }

  function handleEdit(noticia: any) {
    dispatch('edit', { noticia });
  }

  function handleAdd() {
    dispatch('add');
  }

  function handleUpdate() {
    dispatch('update');
    carregarNoticias();
  }

  function solicitarDelete(noticia: any) {
    confirmarDelete = noticia;
  }

  function cancelarDelete() {
    confirmarDelete = null;
  }

  async function confirmarDeleteAction() {
    if (!confirmarDelete) return;
    try {
      await controllerDeletarNoticia(confirmarDelete.id);
      noticias = noticias.filter(n => n.id !== confirmarDelete.id);
      confirmarDelete = null;
    } catch (err) {
      erro = err.message || 'Erro ao deletar notícia.';
      confirmarDelete = null;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }

  function formatarData(dataStr: string): string {
    if (!dataStr) return '';
    const d = new Date(dataStr + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
  }

  function truncarTexto(texto: string, max: number): string {
    if (!texto) return '';
    return texto.length > max ? texto.substring(0, max) + '...' : texto;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="overlay" bind:this={overlayEl} on:click={handleOverlayClick}>
  <div class="modal" on:click|stopPropagation>
    <div class="modal-header">
      <h2 class="modal-title">Gerenciar Noticias</h2>
      <div class="header-actions">
        <button class="btn-add" on:click={handleAdd} title="Adicionar notícia">+</button>
        <button class="close-btn" on:click={handleClose} aria-label="Fechar">&#10005;</button>
      </div>
    </div>

    <div class="modal-body">
      {#if !carregando && noticias.length > 0}
        <div class="search-bar">
          <input
            type="text"
            placeholder="Buscar notícias..."
            bind:value={busca}
          />
        </div>
      {/if}

      {#if carregando}
        <div class="loading">Carregando...</div>
      {:else if erro}
        <div class="error-msg">{erro}</div>
      {:else if noticiasFiltradas.length === 0}
        <div class="empty">{noticias.length === 0 ? 'Nenhuma notícia encontrada.' : 'Nenhum resultado para a busca.'}</div>
      {:else}
        <div class="card-grid">
          {#each noticiasFiltradas as noticia (noticia.id)}
            <div class="card">
              {#if noticia.imagens && noticia.imagens.length > 0}
                <div class="card-image">
                  <img src={noticia.imagens[0]} alt={noticia.titulo} />
                </div>
              {:else if noticia.imagemUrl}
                <div class="card-image">
                  <img src={noticia.imagemUrl} alt={noticia.titulo} />
                </div>
              {/if}
              <div class="card-content">
                <h3 class="card-title">{noticia.titulo}</h3>
                <p class="card-meta">
                  {#if noticia.data}{formatarData(noticia.data)}{/if}
                  {#if noticia.autor} — {noticia.autor}{/if}
                </p>
                <p class="card-preview">{truncarTexto(noticia.conteudo, 120)}</p>
              </div>
              <div class="card-actions">
                <button class="btn-edit" on:click={() => handleEdit(noticia)}>Editar</button>
                <button class="btn-delete" on:click={() => solicitarDelete(noticia)}>Excluir</button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    {#if confirmarDelete}
      <div class="confirm-overlay" on:click|stopPropagation>
        <div class="confirm-dialog">
          <p>Tem certeza que deseja excluir <strong>{confirmarDelete.titulo}</strong>?</p>
          <div class="confirm-actions">
            <button class="btn-cancel" on:click={cancelarDelete}>Cancelar</button>
            <button class="btn-confirm-delete" on:click={confirmarDeleteAction}>Excluir</button>
          </div>
        </div>
      </div>
    {/if}
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
    z-index: 1001;
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

  .header-actions {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .btn-add {
    padding: 10px 20px;
    background-color: #4a5d3c;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 24px;
    font-weight: bold;
    line-height: 1;
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

  .search-bar input {
    width: 100%;
    padding: 12px;
    margin-bottom: 20px;
    border: 2px solid #e8ddc5;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .loading, .empty {
    text-align: center;
    padding: 40px;
    color: #7a8a6a;
  }

  .error-msg {
    background: #fef2f2;
    border: 1px solid #fca5a5;
    color: #dc2626;
    padding: 10px 14px;
    border-radius: 4px;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 25px;
    margin-bottom: 20px;
  }

  .card {
    padding: 0;
    border-radius: 8px;
    border: 2px solid #e8ddc5;
    background-color: #ffffff;
    transition: transform 0.3s, box-shadow 0.3s;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .card-image {
    /* Kept for structure if needed */
  }

  .card-image img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    object-position: top;
    background-color: #f4f5f1;
    border-radius: 0;
    margin-bottom: 0;
    display: block;
  }

  .card-content {
    padding: 20px 20px 10px 20px;
    flex: 1;
  }

  .card-title {
    margin-bottom: 10px;
    color: #4a5d3c;
    font-size: 1.17em; /* approx h3 */
    margin-top: 0;
  }

  .card-meta {
    font-size: 14px;
    color: #666;
    margin-top: 0;
    margin-bottom: 10px;
  }

  .card-preview {
    font-size: 16px; /* using default p size for line-height 1.6 */
    line-height: 1.6;
    color: #666;
    margin-top: 0;
    margin-bottom: 5px;
  }

  .card-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-start;
    margin-top: auto;
    padding: 0 20px 20px 20px;
  }

  .btn-edit, .btn-delete {
    padding: 6px 12px;
    margin: 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    transition: background-color 0.3s;
  }

  .btn-edit {
    background-color: #7a8a6a;
    color: #ffffff;
    margin-right: 10px;
  }

  .btn-edit:hover {
    background-color: #5a6a4a;
  }

  .btn-delete {
    background-color: #c44;
    color: #ffffff;
  }

  .btn-delete:hover {
    background-color: #a33;
  }

  .confirm-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    z-index: 2;
  }

  .confirm-dialog {
    background: #ffffff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    max-width: 360px;
    width: 98%;
    height: 95vh;
    text-align: center;
  }

  .confirm-dialog p {
    margin: 0 0 16px;
    font-size: 16px;
    color: #333;
  }

  .confirm-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .btn-cancel {
    padding: 8px 20px;
    border: 2px solid #7a8a6a;
    background: #ffffff;
    color: #7a8a6a;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .btn-cancel:hover {
    background: #7a8a6a;
    color: #ffffff;
  }

  .btn-confirm-delete {
    padding: 8px 20px;
    border: 2px solid #c44;
    background: #c44;
    color: #ffffff;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-confirm-delete:hover {
    opacity: 0.85;
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

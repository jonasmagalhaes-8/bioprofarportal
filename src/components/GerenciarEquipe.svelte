<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { controllerListarComite, controllerDeletarMembro } from '../controllers/EquipeController';
  import { refreshTrigger } from '../stores/appStore';

  const dispatch = createEventDispatcher();

  let membros: any[] = [];
  let carregando: boolean = true;
  let erro: string = '';
  let confirmarDelete: any = null;
  let overlayEl: HTMLDivElement | undefined = undefined;

  onMount(async () => {
    await carregarMembros();
  });

  $: if ($refreshTrigger) {
    carregarMembros();
  }

  async function carregarMembros() {
    carregando = true;
    erro = '';
    try {
      const resultado = await controllerListarComite();
      membros = resultado.response || resultado || [];
    } catch (err) {
      erro = err.message || 'Erro ao carregar membros.';
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

  function handleEdit(membro: any) {
    dispatch('edit', { membro });
  }

  function handleAdd() {
    dispatch('add');
  }

  function solicitarDelete(membro: any) {
    confirmarDelete = membro;
  }

  function cancelarDelete() {
    confirmarDelete = null;
  }

  async function confirmarDeleteAction() {
    if (!confirmarDelete) return;
    try {
      await controllerDeletarMembro(confirmarDelete.id);
      membros = membros.filter(m => m.id !== confirmarDelete.id);
      confirmarDelete = null;
    } catch (err) {
      erro = err.message || 'Erro ao deletar membro.';
      confirmarDelete = null;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="overlay" bind:this={overlayEl} on:click={handleOverlayClick}>
  <div class="modal" on:click|stopPropagation>
    <div class="modal-header">
      <h2 class="modal-title">Gerenciar Comite Gestor</h2>
      <div class="header-actions">
        <button class="btn-add" on:click={handleAdd} title="Adicionar membro">+</button>
        <button class="close-btn" on:click={handleClose} aria-label="Fechar">&#10005;</button>
      </div>
    </div>

    <div class="modal-body">
      {#if carregando}
        <div class="loading">Carregando...</div>
      {:else if erro}
        <div class="error-msg">{erro}</div>
      {:else if membros.length === 0}
        <div class="empty">Nenhum membro encontrado.</div>
      {:else}
        <div class="card-grid">
          {#each membros as membro (membro.id)}
            <div class="card">
              <div class="card-photo">
                {#if membro.fotoUrl}
                  <img src={membro.fotoUrl} alt={membro.nome} />
                {:else}
                  <div class="photo-placeholder">{(membro.nome || '?')[0]}</div>
                {/if}
              </div>
              <div class="card-info">
                <h3 class="card-name">{membro.nome}</h3>
                <p class="card-cargo">{membro.cargo}</p>
                <p class="card-instituicao">{membro.instituicao}</p>
              </div>
              <div class="card-actions">
                <button class="btn-edit" on:click={() => handleEdit(membro)}>Editar</button>
                <button class="btn-delete" on:click={() => solicitarDelete(membro)}>Excluir</button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    {#if confirmarDelete}
      <div class="confirm-overlay" on:click|stopPropagation>
        <div class="confirm-dialog">
          <p>Tem certeza que deseja excluir <strong>{confirmarDelete.nome}</strong>?</p>
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
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
    margin-bottom: 20px;
  }

  .card {
    padding: 20px;
    border-radius: 8px;
    border: 2px solid #e8ddc5;
    background-color: #ffffff;
    transition: transform 0.3s, box-shadow 0.3s;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .card-photo {
    /* For standardisation, although TSX applies these to img */
  }

  .card-photo img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 15px;
    display: block;
    border: 4px solid #7a8a6a;
  }

  .photo-placeholder {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e8ddc5;
    color: #4a5d3c;
    font-size: 40px; /* adjusted for 120px circle */
    font-weight: 700;
    border: 4px solid #7a8a6a;
  }

  .card-info {
    flex: 1;
    width: 100%;
    text-align: left;
  }

  .card-name {
    margin-bottom: 10px;
    color: #4a5d3c;
    font-size: 1.17em; /* approx h3 */
    margin-top: 0;
  }

  .card-cargo, .card-instituicao {
    font-size: 14px;
    color: #666;
    margin-top: 0;
  }

  .card-cargo {
    margin-bottom: 10px;
  }

  .card-instituicao {
    margin-bottom: 5px;
  }

  .card-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-start;
    width: 100%;
    margin-top: 10px;
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

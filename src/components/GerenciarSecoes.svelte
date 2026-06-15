<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import {
    controllerListarSecoes,
    controllerDeletarSecao,
    controllerAtualizarOrdemSecoes,
  } from "../controllers/SecaoCustomController";
  import { refreshTrigger } from "../stores/appStore";

  const dispatch = createEventDispatcher();

  let secoes: any[] = [];
  let carregando: boolean = true;
  let erro: string = "";
  let confirmarDelete: any = null;
  let overlayEl: HTMLDivElement | undefined = undefined;
  let salvandoOrdem: boolean = false;
  let ordemAlterada: boolean = false;
  let dragIndex: number | null = null;

  onMount(async () => {
    await carregarSecoes();
  });

  $: if ($refreshTrigger) {
    carregarSecoes();
  }

  async function carregarSecoes() {
    carregando = true;
    erro = "";
    try {
      const resultado = await controllerListarSecoes();
      const data = resultado.response || resultado || [];
      secoes = data.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
      ordemAlterada = false;
    } catch (err) {
      erro = err.message || "Erro ao carregar seções.";
    } finally {
      carregando = false;
    }
  }

  function handleClose() {
    dispatch("close");
  }

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === overlayEl) {
      handleClose();
    }
  }

  function handleEdit(secao: any) {
    dispatch("edit", { secao });
  }

  function handleAdd() {
    dispatch("add");
  }

  function handleUpdate() {
    dispatch("update");
    carregarSecoes();
  }

  function solicitarDelete(secao: any) {
    confirmarDelete = secao;
  }

  function cancelarDelete() {
    confirmarDelete = null;
  }

  async function confirmarDeleteAction() {
    if (!confirmarDelete) return;
    try {
      await controllerDeletarSecao(confirmarDelete.id);
      secoes = secoes.filter((s) => s.id !== confirmarDelete.id);
      confirmarDelete = null;
      ordemAlterada = true;
    } catch (err) {
      erro = err.message || "Erro ao deletar seção.";
      confirmarDelete = null;
    }
  }

  async function salvarOrdem() {
    salvandoOrdem = true;
    erro = "";
    try {
      const secoesAtualizadas = secoes.map((s, i) => {
        return Object.assign({}, s, { ordem: i });
      });
      await controllerAtualizarOrdemSecoes(secoesAtualizadas);
      secoes = secoesAtualizadas;
      ordemAlterada = false;
    } catch (err) {
      erro = err.message || "Erro ao salvar ordem.";
    } finally {
      salvandoOrdem = false;
    }
  }

  // Drag and drop handlers
  function handleDragStart(e: DragEvent, index: number) {
    dragIndex = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    e.currentTarget.classList.add("dragging");
  }

  function handleDragEnd(e: DragEvent) {
    dragIndex = null;
    e.currentTarget.classList.remove("dragging");
  }

  function handleDragOver(e: DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDragEnter(e: DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const item = secoes.splice(dragIndex, 1)[0];
    secoes.splice(index, 0, item);
    dragIndex = index;
    ordemAlterada = true;
  }

  function handleDrop(e: DragEvent, index: number) {
    e.preventDefault();
    dragIndex = null;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="overlay" bind:this={overlayEl} on:click={handleOverlayClick}>
  <div class="modal" on:click|stopPropagation>
    <div class="modal-header">
      <h2 class="modal-title">Gerenciar Secoes</h2>
      <div class="header-actions">
        {#if ordemAlterada}
          <button
            class="btn-save"
            on:click={salvarOrdem}
            disabled={salvandoOrdem}
          >
            {salvandoOrdem ? "Salvando..." : "Salvar Ordem"}
          </button>
        {/if}
        <button class="btn-add" on:click={handleAdd} title="Adicionar seção"
          >+</button
        >
        <button class="close-btn" on:click={handleClose} aria-label="Fechar"
          >&#10005;</button
        >
      </div>
    </div>

    <div class="modal-body">
      {#if carregando}
        <div class="loading">Carregando...</div>
      {:else if erro}
        <div class="error-msg">{erro}</div>
      {:else if secoes.length === 0}
        <div class="empty">Nenhuma seção encontrada.</div>
      {:else}
        <p class="drag-hint">Arraste os itens para reordenar as seções.</p>
        <div class="secao-list">
          {#each secoes as secao, index (secao.id)}
            <div
              class="secao-item"
              class:dragging={dragIndex === index}
              draggable="true"
              on:dragstart={(e) => handleDragStart(e, index)}
              on:dragend={handleDragEnd}
              on:dragover={(e) => handleDragOver(e, index)}
              on:dragenter={(e) => handleDragEnter(e, index)}
              on:drop={(e) => handleDrop(e, index)}
            >
              <div class="drag-handle" title="Arrastar para reordenar">
                &#8942;&#8942;
              </div>
              <div class="secao-info">
                <h3 class="secao-titulo">{secao.titulo}</h3>
                <span class="secao-tipo">{secao.tipo}</span>
              </div>
              <div class="secao-ordem">{secao.ordem}</div>
              <div class="secao-actions">
                <button class="btn-edit" on:click={() => handleEdit(secao)}
                  >Editar</button
                >
                <button
                  class="btn-delete"
                  on:click={() => solicitarDelete(secao)}>Excluir</button
                >
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    {#if confirmarDelete}
      <div class="confirm-overlay" on:click|stopPropagation>
        <div class="confirm-dialog">
          <p>
            Tem certeza que deseja excluir <strong
              >{confirmarDelete.titulo}</strong
            >?
          </p>
          <div class="confirm-actions">
            <button class="btn-cancel" on:click={cancelarDelete}
              >Cancelar</button
            >
            <button class="btn-confirm-delete" on:click={confirmarDeleteAction}
              >Excluir</button
            >
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
    padding: 40px;
    border-radius: 8px;
    max-width: 1000px;
    width: 100%;
    max-height: 98vh;
    overflow-y: auto;
  }

  .modal-header {
    /* Mapping the React title flex container here since Svelte has a header container */
    margin: 0 0 25px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
  }

  .modal-title {
    color: #4a5d3c;
    font-size: 28px;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .btn-save {
    padding: 12px 30px;
    background-color: #4a5d3c;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
  }

  .btn-add {
    padding: 10px 20px;
    background-color: #4a5d3c;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
  }

  .close-btn {
    padding: 12px 30px;
    border: 2px solid #4a5d3c;
    border-radius: 4px;
    cursor: pointer;
    background-color: #ffffff;
    color: #4a5d3c;
    font-size: 14px;
    font-weight: bold;
  }

  .modal-body {
    /* Kept for structure if needed */
  }

  .loading,
  .empty {
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

  .drag-hint {
    margin-bottom: 20px;
    color: #666;
    font-size: 14px;
  }

  .secao-list {
    /* Svelte container */
  }

  .secao-item {
    padding: 20px;
    margin-bottom: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
    border: 2px solid #e8ddc5;
    cursor: grab;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
  }

  .secao-item.dragging {
    background-color: #e8ddc5;
    border: 2px dashed #4a5d3c;
    cursor: grabbing;
    opacity: 0.5;
  }

  .drag-handle {
    font-size: 20px;
    margin-right: 15px;
    color: #7a8a6a;
    cursor: grab;
  }

  .secao-info {
    flex: 1;
    min-width: 200px;
  }

  .secao-titulo {
    font-size: 16px;
    color: #4a5d3c;
    font-weight: bold;
    margin: 0;
  }

  .secao-tipo {
    font-size: 13px;
    color: #666;
    margin-top: 5px;
    display: block;
  }

  .secao-ordem {
    /* Hidden to match React */
    display: none;
  }

  .secao-actions {
    /* Empty, buttons have margins */
  }

  .btn-edit,
  .btn-delete {
    padding: 8px 16px;
    margin: 0 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
  }

  .btn-edit {
    background-color: #7a8a6a;
    color: #ffffff;
  }

  .btn-delete {
    background-color: #c44;
    color: #ffffff;
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
  }
</style>

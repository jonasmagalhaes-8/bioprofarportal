<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { createSecaoCustomModel } from '../models/SecaoCustomModel';
  import { controllerCriarSecao, controllerAtualizarSecao } from '../controllers/SecaoCustomController';

  export let secao: any = null;

  const dispatch = createEventDispatcher();

  let titulo: string = '';
  let tipo: string = 'texto';
  let conteudo: string = '';
  let loading: boolean = false;
  let erro: string = '';
  let overlayEl: HTMLDivElement | undefined = undefined;

  $: isEditing = secao !== null && secao !== undefined;

  onMount(() => {
    if (secao) {
      titulo = secao.titulo || '';
      tipo = secao.tipo || 'texto';
      conteudo = secao.conteudo || '';
    }
  });

  function handleClose() {
    dispatch('close');
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

  function validateForm() {
    if (!titulo.trim()) {
      erro = 'O título é obrigatório.';
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    loading = true;
    erro = '';

    try {
      const model = createSecaoCustomModel({
        titulo: titulo.trim(),
        tipo: tipo as 'texto' | 'lista',
        conteudo: conteudo.trim(),
        ordem: secao ? secao.ordem : 0,
      });

      let resultado;
      if (isEditing) {
        model.id = secao.id;
        resultado = await controllerAtualizarSecao(model);
      } else {
        resultado = await controllerCriarSecao(model);
      }

      if (resultado && resultado.sucesso !== false) {
        dispatch('success');
        handleClose();
      } else {
        erro = (resultado && resultado.mensagem) || 'Erro ao salvar seção.';
      }
    } catch (err) {
      erro = err.message || 'Erro ao salvar seção. Tente novamente.';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    document.addEventListener('keydown', onDocumentKeydown);
    return () => {
      document.removeEventListener('keydown', onDocumentKeydown);
    };
  });
</script>

<div class="overlay" bind:this={overlayEl} on:click={handleOverlayClick}>
  <div class="modal" on:click|stopPropagation>
    <button class="close-btn" on:click={handleClose} aria-label="Fechar">&times;</button>

    <h2 class="modal-title">{isEditing ? 'Editar Seção' : 'Nova Seção'}</h2>

    {#if erro}
      <div class="error-msg">{erro}</div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
      <div class="field">
        <label for="secao-titulo">Título *</label>
        <input id="secao-titulo" type="text" bind:value={titulo} placeholder="Título da seção" disabled={loading} />
      </div>

      <div class="field">
        <label for="secao-tipo">Tipo</label>
        <select id="secao-tipo" bind:value={tipo} disabled={loading}>
          <option value="texto">Texto</option>
          <option value="lista">Lista</option>
        </select>
      </div>

      {#if tipo === 'lista'}
        <div class="info-tip">
          <span class="info-icon">ℹ</span>
          <span>No tipo <strong>lista</strong>, cada linha do conteúdo será exibida como um item separado. Use uma linha por item.</span>
        </div>
      {/if}

      <div class="field">
        <label for="secao-conteudo">Conteúdo</label>
        <textarea id="secao-conteudo" bind:value={conteudo} placeholder={tipo === 'lista' ? 'Um item por linha...' : 'Conteúdo da seção...'} disabled={loading} rows="6"></textarea>
      </div>

      <div class="btn-group">
        <button type="button" class="btn-cancel" on:click={handleClose} disabled={loading}>Cancelar</button>
        <button type="submit" class="btn-submit" disabled={loading}>
          {#if loading}
            <span class="spinner"></span> Salvando...
          {:else}
            {isEditing ? 'Atualizar' : 'Criar'}
          {/if}
        </button>
      </div>
    </form>
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
    z-index: 1002;
    overflow-y: auto;
    padding: 20px;
  }

  .modal {
    background-color: #ffffff;
    padding: 40px;
    border-radius: 8px;
    max-width: 1200px;
    width: 100%;
    max-height: 98vh;
    overflow-y: auto;
    position: relative;
  }

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #4a5d3c;
    font-weight: bold;
  }

  .modal-title {
    margin: 0 0 25px 0;
    color: #4a5d3c;
    font-size: 28px;
    font-weight: bold;
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

  .field {
    margin-bottom: 0;
  }

  .field label {
    display: block;
    margin-bottom: 8px;
    color: #4a5d3c;
    font-weight: bold;
    font-size: 14px;
  }

  .field input,
  .field textarea,
  .field select {
    width: 100%;
    padding: 12px;
    margin-bottom: 20px;
    border: 2px solid #e8ddc5;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    font-family: inherit;
    background-color: #ffffff;
  }

  .field input:focus,
  .field textarea:focus,
  .field select:focus {
    outline: none;
    border-color: #4a5d3c;
  }

  .field input:disabled,
  .field textarea:disabled,
  .field select:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }

  .field textarea {
    min-height: 200px;
    resize: vertical;
  }

  .info-tip {
    background-color: #e8ddc5;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 15px;
    font-size: 13px;
    color: #4a5d3c;
  }

  .info-icon {
    /* Kept for Svelte DOM compatibility if needed, but the original TSX didn't use an icon here. */
    display: none;
  }

  .btn-group {
    display: flex;
    gap: 10px;
    margin-top: 30px;
  }

  .btn-cancel {
    flex: 1;
    padding: 14px;
    border: 2px solid #4a5d3c;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    background-color: #ffffff;
    color: #4a5d3c;
    font-weight: bold;
  }

  .btn-cancel:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-submit {
    flex: 1;
    padding: 14px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    background-color: #4a5d3c;
    color: #ffffff;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { createArtigoModel } from '../models/ArtigoModel';
  import { controllerCriarArtigo, controllerAtualizarArtigo } from '../controllers/ArtigoController';

  export let artigo: any = null;

  const dispatch = createEventDispatcher();

  let titulo: string = '';
  let autores: string = '';
  let resumo: string = '';
  let conteudo: string = '';
  let dataPublicacao: string = '';
  let revista: string = '';
  let doi: string = '';
  let loading: boolean = false;
  let erro: string = '';
  let overlayEl: HTMLDivElement | undefined = undefined;

  $: isEditing = artigo !== null && artigo !== undefined;

  onMount(() => {
    if (artigo) {
      titulo = artigo.titulo || '';
      autores = artigo.autores || '';
      resumo = artigo.resumo || '';
      conteudo = artigo.conteudo || '';
      dataPublicacao = artigo.dataPublicacao || '';
      revista = artigo.revista || '';
      doi = artigo.doi || '';
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
    if (!autores.trim()) {
      erro = 'Os autores são obrigatórios.';
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    loading = true;
    erro = '';

    try {
      const model = createArtigoModel({
        titulo: titulo.trim(),
        autores: autores.trim(),
        resumo: resumo.trim(),
        conteudo: conteudo.trim(),
        dataPublicacao: dataPublicacao,
        revista: revista.trim(),
        doi: doi.trim(),
      });

      let resultado;
      if (isEditing) {
        model.id = artigo.id;
        resultado = await controllerAtualizarArtigo(model);
      } else {
        resultado = await controllerCriarArtigo(model);
      }

      if (resultado && resultado.sucesso !== false) {
        dispatch('success');
        handleClose();
      } else {
        erro = (resultado && resultado.mensagem) || 'Erro ao salvar artigo.';
      }
    } catch (err) {
      erro = err.message || 'Erro ao salvar artigo. Tente novamente.';
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

    <h2 class="modal-title">{isEditing ? 'Editar Artigo' : 'Novo Artigo'}</h2>

    {#if erro}
      <div class="error-msg">{erro}</div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
      <div class="field">
        <label for="artigo-titulo">Título *</label>
        <input id="artigo-titulo" type="text" bind:value={titulo} placeholder="Título do artigo" disabled={loading} />
      </div>

      <div class="field">
        <label for="artigo-autores">Autores *</label>
        <input id="artigo-autores" type="text" bind:value={autores} placeholder="Ex: Silva JM, Santos AR" disabled={loading} />
      </div>

      <div class="field">
        <label for="artigo-resumo">Resumo</label>
        <textarea id="artigo-resumo" bind:value={resumo} placeholder="Resumo do artigo" disabled={loading} rows="3"></textarea>
      </div>

      <div class="field">
        <label for="artigo-conteudo">Conteúdo</label>
        <textarea id="artigo-conteudo" bind:value={conteudo} placeholder="Conteúdo completo do artigo" disabled={loading} rows="5"></textarea>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="artigo-data">Data de Publicação</label>
          <input id="artigo-data" type="date" bind:value={dataPublicacao} disabled={loading} />
        </div>
        <div class="field">
          <label for="artigo-revista">Revista</label>
          <input id="artigo-revista" type="text" bind:value={revista} placeholder="Nome da revista" disabled={loading} />
        </div>
      </div>

      <div class="field">
        <label for="artigo-doi">DOI</label>
        <input id="artigo-doi" type="text" bind:value={doi} placeholder="Ex: 10.1016/j.jnpr.2025.01.015" disabled={loading} />
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
    min-height: 100px;
    resize: vertical;
  }

  .field-row {
    display: flex;
    gap: 16px;
  }

  .field-row .field {
    flex: 1;
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

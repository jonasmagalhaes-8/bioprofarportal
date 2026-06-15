<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { createPortfolioModel } from '../models/PortfolioModel';
  import { controllerAdicionarPortfolio, controllerAtualizarPortfolio } from '../controllers/PortfolioController';
  import { controllerUploadImagem } from '../controllers/UploadController';

  export let item: any = null;

  const dispatch = createEventDispatcher();

  let titulo: string = '';
  let tipo: string = '';
  let ano: string = '';
  let descricao: string = '';
  let imagemUrl: string = '';
  let imagemFile: File | null = null;
  let imagemPreview: string = '';
  let loading: boolean = false;
  let erro: string = '';
  let overlayEl: HTMLDivElement | undefined = undefined;

  $: isEditing = item !== null && item !== undefined;

  onMount(() => {
    if (item) {
      titulo = item.titulo || '';
      tipo = item.tipo || '';
      ano = item.ano || '';
      descricao = item.descricao || '';
      imagemUrl = item.imagemUrl || '';
      imagemPreview = item.imagemUrl || '';
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

  function handleFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      imagemFile = file;
      const reader = new FileReader();
      reader.onload = function (ev: ProgressEvent<FileReader>) {
        imagemPreview = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImagem() {
    imagemFile = null;
    imagemPreview = '';
    imagemUrl = '';
  }

  function validateForm() {
    if (!titulo.trim()) {
      erro = 'O título é obrigatório.';
      return false;
    }
    if (!tipo.trim()) {
      erro = 'O tipo é obrigatório.';
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    loading = true;
    erro = '';

    try {
      let uploadedUrl = imagemUrl;

      if (imagemFile) {
        try {
          const uploadResult = await controllerUploadImagem(imagemFile);
          uploadedUrl = uploadResult;
        } catch (uploadErr) {
          erro = 'Erro ao enviar imagem. Tente novamente.';
          loading = false;
          return;
        }
      }

      const model = createPortfolioModel({
        titulo: titulo.trim(),
        tipo: tipo.trim(),
        ano: ano.trim(),
        descricao: descricao.trim(),
        imagemUrl: uploadedUrl || '',
      });

      let resultado;
      if (isEditing) {
        model.id = item.id;
        resultado = await controllerAtualizarPortfolio(model);
      } else {
        resultado = await controllerAdicionarPortfolio(model);
      }

      if (resultado && resultado.sucesso !== false) {
        dispatch('success');
        handleClose();
      } else {
        erro = (resultado && resultado.mensagem) || 'Erro ao salvar item do portfólio.';
      }
    } catch (err) {
      erro = err.message || 'Erro ao salvar item do portfólio. Tente novamente.';
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

    <h2 class="modal-title">{isEditing ? 'Editar Item do Portfólio' : 'Novo Item do Portfólio'}</h2>

    {#if erro}
      <div class="error-msg">{erro}</div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
      <div class="field">
        <label for="portfolio-titulo">Título *</label>
        <input id="portfolio-titulo" type="text" bind:value={titulo} placeholder="Título do projeto" disabled={loading} />
      </div>

      <div class="field-row">
        <div class="field">
          <label for="portfolio-tipo">Tipo *</label>
          <input id="portfolio-tipo" type="text" bind:value={tipo} placeholder="Ex: Software, Pesquisa" disabled={loading} />
        </div>
        <div class="field">
          <label for="portfolio-ano">Ano</label>
          <input id="portfolio-ano" type="text" bind:value={ano} placeholder="2025" disabled={loading} />
        </div>
      </div>

      <div class="field">
        <label for="portfolio-descricao">Descrição</label>
        <textarea id="portfolio-descricao" bind:value={descricao} placeholder="Descrição do projeto" disabled={loading} rows="3"></textarea>
      </div>

      <div class="field">
        <label>Imagem</label>
        {#if imagemPreview}
          <div class="image-preview-container">
            <img src={imagemPreview} alt="Preview" class="image-preview" />
            <button type="button" class="btn-remove-image" on:click={removeImagem} disabled={loading}>&times;</button>
          </div>
        {/if}
        <input type="file" accept="image/*" on:change={handleFileChange} disabled={loading} class="file-input" />
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
    margin-bottom: 20px;
  }

  .field label {
    display: block;
    margin-bottom: 8px;
    color: #4a5d3c;
    font-size: 14px;
    font-weight: bold;
  }

  .field input,
  .field textarea,
  .field select {
    width: 100%;
    padding: 10px;
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

  .image-preview-container {
    position: relative;
    margin-bottom: 10px;
    width: fit-content;
  }

  .image-preview {
    max-width: 100px;
    display: block;
  }

  .btn-remove-image {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #dc2626;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .file-input {
    width: 100%;
    padding: 10px;
    border: 2px solid #e8ddc5;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .btn-group {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 30px;
  }

  .btn-cancel {
    padding: 12px 24px;
    background-color: #ffffff;
    color: #4a5d3c;
    border: 2px solid #4a5d3c;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }

  .btn-cancel:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .btn-submit {
    padding: 12px 24px;
    background-color: #4a5d3c;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
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
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { createNoticiaModel } from '../models/NoticiaModel';
  import { controllerCriarNoticia, controllerAtualizarNoticia } from '../controllers/NoticiaController';
  import { controllerUploadImagem } from '../controllers/UploadController';

  export let noticia: any = null;

  const dispatch = createEventDispatcher();

  let titulo: string = '';
  let conteudo: string = '';
  let data: string = '';
  let autor: string = '';
  let imagemUrl: string = '';
  let imagensExistentes: string[] = [];
  let novasImagensFiles: File[] = [];
  let novasImagensPreviews: string[] = [];
  let loading: boolean = false;
  let erro: string = '';
  let overlayEl: HTMLDivElement | undefined = undefined;

  $: isEditing = noticia !== null && noticia !== undefined;

  onMount(() => {
    if (noticia) {
      titulo = noticia.titulo || '';
      conteudo = noticia.conteudo || '';
      data = noticia.data || '';
      autor = noticia.autor || '';
      imagemUrl = noticia.imagemUrl || '';
      
      if (noticia.imagens && noticia.imagens.length > 0) {
        imagensExistentes = [...noticia.imagens];
      } else if (noticia.imagemUrl) {
        imagensExistentes = [noticia.imagemUrl];
      }
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
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      Array.from(files).forEach(file => {
        novasImagensFiles = [...novasImagensFiles, file];
        const reader = new FileReader();
        reader.onload = function (ev: ProgressEvent<FileReader>) {
          novasImagensPreviews = [...novasImagensPreviews, ev.target?.result as string];
        };
        reader.readAsDataURL(file);
      });
    }
  }

  function removeImagemExistente(index: number) {
    imagensExistentes = imagensExistentes.filter((_, i) => i !== index);
  }

  function removeNovaImagem(index: number) {
    novasImagensFiles = novasImagensFiles.filter((_, i) => i !== index);
    novasImagensPreviews = novasImagensPreviews.filter((_, i) => i !== index);
  }

  function validateForm() {
    if (!titulo.trim()) {
      erro = 'O título é obrigatório.';
      return false;
    }
    if (!conteudo.trim()) {
      erro = 'O conteúdo é obrigatório.';
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    loading = true;
    erro = '';

    try {
      let uploadedUrls: string[] = [];

      if (novasImagensFiles.length > 0) {
        for (const file of novasImagensFiles) {
          try {
            const url = await controllerUploadImagem(file);
            uploadedUrls.push(url);
          } catch (uploadErr) {
            erro = 'Erro ao enviar algumas imagens. Tente novamente.';
            loading = false;
            return;
          }
        }
      }

      const todasImagens = [...imagensExistentes, ...uploadedUrls];

      const model = createNoticiaModel({
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        data: data,
        autor: autor.trim(),
        imagemUrl: todasImagens.length > 0 ? todasImagens[0] : '',
        imagens: todasImagens,
      });

      let resultado;
      if (isEditing) {
        model.id = noticia.id;
        resultado = await controllerAtualizarNoticia(model);
      } else {
        resultado = await controllerCriarNoticia(model);
      }

      if (resultado && resultado.sucesso !== false) {
        dispatch('success');
        handleClose();
      } else {
        erro = (resultado && resultado.mensagem) || 'Erro ao salvar notícia.';
      }
    } catch (err) {
      erro = err.message || 'Erro ao salvar notícia. Tente novamente.';
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

    <h2 class="modal-title">{isEditing ? 'Editar Notícia' : 'Nova Notícia'}</h2>

    {#if erro}
      <div class="error-msg">{erro}</div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
      <div class="field">
        <label for="noticia-titulo">Título *</label>
        <input id="noticia-titulo" type="text" bind:value={titulo} placeholder="Título da notícia" disabled={loading} />
      </div>

      <div class="field">
        <label for="noticia-conteudo">Conteúdo *</label>
        <textarea id="noticia-conteudo" bind:value={conteudo} placeholder="Conteúdo da notícia" disabled={loading} rows="5"></textarea>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="noticia-data">Data</label>
          <input id="noticia-data" type="date" bind:value={data} disabled={loading} />
        </div>
        <div class="field">
          <label for="noticia-autor">Autor</label>
          <input id="noticia-autor" type="text" bind:value={autor} placeholder="Nome do autor" disabled={loading} />
        </div>
      </div>

      <div class="field">
        <label>Imagens</label>
        
        {#if imagensExistentes.length > 0 || novasImagensPreviews.length > 0}
          <div class="images-grid">
            {#each imagensExistentes as imgUrl, i}
              <div class="image-preview-container">
                <img src={imgUrl} alt="Preview Existente" class="image-preview" />
                <button type="button" class="btn-remove-image" on:click={() => removeImagemExistente(i)} disabled={loading}>&times;</button>
              </div>
            {/each}
            {#each novasImagensPreviews as preview, i}
              <div class="image-preview-container">
                <img src={preview} alt="Nova Preview" class="image-preview" />
                <button type="button" class="btn-remove-image" on:click={() => removeNovaImagem(i)} disabled={loading}>&times;</button>
              </div>
            {/each}
          </div>
        {/if}
        
        <input type="file" accept="image/*" multiple on:change={handleFileChange} disabled={loading} class="file-input" />
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
    min-height: 150px;
    resize: vertical;
  }

  .field-row {
    display: flex;
    gap: 16px;
  }

  .field-row .field {
    flex: 1;
  }

  .images-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
  }

  .image-preview-container {
    position: relative;
    width: fit-content;
  }

  .image-preview {
    max-width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;
    display: block;
    border: 2px solid #e8ddc5;
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
    /* Base input style applies here */
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

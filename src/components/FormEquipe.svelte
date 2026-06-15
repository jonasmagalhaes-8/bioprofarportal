<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { createMembroEquipeModel } from "../models/MembroEquipeModel";
  import {
    controllerCriarMembro,
    controllerAtualizarMembro,
  } from "../controllers/MembroEquipeController";
  import { controllerUploadImagem } from "../controllers/UploadController";

  export let membro: any = null;

  const dispatch = createEventDispatcher();

  let nome: string = "";
  let cargo: string = "";
  let instituicao: string = "";
  let email: string = "";
  let lattes: string = "";
  let fotoUrl: string = "";
  let fotoFile: File | null = null;
  let fotoPreview: string = "";
  let comite: boolean = false;
  let pesquisador: boolean = false;
  let ordemComite: number | undefined = undefined;
  let descricao: string = "";
  let loading: boolean = false;
  let erro: string = "";
  let overlayEl: HTMLDivElement | undefined = undefined;

  $: isEditing = membro !== null && membro !== undefined;

  onMount(() => {
    if (membro) {
      nome = membro.nome || "";
      cargo = membro.cargo || "";
      instituicao = membro.instituicao || "";
      email = membro.email || "";
      lattes = membro.lattes || "";
      fotoUrl = membro.fotoUrl || "";
      fotoPreview = membro.fotoUrl || "";
      comite = membro.comite || false;
      pesquisador = membro.pesquisador || false;
      ordemComite = membro.ordemComite || undefined;
      descricao = membro.descricao || "";
    }
  });

  function handleClose() {
    dispatch("close");
  }

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === overlayEl) {
      handleClose();
    }
  }

  function onDocumentKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      handleClose();
    }
  }

  function handleFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      fotoFile = file;
      const reader = new FileReader();
      reader.onload = function (ev: ProgressEvent<FileReader>) {
        fotoPreview = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  function removeFoto() {
    fotoFile = null;
    fotoPreview = "";
    fotoUrl = "";
  }

  function validateForm() {
    if (!nome.trim()) {
      erro = "O nome é obrigatório.";
      return false;
    }
    if (!cargo.trim()) {
      erro = "O cargo é obrigatório.";
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    loading = true;
    erro = "";

    try {
      let uploadedUrl = fotoUrl;

      if (fotoFile) {
        try {
          const uploadResult = await controllerUploadImagem(fotoFile);
          uploadedUrl = uploadResult;
        } catch (uploadErr) {
          erro = "Erro ao enviar foto. Tente novamente.";
          loading = false;
          return;
        }
      }

      const model = createMembroEquipeModel({
        nome: nome.trim(),
        cargo: cargo.trim(),
        instituicao: instituicao.trim(),
        email: email.trim(),
        lattes: lattes.trim(),
        fotoUrl: uploadedUrl || "",
        comite: comite,
        pesquisador: pesquisador,
        ordemComite: comite ? ordemComite || 0 : undefined,
        descricao: descricao.trim(),
      });

      let resultado;
      if (isEditing) {
        model.id = membro.id;
        resultado = await controllerAtualizarMembro(membro.id, model);
      } else {
        resultado = await controllerCriarMembro(model);
      }

      if (resultado) {
        dispatch("success");
        handleClose();
      } else {
        erro = "Erro ao salvar membro.";
      }
    } catch (err) {
      erro = err.message || "Erro ao salvar membro. Tente novamente.";
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    document.addEventListener("keydown", onDocumentKeydown);
    return () => {
      document.removeEventListener("keydown", onDocumentKeydown);
    };
  });
</script>

<div class="overlay" bind:this={overlayEl} on:click={handleOverlayClick}>
  <div class="modal" on:click|stopPropagation>
    <button class="close-btn" on:click={handleClose} aria-label="Fechar"
      >&times;</button
    >

    <h2 class="modal-title">{isEditing ? "Editar Membro" : "Novo Membro"}</h2>

    {#if erro}
      <div class="error-msg">{erro}</div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
      <div class="field">
        <label for="equipe-nome">Nome *</label>
        <input
          id="equipe-nome"
          type="text"
          bind:value={nome}
          placeholder="Nome completo"
          disabled={loading}
        />
      </div>

      <div class="field-row">
        <div class="field">
          <label for="equipe-cargo">Cargo *</label>
          <input
            id="equipe-cargo"
            type="text"
            bind:value={cargo}
            placeholder="Ex: Líder de Pesquisa"
            disabled={loading}
          />
        </div>
        <div class="field">
          <label for="equipe-instituicao">Instituição</label>
          <input
            id="equipe-instituicao"
            type="text"
            bind:value={instituicao}
            placeholder="Ex: UFBA"
            disabled={loading}
          />
        </div>
      </div>

      <div class="field-row">
        <div class="field">
          <label for="equipe-email">Email</label>
          <input
            id="equipe-email"
            type="email"
            bind:value={email}
            placeholder="email@instituicao.br"
            disabled={loading}
          />
        </div>
        <div class="field">
          <label for="equipe-lattes">Lattes</label>
          <input
            id="equipe-lattes"
            type="url"
            bind:value={lattes}
            placeholder="http://lattes.cnpq.br/..."
            disabled={loading}
          />
        </div>
      </div>

      <div class="field">
        <label>Foto</label>
        {#if fotoPreview}
          <div class="image-preview-container">
            <img src={fotoPreview} alt="Preview" class="image-preview" />
            <button
              type="button"
              class="btn-remove-image"
              on:click={removeFoto}
              disabled={loading}>&times;</button
            >
          </div>
        {/if}
        <input
          type="file"
          accept="image/*"
          on:change={handleFileChange}
          disabled={loading}
          class="file-input"
        />
      </div>

      <div class="checkbox-group">
        <label class="checkbox-label">
          <input type="checkbox" bind:checked={comite} disabled={loading} />
          <span>Membro do Comitê Gestor</span>
        </label>
        <label class="checkbox-label">
          <input
            type="checkbox"
            bind:checked={pesquisador}
            disabled={loading}
          />
          <span>Pesquisador</span>
        </label>
      </div>

      {#if comite}
        <div class="field">
          <label for="equipe-ordem">Ordem (Opcional) no Comitê</label>
          <input
            id="equipe-ordem"
            type="number"
            bind:value={ordemComite}
            placeholder="1"
            disabled={loading}
            min="0"
          />
        </div>
      {/if}

      <div class="field">
        <label for="equipe-descricao">Descrição</label>
        <textarea
          id="equipe-descricao"
          bind:value={descricao}
          placeholder="Descrição do membro e suas pesquisas"
          disabled={loading}
          rows="3"
        ></textarea>
      </div>

      <div class="btn-group">
        <button
          type="button"
          class="btn-cancel"
          on:click={handleClose}
          disabled={loading}>Cancelar</button
        >
        <button type="submit" class="btn-submit" disabled={loading}>
          {#if loading}
            <span class="spinner"></span> Salvando...
          {:else}
            {isEditing ? "Atualizar" : "Criar"}
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
    margin-bottom: 0; /* Margin handled by input now */
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

  .image-preview-container {
    position: relative;
    margin-bottom: 20px;
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
    padding: 12px;
    border: 2px solid #e8ddc5;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
    margin-bottom: 20px;
  }

  .checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #4a5d3c;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
  }

  .checkbox-label input[type="checkbox"] {
    width: auto;
    margin-bottom: 0;
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
    to {
      transform: rotate(360deg);
    }
  }
</style>

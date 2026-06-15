<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { createConfiguracaoSiteModel } from "../models/ConfiguracaoSiteModel";
  import { createFinanciadorModel } from "../models/FinanciadorModel";
  import { createApoioModel } from "../models/ApoioModel";
  import { controllerAtualizarConfiguracao } from "../controllers/ConfiguracaoController";
  import { controllerUploadImagem } from "../controllers/UploadController";

  export let config = createConfiguracaoSiteModel();
  export let tipo: string = "hero";

  const dispatch = createEventDispatcher();

  // Hero
  let heroTitulo = "";
  let heroSubtitulo = "";

  // Sobre
  let sobreTitulo = "";
  let sobreConteudo = "";
  let sobreMissao = "";
  let sobreVisao = "";

  // Rodapé - contato
  let contatoEmail = "";
  let contatoTelefone = "";
  let contatoWhatsapp = "";

  // Rodapé - endereço
  let enderecoLinha1 = "";
  let enderecoLinha2 = "";
  let enderecoLinha3 = "";
  let enderecoLinha4 = "";
  let enderecoLinha5 = "";

  // Rodapé - redes sociais
  let redesTwitter = "";
  let redesInstagram = "";
  let redesLinkedin = "";

  // Rodapé - parceiros
  let parceiros = "";

  // Rodapé - financiadores
  let financiadores = [];

  // Rodapé - apoios
  let apoios = [];

  let loading: boolean = false;
  let erro: string = "";
  let overlayEl: HTMLDivElement | undefined = undefined;

  $: sectionTitle =
    tipo === "hero"
      ? "Configuração do Hero"
      : tipo === "sobre"
        ? "Configuração do Sobre"
        : "Configuração do Rodapé";

  onMount(() => {
    if (config) {
      heroTitulo = config.heroTitulo || "";
      heroSubtitulo = config.heroSubtitulo || "";
      sobreTitulo = config.sobreTitulo || "";
      sobreConteudo = config.sobreConteudo || "";
      sobreMissao = config.sobreMissao || "";
      sobreVisao = config.sobreVisao || "";
      contatoEmail = config.contatoEmail || "";
      contatoTelefone = config.contatoTelefone || "";
      contatoWhatsapp = config.contatoWhatsapp || "";
      enderecoLinha1 = config.enderecoLinha1 || "";
      enderecoLinha2 = config.enderecoLinha2 || "";
      enderecoLinha3 = config.enderecoLinha3 || "";
      enderecoLinha4 = config.enderecoLinha4 || "";
      enderecoLinha5 = config.enderecoLinha5 || "";
      redesTwitter = config.redesTwitter || "";
      redesInstagram = config.redesInstagram || "";
      redesLinkedin = config.redesLinkedin || "";
      parceiros = config.parceiros || "";
      financiadores = (config.financiadores || []).map(function (f) {
        return Object.assign({}, f, { _file: null, _preview: f.logoUrl || "" });
      });
      apoios = (config.apoios || []).map(function (a) {
        return Object.assign({}, a, { _file: null, _preview: a.logoUrl || "" });
      });
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

  // Financiador management
  function addFinanciador() {
    const f = createFinanciadorModel();
    f._file = null;
    f._preview = "";
    financiadores = [...financiadores, f];
  }

  function removeFinanciador(index: number) {
    financiadores = financiadores.filter(function (_, i) {
      return i !== index;
    });
  }

  function handleFinanciadorLogoChange(e: Event, index: number) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      financiadores[index]._file = file;
      const reader = new FileReader();
      reader.onload = function (ev: ProgressEvent<FileReader>) {
        financiadores[index]._preview = ev.target?.result as string;
        financiadores = financiadores;
      };
      reader.readAsDataURL(file);
    }
  }

  function removeFinanciadorLogo(index: number) {
    financiadores[index]._file = null;
    financiadores[index]._preview = "";
    financiadores[index].logoUrl = "";
    financiadores = financiadores;
  }

  // Apoio management
  function addApoio() {
    const a = createApoioModel();
    a._file = null;
    a._preview = "";
    apoios = [...apoios, a];
  }

  function removeApoio(index: number) {
    apoios = apoios.filter(function (_, i) {
      return i !== index;
    });
  }

  function handleApoioLogoChange(e: Event, index: number) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      apoios[index]._file = file;
      const reader = new FileReader();
      reader.onload = function (ev: ProgressEvent<FileReader>) {
        apoios[index]._preview = ev.target?.result as string;
        apoios = apoios;
      };
      reader.readAsDataURL(file);
    }
  }

  function removeApoioLogo(index: number) {
    apoios[index]._file = null;
    apoios[index]._preview = "";
    apoios[index].logoUrl = "";
    apoios = apoios;
  }

  function validateForm() {
    if (tipo === "hero" && !heroTitulo.trim()) {
      erro = "O título do hero é obrigatório.";
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    loading = true;
    erro = "";

    try {
      // Upload financiador logos
      for (let i = 0; i < financiadores.length; i++) {
        if (financiadores[i]._file) {
          try {
            const url = await controllerUploadImagem(financiadores[i]._file);
            financiadores[i].logoUrl = url;
          } catch (uploadErr) {
            erro = "Erro ao enviar logo do financiador.";
            loading = false;
            return;
          }
        }
      }

      // Upload apoio logos
      for (let i = 0; i < apoios.length; i++) {
        if (apoios[i]._file) {
          try {
            const url = await controllerUploadImagem(apoios[i]._file);
            apoios[i].logoUrl = url;
          } catch (uploadErr) {
            erro = "Erro ao enviar logo do apoio.";
            loading = false;
            return;
          }
        }
      }

      const model = createConfiguracaoSiteModel({
        id: config.id,
        heroTitulo: heroTitulo.trim(),
        heroSubtitulo: heroSubtitulo.trim(),
        sobreTitulo: sobreTitulo.trim(),
        sobreConteudo: sobreConteudo.trim(),
        sobreMissao: sobreMissao.trim(),
        sobreVisao: sobreVisao.trim(),
        contatoEmail: contatoEmail.trim(),
        contatoTelefone: contatoTelefone.trim(),
        contatoWhatsapp: contatoWhatsapp.trim(),
        enderecoLinha1: enderecoLinha1.trim(),
        enderecoLinha2: enderecoLinha2.trim(),
        enderecoLinha3: enderecoLinha3.trim(),
        enderecoLinha4: enderecoLinha4.trim(),
        enderecoLinha5: enderecoLinha5.trim(),
        redesTwitter: redesTwitter.trim(),
        redesInstagram: redesInstagram.trim(),
        redesLinkedin: redesLinkedin.trim(),
        parceiros: parceiros.trim(),
        financiadores: financiadores.map(function (f) {
          return createFinanciadorModel({
            id: f.id,
            nome: f.nome,
            logoUrl: f.logoUrl,
            ordem: f.ordem,
            temDestaque: f.temDestaque,
            mostrarLogo: f.mostrarLogo,
          });
        }),
        apoios: apoios.map(function (a) {
          return createApoioModel({
            id: a.id,
            nome: a.nome,
            logoUrl: a.logoUrl,
            ordem: a.ordem,
            temDestaque: a.temDestaque,
            mostrarLogo: a.mostrarLogo,
          });
        }),
      });

      const resultado = await controllerAtualizarConfiguracao(model);

      if (resultado && resultado.sucesso !== false) {
        dispatch("success", { config: resultado.response || model });
        handleClose();
      } else {
        erro =
          (resultado && resultado.mensagem) || "Erro ao salvar configuração.";
      }
    } catch (err) {
      erro = err.message || "Erro ao salvar configuração. Tente novamente.";
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

    <h2 class="modal-title">{sectionTitle}</h2>

    {#if erro}
      <div class="error-msg">{erro}</div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
      {#if tipo === "hero"}
        <!-- Hero Section -->
        <div class="field">
          <label for="config-hero-titulo">Título do Hero *</label>
          <input
            id="config-hero-titulo"
            type="text"
            bind:value={heroTitulo}
            placeholder="Título principal"
            disabled={loading}
          />
        </div>
        <div class="field">
          <label for="config-hero-subtitulo">Subtítulo do Hero</label>
          <textarea
            id="config-hero-subtitulo"
            bind:value={heroSubtitulo}
            placeholder="Subtítulo ou descrição"
            disabled={loading}
            rows="3"
          ></textarea>
        </div>
      {:else if tipo === "sobre"}
        <!-- Sobre Section -->
        <div class="field">
          <label for="config-sobre-titulo">Título da Seção Sobre</label>
          <input
            id="config-sobre-titulo"
            type="text"
            bind:value={sobreTitulo}
            placeholder="Título"
            disabled={loading}
          />
        </div>
        <div class="field">
          <label for="config-sobre-conteudo">Conteúdo</label>
          <textarea
            id="config-sobre-conteudo"
            bind:value={sobreConteudo}
            placeholder="Texto sobre a instituição"
            disabled={loading}
            rows="4"
          ></textarea>
        </div>
        <div class="field">
          <label for="config-sobre-missao">Missão</label>
          <textarea
            id="config-sobre-missao"
            bind:value={sobreMissao}
            placeholder="Missão da instituição"
            disabled={loading}
            rows="2"
          ></textarea>
        </div>
        <div class="field">
          <label for="config-sobre-visao">Visão</label>
          <textarea
            id="config-sobre-visao"
            bind:value={sobreVisao}
            placeholder="Visão da instituição"
            disabled={loading}
            rows="2"
          ></textarea>
        </div>
      {:else if tipo === "rodape"}
        <!-- Rodapé Section -->
        <h3 class="section-subtitle">Contato</h3>
        <div class="field-row">
          <div class="field">
            <label for="config-contato-email">Email</label>
            <input
              id="config-contato-email"
              type="email"
              bind:value={contatoEmail}
              placeholder="contato@instituicao.br"
              disabled={loading}
            />
          </div>
          <div class="field">
            <label for="config-contato-telefone">Telefone</label>
            <input
              id="config-contato-telefone"
              type="text"
              bind:value={contatoTelefone}
              placeholder="(71) 99999-9999"
              disabled={loading}
            />
          </div>
        </div>
        <div class="field">
          <label for="config-contato-whatsapp">WhatsApp</label>
          <input
            id="config-contato-whatsapp"
            type="text"
            bind:value={contatoWhatsapp}
            placeholder="Link ou número WhatsApp"
            disabled={loading}
          />
        </div>

        <h3 class="section-subtitle">Endereço</h3>
        <div class="field">
          <label for="config-end-linha1">Linha 1</label>
          <input
            id="config-end-linha1"
            type="text"
            bind:value={enderecoLinha1}
            placeholder="Rua, número"
            disabled={loading}
          />
        </div>
        <div class="field">
          <label for="config-end-linha2">Linha 2</label>
          <input
            id="config-end-linha2"
            type="text"
            bind:value={enderecoLinha2}
            placeholder="Bairro"
            disabled={loading}
          />
        </div>
        <div class="field-row">
          <div class="field">
            <label for="config-end-linha3">Linha 3</label>
            <input
              id="config-end-linha3"
              type="text"
              bind:value={enderecoLinha3}
              placeholder="Cidade"
              disabled={loading}
            />
          </div>
          <div class="field">
            <label for="config-end-linha4">Linha 4</label>
            <input
              id="config-end-linha4"
              type="text"
              bind:value={enderecoLinha4}
              placeholder="Estado, CEP"
              disabled={loading}
            />
          </div>
        </div>
        <div class="field">
          <label for="config-end-linha5">Linha 5</label>
          <input
            id="config-end-linha5"
            type="text"
            bind:value={enderecoLinha5}
            placeholder="País"
            disabled={loading}
          />
        </div>

        <h3 class="section-subtitle">Redes Sociais</h3>
        <div class="field-row">
          <div class="field">
            <label for="config-redes-twitter">Twitter / X</label>
            <input
              id="config-redes-twitter"
              type="url"
              bind:value={redesTwitter}
              placeholder="https://twitter.com/..."
              disabled={loading}
            />
          </div>
          <div class="field">
            <label for="config-redes-instagram">Instagram</label>
            <input
              id="config-redes-instagram"
              type="url"
              bind:value={redesInstagram}
              placeholder="https://instagram.com/..."
              disabled={loading}
            />
          </div>
        </div>
        <div class="field">
          <label for="config-redes-linkedin">LinkedIn</label>
          <input
            id="config-redes-linkedin"
            type="url"
            bind:value={redesLinkedin}
            placeholder="https://linkedin.com/..."
            disabled={loading}
          />
        </div>

        <h3 class="section-subtitle">Parceiros</h3>
        <div class="field">
          <label for="config-parceiros">Texto dos Parceiros</label>
          <textarea
            id="config-parceiros"
            bind:value={parceiros}
            placeholder="Nomes dos parceiros, separados por linha"
            disabled={loading}
            rows="3"
          ></textarea>
        </div>

        <h3 class="section-subtitle">Financiadores</h3>
        {#each financiadores as fin, index}
          <div class="list-item">
            <div class="list-item-fields">
              <div class="field">
                <label>Nome</label>
                <input
                  type="text"
                  bind:value={fin.nome}
                  placeholder="Nome do financiador"
                  disabled={loading}
                />
              </div>
              <div class="field">
                <label>Ordem (Opcional)</label>
                <input
                  type="number"
                  bind:value={fin.ordem}
                  placeholder="0"
                  disabled={loading}
                  min="0"
                />
              </div>
            </div>
            <div class="list-item-logo">
              {#if fin._preview}
                <div class="mini-preview-container">
                  <img src={fin._preview} alt="Logo" class="mini-preview" />
                  <button
                    type="button"
                    class="btn-mini-remove"
                    on:click={() => removeFinanciadorLogo(index)}
                    disabled={loading}>&times;</button
                  >
                </div>
              {/if}
              <input
                type="file"
                accept="image/*"
                on:change={(e) => handleFinanciadorLogoChange(e, index)}
                disabled={loading}
                class="file-input-sm"
              />
            </div>
            <div class="checkbox-group-inline">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  bind:checked={fin.temDestaque}
                  disabled={loading}
                />
                <span>Destaque</span>
              </label>
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  bind:checked={fin.mostrarLogo}
                  disabled={loading}
                />
                <span>Mostrar Logo</span>
              </label>
            </div>
            <button
              type="button"
              class="btn-remove-item"
              on:click={() => removeFinanciador(index)}
              disabled={loading}>Remover</button
            >
          </div>
        {/each}
        <button
          type="button"
          class="btn-add-item"
          on:click={addFinanciador}
          disabled={loading}>+ Adicionar Financiador</button
        >

        <h3 class="section-subtitle">Apoios</h3>
        {#each apoios as apo, index}
          <div class="list-item">
            <div class="list-item-fields">
              <div class="field">
                <label>Nome</label>
                <input
                  type="text"
                  bind:value={apo.nome}
                  placeholder="Nome do apoio"
                  disabled={loading}
                />
              </div>
              <div class="field">
                <label>Ordem (Opcional)</label>
                <input
                  type="number"
                  bind:value={apo.ordem}
                  placeholder="0"
                  disabled={loading}
                  min="0"
                />
              </div>
            </div>
            <div class="list-item-logo">
              {#if apo._preview}
                <div class="mini-preview-container">
                  <img src={apo._preview} alt="Logo" class="mini-preview" />
                  <button
                    type="button"
                    class="btn-mini-remove"
                    on:click={() => removeApoioLogo(index)}
                    disabled={loading}>&times;</button
                  >
                </div>
              {/if}
              <input
                type="file"
                accept="image/*"
                on:change={(e) => handleApoioLogoChange(e, index)}
                disabled={loading}
                class="file-input-sm"
              />
            </div>
            <div class="checkbox-group-inline">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  bind:checked={apo.temDestaque}
                  disabled={loading}
                />
                <span>Destaque</span>
              </label>
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  bind:checked={apo.mostrarLogo}
                  disabled={loading}
                />
                <span>Mostrar Logo</span>
              </label>
            </div>
            <button
              type="button"
              class="btn-remove-item"
              on:click={() => removeApoio(index)}
              disabled={loading}>Remover</button
            >
          </div>
        {/each}
        <button
          type="button"
          class="btn-add-item"
          on:click={addApoio}
          disabled={loading}>+ Adicionar Apoio</button
        >
      {/if}

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
            Salvar
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

  .section-subtitle {
    font-size: 20px;
    color: #4a5d3c;
    margin-top: 30px;
    margin-bottom: 15px;
    border-bottom: 2px solid #e8ddc5;
    padding-bottom: 8px;
    font-weight: normal; /* In TSX it doesn't specify bold, but h3 browser default is bold. Leave browser default. */
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

  .list-item {
    border: 1px solid #e8ddc5;
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 15px;
    background-color: #fef9f0;
  }

  .list-item-fields {
    display: flex;
    gap: 15px;
  }

  .list-item-fields .field {
    flex: 1;
  }

  .list-item-logo {
    margin-bottom: 20px; /* Input already has 20px mb but wrap adds spacing */
  }

  .mini-preview-container {
    position: relative;
    display: inline-block;
    margin-bottom: 10px;
  }

  .mini-preview {
    max-width: 100px;
    display: block;
  }

  .btn-mini-remove {
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

  .file-input-sm {
    /* Base input style applies here */
  }

  .checkbox-group-inline {
    display: flex;
    gap: 16px;
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

  .btn-remove-item {
    color: red;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    font-size: 14px;
    margin-bottom: 15px;
  }

  .btn-add-item {
    background-color: #7a8a6a;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-bottom: 20px;
    display: block;
  }

  .btn-group {
    display: flex;
    gap: 10px;
    margin-top: 30px;
    position: sticky;
    bottom: -40px; /* Offset the 40px padding of modal */
    background-color: #ffffff;
    padding: 20px 0;
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

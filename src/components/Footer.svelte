<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { ConfiguracaoSiteModel } from '../models/ConfiguracaoSiteModel';
  import { createConfiguracaoSiteModel } from '../models/ConfiguracaoSiteModel';

  export let tema: number = 1;
  export let layout: number = 1;
  export let config: ConfiguracaoSiteModel = createConfiguracaoSiteModel();
  export let isAdmin: boolean = false;

  const dispatch = createEventDispatcher();

  let isMobile: boolean = false;

  function handleResize() {
    isMobile = window.innerWidth <= 768;
  }

  onMount(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  function getFooterStyle(t: number) {
    let style = "padding: 12px 20px; margin-top: 60px; position: relative;";
    if (t === 1) return style + " background-color: #4a5d3c; color: #e8ddc5;";
    if (t === 2) return style + " background-color: #e8ddc5; color: #4a5d3c; border-top: 3px solid #4a5d3c;";
    if (t === 3) return style + " background: linear-gradient(135deg, #7a8a6a 0%, #4a5d3c 100%); color: #ffffff;";
    if (t === 4) return style + " background-color: #f5f5f5; color: #4a5d3c; border-top: 4px solid #7a8a6a;";
    return style + " background-color: #2d3a28; color: #b8c7a8;";
  }

  function getLinkStyle(t: number) {
    if (t === 1) return "color: #e8ddc5; text-decoration: none;";
    if (t === 2) return "color: #4a5d3c; text-decoration: none;";
    if (t === 3) return "color: #ffffff; text-decoration: none;";
    if (t === 4) return "color: #7a8a6a; text-decoration: none;";
    return "color: #b8c7a8; text-decoration: none;";
  }

  $: parceirosArray = config.parceiros ? config.parceiros.split(/[,\n]+/).map(p => p.trim()).filter(p => p.length > 0) : [];
  $: financiadoresOrdenados = [...(config.financiadores || [])].sort((a, b) => a.ordem - b.ordem);
  $: apoiosOrdenados = [...(config.apoios || [])].sort((a, b) => a.ordem - b.ordem);
  $: apoiosDestaque = apoiosOrdenados.filter(f => f.temDestaque);
  $: apoiosComuns = apoiosOrdenados.filter(f => !f.temDestaque);

  function handleEditConfig() {
    dispatch('editConfig');
  }

  function formatUrl(url: string): string {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return 'https://' + url;
  }
</script>

<footer style={getFooterStyle(tema)}>
  {#if isAdmin}
    <button class="btn-edit" on:click={handleEditConfig}>
      Editar Rodapé
    </button>
  {/if}

  <div class="footer-container">
    <div class="footer-section">
      <div class="footer-title">Contato:</div>
      <div class="footer-content">Email: {config.contatoEmail}</div>
      <div class="footer-content">Telefone: {config.contatoTelefone}</div>
      <div class="footer-content">WhatsApp: {config.contatoWhatsapp}</div>
    </div>

    <div class="footer-section">
      <div class="footer-title">Endereço:</div>
      <div class="footer-content">
        {#if config.enderecoLinha1}{config.enderecoLinha1}<br />{/if}
        {#if config.enderecoLinha2}{config.enderecoLinha2}<br />{/if}
        {#if config.enderecoLinha3}{config.enderecoLinha3}<br />{/if}
        {#if config.enderecoLinha4}{config.enderecoLinha4}<br />{/if}
        {#if config.enderecoLinha5}{config.enderecoLinha5}{/if}
      </div>
    </div>

    <div class="footer-section">
      <div class="footer-title">Redes Sociais:</div>
      {#if config.redesTwitter}
        <div class="footer-content">
          <a href={formatUrl(config.redesTwitter)} style={getLinkStyle(tema)} target="_blank" rel="noopener noreferrer">Twitter/X</a>
        </div>
      {/if}
      {#if config.redesInstagram}
        <div class="footer-content">
          <a href={formatUrl(config.redesInstagram)} style={getLinkStyle(tema)} target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      {/if}
      {#if config.redesLinkedin}
        <div class="footer-content">
          <a href={formatUrl(config.redesLinkedin)} style={getLinkStyle(tema)} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      {/if}
    </div>

    <div class="footer-section">
      <div class="footer-title">Parceiros:</div>
      {#each parceirosArray as parceiro}
        <div class="footer-content">{parceiro}</div>
      {/each}
    </div>

    <div class="footer-section auto-width">
      <div class="footer-title">Financiamento:</div>
      <div class="logos-container">
        {#each financiadoresOrdenados as f}
          <div class="logo-wrapper">
            <div class="logo-name">{f.nome}</div>
            {#if f.logoUrl}
              <div class="logo-box">
                <img src={f.logoUrl} alt={f.nome} class="logo-img-large" />
              </div>
            {/if}
          </div>
        {/each}
        {#if financiadoresOrdenados.length === 0}
          <div class="footer-content">FAPESB</div>
        {/if}
      </div>
    </div>

    <div class="footer-section auto-width">
      <div class="footer-title">Apoio:</div>
      <div class="logos-container">
        {#each apoiosDestaque as f}
          <div class="logo-wrapper">
            <div class="logo-name">{f.nome}</div>
            {#if f.logoUrl}
              <div class="logo-box">
                <img src={f.logoUrl} alt={f.nome} class="logo-img-large" />
              </div>
            {/if}
          </div>
        {/each}

        {#each apoiosComuns as f}
          <div class="logo-wrapper">
            <div class="logo-name-small">{f.nome}</div>
            {#if f.logoUrl}
              <div class="logo-box-small">
                <img src={f.logoUrl} alt={f.nome} class="logo-img-small" />
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="copyright">
    © 2026 Bioprofar-BA - Rede Baiana de Bioprospecção e Desenvolvimento de Fármacos. Todos os direitos reservados.
  </div>
</footer>

<style>
  .btn-edit {
    position: absolute;
    top: 8px;
    right: 20px;
    padding: 8px 16px;
    background-color: #7a8a6a;
    color: #ffffff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
  }

  .footer-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 40px;
  }

  @media (max-width: 768px) {
    .footer-container {
      flex-direction: column;
      gap: 25px;
    }
  }

  .footer-section {
    line-height: 1.8;
    flex: 0 1 auto;
    min-width: 150px;
  }

  .footer-section.auto-width {
    min-width: auto;
  }

  .footer-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .footer-content {
    font-size: 14.5px;
    line-height: 1.6;
  }

  .logos-container {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-items: flex-start;
  }

  .logo-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .logo-name {
    font-weight: bold;
    font-size: 14.5px;
    height: 24px;
    display: flex;
    align-items: center;
  }

  .logo-name-small {
    font-weight: normal;
    font-size: 13px;
    height: 24px;
    display: flex;
    align-items: center;
  }

  .logo-box {
    line-height: 0;
    height: 80px;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 8px;
    box-sizing: border-box;
  }

  .logo-img-large {
    height: 65px;
    max-width: 180px;
    object-fit: contain;
  }

  .logo-box-small {
    line-height: 0;
    height: 28px;
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border-radius: 4px;
    padding: 2px;
    box-sizing: border-box;
  }

  .logo-img-small {
    height: 22px;
    max-width: 65px;
    object-fit: contain;
  }

  .copyright {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 14.5px;
  }
</style>

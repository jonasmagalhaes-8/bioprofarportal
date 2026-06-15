<script lang="ts">
  import { onMount } from 'svelte';
  import {
    tema, layout, usuario, config, isAdmin, refreshTrigger,
    showFormNoticia, showFormArtigo, showFormEquipe, showFormConfig,
    showFormImagemCarrossel, showFormPortfolio,
    showGerenciarEquipe, showGerenciarPesquisadores, showGerenciarNoticias,
    showGerenciarArtigos, showGerenciarPortfolio, showGerenciarImagensCarrossel,
    noticiaEditando, artigoEditando, membroEditando, portfolioEditando,
    imagemCarrosselEditando, tipoFormConfig, origemFormEquipe
  } from '../../stores/appStore';
  import { controllerGetConfiguracao } from '../../controllers/ConfiguracaoController';
  import { controllerListarNoticias } from '../../controllers/NoticiaController';
  import { controllerListarArtigos } from '../../controllers/ArtigoController';
  import { controllerListarComite, controllerListarPesquisadores } from '../../controllers/EquipeController';
  import { controllerListarPortfolio } from '../../controllers/PortfolioController';
  import { controllerListarImagensCarrossel } from '../../controllers/ImagemCarrosselController';
  import CarrosselImagens from '../../components/CarrosselImagens.svelte';
  import CarrosselItems from '../../components/CarrosselItems.svelte';
  import CarrosselEquipe from '../../components/CarrosselEquipe.svelte';
  import VerTudoNoticias from '../../components/VerTudoNoticias.svelte';
  import VerTudoArtigos from '../../components/VerTudoArtigos.svelte';
  import VerTudoPortfolio from '../../components/VerTudoPortfolio.svelte';
  import VerTudoEquipe from '../../components/VerTudoEquipe.svelte';







  let noticias: any[] = [];
  let artigos: any[] = [];
  let comiteGestor: any[] = [];
  let pesquisadores: any[] = [];
  let portfolio: any[] = [];
  let imagensCarrossel: any[] = [];

  // VerTudo modal states
  let showVerTudoNoticias: boolean = false;
  let showVerTudoArtigos: boolean = false;
  let showVerTudoPortfolio: boolean = false;
  let showVerTudoComite: boolean = false;
  let showVerTudoPesquisadores: boolean = false;

  // Detail view states
  let noticiaDetalhe: any = null;
  let artigoDetalhe: any = null;
  let portfolioDetalhe: any = null;

  const temas = {
    1: { bg: '#f5f5f0', cardBg: '#ffffff', text: '#333333', heading: '#2c3e2c', accent: '#4a5d3c', accentLight: '#8cb369', border: '#e0e0e0', sectionBg: '#ffffff', heroOverlay: 'rgba(74,93,60,0.7)' },
    2: { bg: '#fef5e7', cardBg: '#ffffff', text: '#5a4a3a', heading: '#4a3728', accent: '#c97b3a', accentLight: '#e8a85c', border: '#e8d5c0', sectionBg: '#ffffff', heroOverlay: 'rgba(201,123,58,0.6)' },
    3: { bg: '#1a2615', cardBg: '#2d3a24', text: '#c8d6c0', heading: '#e0ead8', accent: '#8cb369', accentLight: '#6b8f5b', border: '#3d4f31', sectionBg: '#222e1c', heroOverlay: 'rgba(31,43,26,0.75)' },
    4: { bg: '#f8f9fa', cardBg: '#ffffff', text: '#2c3e50', heading: '#1a252f', accent: '#4a5d3c', accentLight: '#7a8a6a', border: '#dee2e6', sectionBg: '#ffffff', heroOverlay: 'rgba(74,93,60,0.65)' },
    5: { bg: '#0f1a0a', cardBg: '#1f2b1a', text: '#a8b8a0', heading: '#d4e0cc', accent: '#6b8f5b', accentLight: '#8cb369', border: '#2d3a24', sectionBg: '#162010', heroOverlay: 'rgba(15,26,10,0.8)' }
  };

  $: temaAtual = temas[$tema] || temas[1];

  onMount(async () => {
    await loadAllData();
  });

  $: if ($refreshTrigger) {
    loadAllData();
  }

  async function loadAllData() {
    await Promise.all([
      loadConfig(),
      loadNoticias(),
      loadArtigos(),
      loadComite(),
      loadPesquisadores(),
      loadPortfolio(),
      loadImagensCarrossel()
    ]);
  }

  async function loadConfig() {
    try {
      const resultado = await controllerGetConfiguracao();
      if (resultado && resultado.response) {
        config.set(resultado.response);
      }
    } catch (err) {
      console.error('Erro ao carregar config:', err);
    }
  }

  async function loadNoticias() {
    try {
      const resultado = await controllerListarNoticias();
      noticias = resultado.response || resultado || [];
    } catch (err) {
      console.error('Erro ao carregar noticias:', err);
    }
  }

  async function loadArtigos() {
    try {
      const resultado = await controllerListarArtigos();
      artigos = resultado.response || resultado || [];
    } catch (err) {
      console.error('Erro ao carregar artigos:', err);
    }
  }

  async function loadComite() {
    try {
      const resultado = await controllerListarComite();
      comiteGestor = resultado.response || resultado || [];
    } catch (err) {
      console.error('Erro ao carregar comite:', err);
    }
  }

  async function loadPesquisadores() {
    try {
      const resultado = await controllerListarPesquisadores();
      pesquisadores = resultado.response || resultado || [];
    } catch (err) {
      console.error('Erro ao carregar pesquisadores:', err);
    }
  }

  async function loadPortfolio() {
    try {
      const resultado = await controllerListarPortfolio();
      portfolio = resultado.response || resultado || [];
    } catch (err) {
      console.error('Erro ao carregar portfolio:', err);
    }
  }

  async function loadImagensCarrossel() {
    try {
      const resultado = await controllerListarImagensCarrossel();
      imagensCarrossel = resultado.response || resultado || [];
    } catch (err) {
      console.error('Erro ao carregar imagens carrossel:', err);
    }
  }

  function formatarData(data: string) {
    if (!data) return '';
    try {
      return new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return data; }
  }

  function truncar(texto: string, max: number = 150) {
    if (!texto) return '';
    return texto.length > max ? texto.substring(0, max) + '...' : texto;
  }

  // Admin actions
  function openEditConfig(tipo: string) {
    tipoFormConfig.set(tipo);
    showFormConfig.set(true);
  }

  function openAddNoticia() {
    noticiaEditando.set(null);
    showFormNoticia.set(true);
  }

  function openEditNoticia(noticia: any) {
    noticiaEditando.set(noticia);
    showFormNoticia.set(true);
  }

  function openAddArtigo() {
    artigoEditando.set(null);
    showFormArtigo.set(true);
  }

  function openEditArtigo(artigo: any) {
    artigoEditando.set(artigo);
    showFormArtigo.set(true);
  }

  function openAddPortfolio() {
    portfolioEditando.set(null);
    showFormPortfolio.set(true);
  }

  function openEditPortfolio(item: any) {
    portfolioEditando.set(item);
    showFormPortfolio.set(true);
  }

  function openAddMembro(origem: string) {
    membroEditando.set(null);
    origemFormEquipe.set(origem);
    showFormEquipe.set(true);
  }

  function openAddImagemCarrossel() {
    imagemCarrosselEditando.set(null);
    showFormImagemCarrossel.set(true);
  }

  // VerTudo handlers
  function handleVerTudoNoticiaSelect(e: any) {
    showVerTudoNoticias = false;
    openNoticiaDetalhe(e.detail.noticia);
  }

  function handleVerTudoArtigosSelect(e: any) {
    showVerTudoArtigos = false;
    openArtigoDetalhe(e.detail.artigo);
  }

  function handleVerTudoPortfolioSelect(e: any) {
    showVerTudoPortfolio = false;
    openPortfolioDetalhe(e.detail.item);
  }

  function handleVerTudoEquipeSelect(e: any) {
    // Just close the modal for now
    showVerTudoComite = false;
    showVerTudoPesquisadores = false;
  }

  function openNoticiaDetalhe(noticia: any) {
    noticiaDetalhe = noticia;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openArtigoDetalhe(artigo: any) {
    artigoDetalhe = artigo;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openPortfolioDetalhe(item: any) {
    portfolioDetalhe = item;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Detail close
  function closeNoticiaDetalhe() { noticiaDetalhe = null; }
  function closeArtigoDetalhe() { artigoDetalhe = null; }
  function closePortfolioDetalhe() { portfolioDetalhe = null; }

  let windowWidth = 1024;
  $: isMobile = windowWidth <= 768;

  function getContainerStyle(layout, isMobile, isDetailView) {
    if (layout === 2) return `max-width: 1400px; margin: 0 auto; padding: ${isMobile && isDetailView ? '5px 0' : '10px 15px'};`;
    if (layout === 3) return `max-width: 900px; margin: 0 auto; padding: ${isMobile && isDetailView ? '5px 0' : '10px 15px'};`;
    if (layout === 4) return `max-width: 1600px; margin: 0 auto; padding: ${isMobile && isDetailView ? '5px 0' : '10px 50px'};`;
    if (layout === 5) return `max-width: 1200px; margin: 0 auto; padding: ${isMobile && isDetailView ? '5px 0' : '15px 25px'};`;
    return `max-width: 1000px; margin: 0 auto; padding: ${isMobile && isDetailView ? '5px 0' : '15px 10px'};`;
  }

  function getHeroStyle(tema, layout) {
    let padding = layout === 1 ? '15px 50px' : '15px 40px';
    let baseStyle = `padding: ${padding}; border-radius: 12px; margin-bottom: 20px; text-align: center; position: relative; margin-top: -5px;`;
    
    if (layout === 1) baseStyle += 'box-shadow: 0 15px 50px rgba(74, 93, 60, 0.15);';
    if (layout === 3) baseStyle += 'box-shadow: 0 10px 30px rgba(0,0,0,0.2); transform: translateY(-10px);';
    if (layout === 5) baseStyle += 'text-align: left; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center;';

    if (tema === 1) return baseStyle + 'background-color: #4a5d3c; color: #ffffff;';
    if (tema === 2) return baseStyle + 'background-color: #fef5e7; color: #4a5d3c; border: 3px solid #d4a574;';
    if (tema === 3) return baseStyle + 'background: linear-gradient(135deg, #4a5d3c 0%, #7a8a6a 100%); color: #ffffff;';
    if (tema === 4) return baseStyle + 'background-color: #ffffff; color: #2c3e50; border: 3px solid #34495e;';
    return baseStyle + 'background-color: #1f2b1a; color: #ffffff;';
  }

  function getEditButtonStyle() {
    return 'position: absolute; top: 15px; right: 15px; padding: 8px 16px; background-color: rgba(122, 138, 106, 0.9); color: #ffffff; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;';
  }

  function getSectionTitleStyle(tema, layout) {
    let color = (tema === 2 || tema === 4) ? '#4a5d3c' : '#4a5d3c';
    return `font-size: 32px; margin-bottom: 30px; color: ${color}; border-bottom: 3px solid #7a8a6a; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;`;
  }

  function getManageButtonStyle() {
    return 'padding: 8px 16px; background-color: #7a8a6a; color: #ffffff; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold;';
  }

  function getGridStyle(layout) {
    if (layout === 2) return 'display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; margin-bottom: 60px;';
    if (layout === 3) return 'display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 30px; margin-bottom: 60px;';
    if (layout === 4) return 'display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px; margin-bottom: 60px;';
    if (layout === 5) return 'display: flex; flex-direction: column; gap: 20px; margin-bottom: 60px;';
    return 'display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 25px; margin-bottom: 60px;';
  }

  function getCardStyle(tema, layout) {
    let baseStyle = 'padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s; cursor: pointer; position: relative;';
    if (layout === 1) baseStyle += 'box-shadow: 0 5px 20px rgba(74, 93, 60, 0.1);';
    if (layout === 3) baseStyle += 'box-shadow: 0 4px 15px rgba(0,0,0,0.15); padding: 30px;';
    if (layout === 5) baseStyle += 'display: grid; grid-template-columns: 200px 1fr; gap: 20px; align-items: start;';

    if (tema === 1) return baseStyle + 'background-color: #ffffff; border: 2px solid #e8ddc5;';
    if (tema === 2) return baseStyle + 'background-color: #fef9f0; border: 2px solid #e8ddc5;';
    if (tema === 3) return baseStyle + 'background-color: #ffffff; border-left: 4px solid #7a8a6a;';
    if (tema === 4) return baseStyle + 'background-color: #ffffff; border: 2px solid #bdc3c7;';
    return baseStyle + 'background-color: #2a3526; color: #e8ddc5;';
  }

  function getImageStyle(layout) {
    if (layout === 5) return 'width: 200px; height: 200px; object-fit: contain; border-radius: 6px;';
    return 'width: 100%; aspect-ratio: 1 / 1; object-fit: cover; object-position: top; background-color: #f4f5f1; border-radius: 6px; border-bottom-left-radius: 0; border-bottom-right-radius: 0; margin-bottom: 0; display: block;';
  }

  function getBackButtonStyle(isMobile) {
    return `padding: 12px 24px; background-color: #7a8a6a; color: #ffffff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: bold; margin-bottom: ${isMobile ? '15px' : '30px'}; margin-top: ${isMobile ? '15px' : '0'}; margin-left: ${isMobile ? '10px' : '0'}; display: inline-flex; align-items: center; gap: 8px;`;
  }

  function getDetailContainerStyle(tema, isMobile) {
    let bg = tema === 5 ? '#2a3526' : '#ffffff';
    let pad = isMobile ? '20px' : '40px';
    let rad = isMobile ? '0' : '12px';
    let shadow = isMobile ? 'none' : '0 4px 20px rgba(0,0,0,0.1)';
    let mb = isMobile ? '0' : '40px';
    return `background-color: ${bg}; padding: ${pad}; border-radius: ${rad}; box-shadow: ${shadow}; margin-bottom: ${mb};`;
  }
</script>

<svelte:window bind:innerWidth={windowWidth} />

{#if !portfolioDetalhe && !noticiaDetalhe && !artigoDetalhe && !showVerTudoPortfolio && !showVerTudoNoticias && !showVerTudoArtigos && !showVerTudoComite && !showVerTudoPesquisadores}
  <div style={getContainerStyle($layout, isMobile, false)}>
    <div style={getHeroStyle($tema, $layout)}>
      {#if $isAdmin}
        <button style={getEditButtonStyle()} on:click={() => openEditConfig('hero')}>Editar</button>
      {/if}
      {#if $layout === 5}
        <div>
          <h1 style="font-size: 32px; margin-bottom: 15px;">{$config.heroTitulo || 'BioProFar'}</h1>
          <p style="font-size: 14px; line-height: 1.5; margin: 0 auto;">{$config.heroSubtitulo || ''}</p>
        </div>
        <div style="width: 100%; height: 300px; background-color: #7a8a6a; border-radius: 12px;"></div>
      {:else}
        <h1 style="font-size: 32px; margin-bottom: 15px;">{$config.heroTitulo || 'BioProFar'}</h1>
        <p style="font-size: 14px; line-height: 1.5; max-width: 800px; margin: 0 auto;">{$config.heroSubtitulo || ''}</p>
      {/if}
    </div>

    <div style="position: relative;">
      {#if $isAdmin}
        <button
          style="{getManageButtonStyle()}; {imagensCarrossel.length > 0 ? 'position: absolute; top: 10px; right: 10px; z-index: 20;' : 'display: block; margin: 0 0 20px auto; z-index: 20;'}"
          on:click={() => showGerenciarImagensCarrossel.set(true)}
        >
          Gerenciar Imagens
        </button>
      {/if}
      <CarrosselImagens imagens={imagensCarrossel} altura="450px" autoPlay={true} intervalo={5000} />
    </div>

    <h2 style={getSectionTitleStyle($tema, $layout)}>
      <span>Portfólio</span>
      <div style="display: flex; gap: 10px;">
        <button style={getManageButtonStyle()} on:click={() => showVerTudoPortfolio = true}>Ver tudo</button>
        {#if $isAdmin}
          <button style={getManageButtonStyle()} on:click={() => showGerenciarPortfolio.set(true)}>Gerenciar Portfólio</button>
        {/if}
      </div>
    </h2>
    {#if isMobile}
      <CarrosselItems items={portfolio} let:item>
          <div style={getCardStyle($tema, $layout)} on:click={() => openPortfolioDetalhe(item)} role="button" tabindex="0">
            {#if $layout !== 5 && item.imagemUrl}
              <img src={item.imagemUrl} alt={item.titulo} style={getImageStyle($layout)} />
            {/if}
            {#if $layout === 5 && item.imagemUrl}
              <img src={item.imagemUrl} alt={item.titulo} style={getImageStyle($layout)} />
              <div>
                <h3 style="margin-bottom: 10px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'}; font-size: 18px;">{item.titulo}</h3>
                <p style="font-size: 13px; color: {$tema === 5 ? '#9aaa8a' : '#7a8a6a'}; margin-bottom: 8px; font-weight: bold;">{item.tipo} | {item.ano}</p>
                <p style="line-height: 1.6; font-size: 14px;">{item.descricao}</p>
              </div>
            {:else}
              <h3 style="margin-bottom: 10px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'}; font-size: 18px;">{item.titulo}</h3>
              <p style="font-size: 13px; color: {$tema === 5 ? '#9aaa8a' : '#7a8a6a'}; margin-bottom: 8px; font-weight: bold;">{item.tipo} | {item.ano}</p>
              <p style="line-height: 1.6; font-size: 14px;">{item.descricao}</p>
            {/if}
          </div>
      </CarrosselItems>
    {:else}
      <div style={getGridStyle($layout)}>
        {#each portfolio as item (item.id)}
          <div style={getCardStyle($tema, $layout)} on:click={() => openPortfolioDetalhe(item)} role="button" tabindex="0">
            {#if $layout !== 5 && item.imagemUrl}
              <img src={item.imagemUrl} alt={item.titulo} style={getImageStyle($layout)} />
            {/if}
            {#if $layout === 5 && item.imagemUrl}
              <img src={item.imagemUrl} alt={item.titulo} style={getImageStyle($layout)} />
              <div>
                <h3 style="margin-bottom: 10px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'}; font-size: 18px;">{item.titulo}</h3>
                <p style="font-size: 13px; color: {$tema === 5 ? '#9aaa8a' : '#7a8a6a'}; margin-bottom: 8px; font-weight: bold;">{item.tipo} | {item.ano}</p>
                <p style="line-height: 1.6; font-size: 14px;">{item.descricao}</p>
              </div>
            {:else}
              <h3 style="margin-bottom: 10px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'}; font-size: 18px;">{item.titulo}</h3>
              <p style="font-size: 13px; color: {$tema === 5 ? '#9aaa8a' : '#7a8a6a'}; margin-bottom: 8px; font-weight: bold;">{item.tipo} | {item.ano}</p>
              <p style="line-height: 1.6; font-size: 14px;">{item.descricao}</p>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    <h2 style={getSectionTitleStyle($tema, $layout)}>
      <span>Notícias</span>
      <div style="display: flex; gap: 10px;">
        <button style={getManageButtonStyle()} on:click={() => showVerTudoNoticias = true}>Ver tudo</button>
        {#if $isAdmin}
          <button style={getManageButtonStyle()} on:click={() => showGerenciarNoticias.set(true)}>Gerenciar Notícias</button>
        {/if}
      </div>
    </h2>
    {#if isMobile}
      <CarrosselItems items={noticias.slice(0, 3)} let:item={noticia}>
          <div style={getCardStyle($tema, $layout)} on:click={() => openNoticiaDetalhe(noticia)} role="button" tabindex="0">
            {#if $layout !== 5}
              {#if noticia.imagens && noticia.imagens.length > 0}
                <img src={noticia.imagens[0]} alt={noticia.titulo} style={getImageStyle($layout)} />
              {:else if noticia.imagemUrl}
                <img src={noticia.imagemUrl} alt={noticia.titulo} style={getImageStyle($layout)} />
              {/if}
            {/if}
            {#if $layout === 5}
              {#if noticia.imagens && noticia.imagens.length > 0}
                <img src={noticia.imagens[0]} alt={noticia.titulo} style={getImageStyle($layout)} />
              {:else if noticia.imagemUrl}
                <img src={noticia.imagemUrl} alt={noticia.titulo} style={getImageStyle($layout)} />
              {/if}
              <div>
                <h3 style="margin-bottom: 10px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'};">{noticia.titulo}</h3>
                <p style="font-size: 14px; color: {$tema === 5 ? '#9aaa8a' : '#666'}; margin-bottom: 10px;">{formatarData(noticia.data)} - {noticia.autor}</p>
                <p style="line-height: 1.6;">{truncar(noticia.conteudo, 150)}</p>
              </div>
            {:else}
              <h3 style="margin-bottom: 10px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'};">{noticia.titulo}</h3>
              <p style="font-size: 14px; color: {$tema === 5 ? '#9aaa8a' : '#666'}; margin-bottom: 10px;">{formatarData(noticia.data)} - {noticia.autor}</p>
              <p style="line-height: 1.6;">{truncar(noticia.conteudo, 150)}</p>
            {/if}
          </div>
      </CarrosselItems>
    {:else}
      <div style={getGridStyle($layout)}>
        {#each noticias.slice(0, 3) as noticia (noticia.id)}
          <div style={getCardStyle($tema, $layout)} on:click={() => openNoticiaDetalhe(noticia)} role="button" tabindex="0">
            {#if $layout !== 5}
              {#if noticia.imagens && noticia.imagens.length > 0}
                <img src={noticia.imagens[0]} alt={noticia.titulo} style={getImageStyle($layout)} />
              {:else if noticia.imagemUrl}
                <img src={noticia.imagemUrl} alt={noticia.titulo} style={getImageStyle($layout)} />
              {/if}
            {/if}
            {#if $layout === 5}
              {#if noticia.imagens && noticia.imagens.length > 0}
                <img src={noticia.imagens[0]} alt={noticia.titulo} style={getImageStyle($layout)} />
              {:else if noticia.imagemUrl}
                <img src={noticia.imagemUrl} alt={noticia.titulo} style={getImageStyle($layout)} />
              {/if}
              <div>
                <h3 style="margin-bottom: 10px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'};">{noticia.titulo}</h3>
                <p style="font-size: 14px; color: {$tema === 5 ? '#9aaa8a' : '#666'}; margin-bottom: 10px;">{formatarData(noticia.data)} - {noticia.autor}</p>
                <p style="line-height: 1.6;">{truncar(noticia.conteudo, 150)}</p>
              </div>
            {:else}
              <h3 style="margin-bottom: 10px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'}; font-size: 18px;">{noticia.titulo}</h3>
              <p style="font-size: 13px; color: {$tema === 5 ? '#9aaa8a' : '#666'}; margin-bottom: 10px;">{formatarData(noticia.data)} - {noticia.autor}</p>
              <p style="line-height: 1.6; font-size: 14px;">{truncar(noticia.conteudo, 150)}</p>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    <h2 style={getSectionTitleStyle($tema, $layout)}>
      <span>Artigos</span>
      <div style="display: flex; gap: 10px;">
        <button style={getManageButtonStyle()} on:click={() => showVerTudoArtigos = true}>Ver tudo</button>
        {#if $isAdmin}
          <button style={getManageButtonStyle()} on:click={() => showGerenciarArtigos.set(true)}>Gerenciar Artigos</button>
        {/if}
      </div>
    </h2>
    {#if isMobile}
      <CarrosselItems items={artigos.slice(0, 3)} let:item={artigo}>
          <div style={getCardStyle($tema, $layout)} on:click={() => openArtigoDetalhe(artigo)} role="button" tabindex="0">
            <h3 style="margin-bottom: 10px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'}; font-size: 18px;">{artigo.titulo}</h3>
            <p style="font-size: 13px; color: {$tema === 5 ? '#9aaa8a' : '#7a8a6a'}; margin-bottom: 8px;"><strong>Autores:</strong> {artigo.autores}</p>
            <p style="font-size: 13px; color: {$tema === 5 ? '#8a9a7a' : '#666'}; margin-bottom: 10px;">{artigo.revista} - {formatarData(artigo.dataPublicacao)}</p>
            <p style="line-height: 1.6; font-size: 14px;">{truncar(artigo.resumo, 120)}</p>
          </div>
      </CarrosselItems>
    {:else}
      <div style={getGridStyle($layout)}>
        {#each artigos.slice(0, 3) as artigo (artigo.id)}
          <div style={getCardStyle($tema, $layout)} on:click={() => openArtigoDetalhe(artigo)} role="button" tabindex="0">
            <h3 style="margin-bottom: 10px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'}; font-size: 18px;">{artigo.titulo}</h3>
            <p style="font-size: 14px; color: {$tema === 5 ? '#9aaa8a' : '#7a8a6a'}; margin-bottom: 8px;"><strong>Autores:</strong> {artigo.autores}</p>
            <p style="font-size: 13px; color: {$tema === 5 ? '#8a9a7a' : '#666'}; margin-bottom: 10px;">{artigo.revista} - {formatarData(artigo.dataPublicacao)}</p>
            <p style="line-height: 1.6; font-size: 14px;">{truncar(artigo.resumo, 120)}</p>
          </div>
        {/each}
      </div>
    {/if}

    <h2 style={getSectionTitleStyle($tema, $layout)}>
      <span>Comitê Gestor</span>
      <div style="display: flex; gap: 10px;">
        <button style={getManageButtonStyle()} on:click={() => showVerTudoComite = true}>Ver tudo</button>
        {#if $isAdmin}
          <button style={getManageButtonStyle()} on:click={() => showGerenciarEquipe.set(true)}>Gerenciar Equipe</button>
        {/if}
      </div>
    </h2>
    <CarrosselEquipe membros={comiteGestor} tema={$tema} isDestaque={true} />

    <h2 style="{getSectionTitleStyle($tema, $layout)} margin-top: 60px;">
      <span>Pesquisadores</span>
      <div style="display: flex; gap: 10px;">
        <button style={getManageButtonStyle()} on:click={() => showVerTudoPesquisadores = true}>Ver tudo</button>
        {#if $isAdmin}
          <button style={getManageButtonStyle()} on:click={() => showGerenciarPesquisadores.set(true)}>Gerenciar Pesquisadores</button>
        {/if}
      </div>
    </h2>
    <CarrosselEquipe membros={pesquisadores} tema={$tema} isDestaque={false} />

  </div>
{/if}

{#if showVerTudoPortfolio}
  <VerTudoPortfolio itens={portfolio} tema={$tema} on:close={() => showVerTudoPortfolio = false} on:select={handleVerTudoPortfolioSelect} />
{/if}

{#if showVerTudoNoticias}
  <VerTudoNoticias {noticias} tema={$tema} on:close={() => showVerTudoNoticias = false} on:select={handleVerTudoNoticiaSelect} />
{/if}

{#if showVerTudoArtigos}
  <VerTudoArtigos {artigos} tema={$tema} on:close={() => showVerTudoArtigos = false} on:select={handleVerTudoArtigoSelect} />
{/if}

{#if showVerTudoComite}
  <VerTudoEquipe membros={comiteGestor} titulo="Comitê Gestor Completo" tema={$tema} on:close={() => showVerTudoComite = false} on:select={handleVerTudoEquipeSelect} />
{/if}

{#if showVerTudoPesquisadores}
  <VerTudoEquipe membros={pesquisadores} titulo="Todos os Pesquisadores" tema={$tema} on:close={() => showVerTudoPesquisadores = false} on:select={handleVerTudoEquipeSelect} />
{/if}

{#if noticiaDetalhe}
  <div style={getContainerStyle($layout, isMobile, true)}>
    <button style={getBackButtonStyle(isMobile)} on:click={closeNoticiaDetalhe}>← Voltar</button>
    <div style={getDetailContainerStyle($tema, isMobile)}>
      {#if noticiaDetalhe.imagens && noticiaDetalhe.imagens.length > 1}
        <div style="margin-bottom: 30px; border-radius: 12px; overflow: hidden;">
          <CarrosselImagens 
            imagens={noticiaDetalhe.imagens.map(url => ({ url, titulo: noticiaDetalhe.titulo }))} 
            altura="400px" 
          />
        </div>
      {:else if noticiaDetalhe.imagens && noticiaDetalhe.imagens.length === 1}
        <img src={noticiaDetalhe.imagens[0]} alt={noticiaDetalhe.titulo} style="width: 100%; max-height: 600px; object-fit: contain; background-color: rgba(0,0,0,0.03); border-radius: 12px; margin-bottom: 30px;" />
      {:else if noticiaDetalhe.imagemUrl}
        <img src={noticiaDetalhe.imagemUrl} alt={noticiaDetalhe.titulo} style="width: 100%; max-height: 600px; object-fit: contain; background-color: rgba(0,0,0,0.03); border-radius: 12px; margin-bottom: 30px;" />
      {/if}
      <h1 style="font-size: 36px; margin-bottom: 20px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'};">{noticiaDetalhe.titulo}</h1>
      <div style="font-size: 14px; color: {$tema === 5 ? '#9aaa8a' : '#666'}; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e8ddc5;">
        <strong>Data:</strong> {formatarData(noticiaDetalhe.data)} | <strong>Autor:</strong> {noticiaDetalhe.autor}
      </div>
      <div style="font-size: 16px; line-height: 1.8; color: {$tema === 5 ? '#e8ddc5' : '#333'};">
        {noticiaDetalhe.conteudo}
      </div>
    </div>
  </div>
{/if}

{#if artigoDetalhe}
  <div style={getContainerStyle($layout, isMobile, true)}>
    <button style={getBackButtonStyle(isMobile)} on:click={closeArtigoDetalhe}>← Voltar</button>
    <div style={getDetailContainerStyle($tema, isMobile)}>
      <h1 style="font-size: 36px; margin-bottom: 20px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'};">{artigoDetalhe.titulo}</h1>
      <div style="font-size: 15px; color: {$tema === 5 ? '#9aaa8a' : '#666'}; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e8ddc5;">
        <div style="margin-bottom: 10px;"><strong>Autores:</strong> {artigoDetalhe.autores}</div>
        <div style="margin-bottom: 10px;"><strong>Revista:</strong> {artigoDetalhe.revista}</div>
        <div style="margin-bottom: 10px;"><strong>Data de Publicação:</strong> {formatarData(artigoDetalhe.dataPublicacao)}</div>
        {#if artigoDetalhe.doi}
          <div><strong>DOI:</strong> <a href="https://doi.org/{artigoDetalhe.doi}" target="_blank" rel="noopener noreferrer" style="color: #7a8a6a; text-decoration: underline;">{artigoDetalhe.doi}</a></div>
        {/if}
      </div>
      <div style="font-size: 16px; line-height: 1.8; color: {$tema === 5 ? '#e8ddc5' : '#333'};">
        <h3 style="font-size: 20px; margin-bottom: 15px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'};">Resumo</h3>
        {artigoDetalhe.resumo}
      </div>
    </div>
  </div>
{/if}

{#if portfolioDetalhe}
  <div style={getContainerStyle($layout, isMobile, true)}>
    <button style={getBackButtonStyle(isMobile)} on:click={closePortfolioDetalhe}>← Voltar</button>
    <div style={getDetailContainerStyle($tema, isMobile)}>
      {#if portfolioDetalhe.imagemUrl}
        <img src={portfolioDetalhe.imagemUrl} alt={portfolioDetalhe.titulo} style="width: 100%; max-height: 600px; object-fit: contain; background-color: rgba(0,0,0,0.03); border-radius: 12px; margin-bottom: 30px;" />
      {/if}
      <h1 style="font-size: 36px; margin-bottom: 20px; color: {$tema === 5 ? '#b8c7a8' : '#4a5d3c'};">{portfolioDetalhe.titulo}</h1>
      <div style="font-size: 15px; color: {$tema === 5 ? '#9aaa8a' : '#666'}; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e8ddc5;">
        <strong>Tipo:</strong> {portfolioDetalhe.tipo} | <strong>Ano:</strong> {portfolioDetalhe.ano}
      </div>
      <div style="font-size: 16px; line-height: 1.8; color: {$tema === 5 ? '#e8ddc5' : '#333'};">
        {portfolioDetalhe.descricao}
      </div>
    </div>
  </div>
{/if}

<style>
  @media (max-width: 768px) {
    h1 {
      font-size: 28px !important;
    }
    h2 {
      font-size: 24px !important;
    }
  }
</style>

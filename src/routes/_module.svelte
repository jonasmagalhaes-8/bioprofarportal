<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '@roxi/routify';
  import {
    tema, layout, secaoAtual, usuario, config, isAdmin, refreshTrigger,
    showLoginModal, showFormArtigo, showFormNoticia, showFormEquipe,
    showFormConfig, showFormSecao, showFormImagemCarrossel, showFormPortfolio,
    showGerenciarEquipe, showGerenciarPesquisadores, showGerenciarNoticias,
    showGerenciarArtigos, showGerenciarPortfolio, showGerenciarImagensCarrossel,
    showGerenciarSecoes,
    artigoEditando, noticiaEditando, membroEditando, portfolioEditando,
    imagemCarrosselEditando, secaoEditando, tipoFormConfig, origemFormEquipe
  } from '../stores/appStore';
  import { controllerGetConfiguracao } from '../controllers/ConfiguracaoController';
  import { controllerLoginUsuario, controllerLogoutUsuario, controllerGetUsuarioLogado } from '../controllers/UsuarioController';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  import LoginModal from '../components/LoginModal.svelte';
  import FormArtigo from '../components/FormArtigo.svelte';
  import FormNoticia from '../components/FormNoticia.svelte';
  import FormEquipe from '../components/FormEquipe.svelte';
  import FormConfiguracao from '../components/FormConfiguracao.svelte';
  import FormSecaoCustom from '../components/FormSecaoCustom.svelte';
  import FormImagemCarrossel from '../components/FormImagemCarrossel.svelte';
  import FormPortfolio from '../components/FormPortfolio.svelte';
  import GerenciarEquipe from '../components/GerenciarEquipe.svelte';
  import GerenciarPesquisadores from '../components/GerenciarPesquisadores.svelte';
  import GerenciarNoticias from '../components/GerenciarNoticias.svelte';
  import GerenciarArtigos from '../components/GerenciarArtigos.svelte';
  import GerenciarPortfolio from '../components/GerenciarPortfolio.svelte';
  import GerenciarImagensCarrossel from '../components/GerenciarImagensCarrossel.svelte';
  import GerenciarSecoes from '../components/GerenciarSecoes.svelte';































  onMount(async () => {
    await loadConfig();
    checkLoggedUser();
  });

  async function loadConfig() {
    try {
      const resultado = await controllerGetConfiguracao();
      if (resultado && resultado.response) {
        config.set(resultado.response);
      }
    } catch (err) {
      console.error('Erro ao carregar configuracao:', err);
    }
  }

  function checkLoggedUser() {
    const user = controllerGetUsuarioLogado();
    if (user) {
      usuario.set(user);
      isAdmin.set(user.usuarioAdmin === true);
    }
  }

  function handleNavigate(e: any) {
    const secao = e.detail.secao;
    secaoAtual.set(secao);
    const routeMap = { inicio: '/inicio', sobre: '/sobre', artigos: '/artigos' };
    if (routeMap[secao]) {
      $goto(routeMap[secao]);
    }
  }

  function handleLoginClick() {
    showLoginModal.set(true);
  }

  function handleLogoutClick() {
    controllerLogoutUsuario();
    usuario.set(null);
    isAdmin.set(false);
  }

  function handleLoginClose() {
    showLoginModal.set(false);
  }

  function handleLoginSuccess(e: any) {
    const user = e.detail.usuario;
    if (user) {
      usuario.set(user);
      isAdmin.set(user.usuarioAdmin === true);
    }
    showLoginModal.set(false);
  }

  function triggerRefresh() {
    refreshTrigger.update(n => n + 1);
  }

  // Form close handlers
  function closeFormArtigo() { showFormArtigo.set(false); artigoEditando.set(null); }
  function closeFormNoticia() { showFormNoticia.set(false); noticiaEditando.set(null); }
  function closeFormEquipe() { showFormEquipe.set(false); membroEditando.set(null); origemFormEquipe.set(null); }
  function closeFormConfig() { showFormConfig.set(false); }
  function closeFormSecao() { showFormSecao.set(false); secaoEditando.set(null); }
  function closeFormImagemCarrossel() { showFormImagemCarrossel.set(false); imagemCarrosselEditando.set(null); }
  function closeFormPortfolio() { showFormPortfolio.set(false); portfolioEditando.set(null); }

  // Form success handlers
  function successFormArtigo() { closeFormArtigo(); triggerRefresh(); }
  function successFormNoticia() { closeFormNoticia(); triggerRefresh(); }
  function successFormEquipe() { closeFormEquipe(); triggerRefresh(); }
  function successFormConfig(e: any) {
    if (e && e.detail && e.detail.config) {
      config.set(e.detail.config);
    } else {
      loadConfig();
    }
    closeFormConfig();
  }
  function successFormSecao() { closeFormSecao(); triggerRefresh(); }
  function successFormImagemCarrossel() { closeFormImagemCarrossel(); triggerRefresh(); }
  function successFormPortfolio() { closeFormPortfolio(); triggerRefresh(); }

  // Gerenciar close handlers
  function closeGerenciarEquipe() { showGerenciarEquipe.set(false); }
  function closeGerenciarPesquisadores() { showGerenciarPesquisadores.set(false); }
  function closeGerenciarNoticias() { showGerenciarNoticias.set(false); }
  function closeGerenciarArtigos() { showGerenciarArtigos.set(false); }
  function closeGerenciarPortfolio() { showGerenciarPortfolio.set(false); }
  function closeGerenciarImagensCarrossel() { showGerenciarImagensCarrossel.set(false); }
  function closeGerenciarSecoes() { showGerenciarSecoes.set(false); }

  // Gerenciar edit/add handlers
  function handleEditComiteFromGerenciar(e: any) {
    const membro = e.detail.membro;
    membroEditando.set(membro);
    origemFormEquipe.set('comite');
    showFormEquipe.set(true);
  }

  function handleAddComiteFromGerenciar() {
    membroEditando.set({ comite: true, pesquisador: false });
    origemFormEquipe.set('comite');
    showFormEquipe.set(true);
  }

  function handleEditPesquisadorFromGerenciar(e: any) {
    const membro = e.detail.membro;
    membroEditando.set(membro);
    origemFormEquipe.set('pesquisador');
    showFormEquipe.set(true);
  }

  function handleAddPesquisadorFromGerenciar() {
    membroEditando.set({ comite: false, pesquisador: true });
    origemFormEquipe.set('pesquisador');
    showFormEquipe.set(true);
  }

  function handleEditNoticiaFromGerenciar(e: any) {
    const noticia = e.detail.noticia;
    noticiaEditando.set(noticia);
    showFormNoticia.set(true);
  }

  function handleAddNoticiaFromGerenciar() {
    noticiaEditando.set(null);
    showFormNoticia.set(true);
  }

  function handleEditArtigoFromGerenciar(e: any) {
    const artigo = e.detail.artigo;
    artigoEditando.set(artigo);
    showFormArtigo.set(true);
  }

  function handleAddArtigoFromGerenciar() {
    artigoEditando.set(null);
    showFormArtigo.set(true);
  }

  function handleEditPortfolioFromGerenciar(e: any) {
    const item = e.detail.item || e.detail.portfolio;
    portfolioEditando.set(item);
    showFormPortfolio.set(true);
  }

  function handleAddPortfolioFromGerenciar() {
    portfolioEditando.set(null);
    showFormPortfolio.set(true);
  }

  function handleEditImagemFromGerenciar(e: any) {
    const imagem = e.detail.imagem;
    imagemCarrosselEditando.set(imagem);
    showFormImagemCarrossel.set(true);
  }

  function handleAddImagemFromGerenciar() {
    imagemCarrosselEditando.set(null);
    showFormImagemCarrossel.set(true);
  }

  function handleEditSecaoFromGerenciar(e: any) {
    const secao = e.detail.secao;
    secaoEditando.set(secao);
    showFormSecao.set(true);
  }

  function handleAddSecaoFromGerenciar() {
    secaoEditando.set(null);
    showFormSecao.set(true);
  }
</script>

<div class="app-wrapper">
  <Header
    tema={$tema}
    usuario={$usuario}
    secaoAtual={$secaoAtual}
    on:navigate={handleNavigate}
    on:loginClick={handleLoginClick}
    on:logoutClick={handleLogoutClick}
  />

  <main class="main-content">
    <slot />
  </main>

  <Footer
    tema={$tema}
    layout={$layout}
    config={$config}
    isAdmin={$isAdmin}
    on:editConfig={() => {
      tipoFormConfig.set('rodape');
      showFormConfig.set(true);
    }}
  />
</div>

{#if $showLoginModal}
  <LoginModal
    on:close={handleLoginClose}
    on:loginSuccess={handleLoginSuccess}
  />
{/if}

{#if $showFormArtigo}
  <FormArtigo
    artigo={$artigoEditando}
    on:close={closeFormArtigo}
    on:success={successFormArtigo}
  />
{/if}

{#if $showFormNoticia}
  <FormNoticia
    noticia={$noticiaEditando}
    on:close={closeFormNoticia}
    on:success={successFormNoticia}
  />
{/if}

{#if $showFormEquipe}
  <FormEquipe
    membro={$membroEditando}
    on:close={closeFormEquipe}
    on:success={successFormEquipe}
  />
{/if}

{#if $showFormConfig}
  <FormConfiguracao
    config={$config}
    tipo={$tipoFormConfig}
    on:close={closeFormConfig}
    on:success={successFormConfig}
  />
{/if}

{#if $showFormSecao}
  <FormSecaoCustom
    secao={$secaoEditando}
    on:close={closeFormSecao}
    on:success={successFormSecao}
  />
{/if}

{#if $showFormImagemCarrossel}
  <FormImagemCarrossel
    imagem={$imagemCarrosselEditando}
    on:close={closeFormImagemCarrossel}
    on:success={successFormImagemCarrossel}
  />
{/if}

{#if $showFormPortfolio}
  <FormPortfolio
    item={$portfolioEditando}
    on:close={closeFormPortfolio}
    on:success={successFormPortfolio}
  />
{/if}

{#if $showGerenciarEquipe}
  <GerenciarEquipe
    on:close={closeGerenciarEquipe}
    on:edit={handleEditComiteFromGerenciar}
    on:add={handleAddComiteFromGerenciar}
  />
{/if}

{#if $showGerenciarPesquisadores}
  <GerenciarPesquisadores
    on:close={closeGerenciarPesquisadores}
    on:edit={handleEditPesquisadorFromGerenciar}
    on:add={handleAddPesquisadorFromGerenciar}
  />
{/if}

{#if $showGerenciarNoticias}
  <GerenciarNoticias
    on:close={closeGerenciarNoticias}
    on:edit={handleEditNoticiaFromGerenciar}
    on:add={handleAddNoticiaFromGerenciar}
  />
{/if}

{#if $showGerenciarArtigos}
  <GerenciarArtigos
    on:close={closeGerenciarArtigos}
    on:edit={handleEditArtigoFromGerenciar}
    on:add={handleAddArtigoFromGerenciar}
  />
{/if}

{#if $showGerenciarPortfolio}
  <GerenciarPortfolio
    on:close={closeGerenciarPortfolio}
    on:edit={handleEditPortfolioFromGerenciar}
    on:add={handleAddPortfolioFromGerenciar}
  />
{/if}

{#if $showGerenciarImagensCarrossel}
  <GerenciarImagensCarrossel
    on:close={closeGerenciarImagensCarrossel}
    on:edit={handleEditImagemFromGerenciar}
    on:add={handleAddImagemFromGerenciar}
  />
{/if}

{#if $showGerenciarSecoes}
  <GerenciarSecoes
    on:close={closeGerenciarSecoes}
    on:edit={handleEditSecaoFromGerenciar}
    on:add={handleAddSecaoFromGerenciar}
  />
{/if}

<style>
  .app-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
  }
</style>

<script lang="ts">
  import { onMount } from "svelte";
  import {
    tema,
    layout,
    config,
    isAdmin,
    refreshTrigger,
    showFormConfig,
    showFormSecao,
    showGerenciarSecoes,
    secaoEditando,
    tipoFormConfig,
  } from "../../stores/appStore";
  import { controllerGetConfiguracao } from "../../controllers/ConfiguracaoController";
  import { controllerListarSecoes } from "../../controllers/SecaoCustomController";

  let secoes: any[] = [];

  const temas = {
    1: {
      bg: "#f5f5f0",
      cardBg: "#ffffff",
      text: "#333333",
      heading: "#2c3e2c",
      accent: "#4a5d3c",
      accentLight: "#8cb369",
      border: "#e0e0e0",
      sectionBg: "#ffffff",
    },
    2: {
      bg: "#fef5e7",
      cardBg: "#ffffff",
      text: "#5a4a3a",
      heading: "#4a3728",
      accent: "#c97b3a",
      accentLight: "#e8a85c",
      border: "#e8d5c0",
      sectionBg: "#ffffff",
    },
    3: {
      bg: "#1a2615",
      cardBg: "#2d3a24",
      text: "#c8d6c0",
      heading: "#e0ead8",
      accent: "#8cb369",
      accentLight: "#6b8f5b",
      border: "#3d4f31",
      sectionBg: "#222e1c",
    },
    4: {
      bg: "#f8f9fa",
      cardBg: "#ffffff",
      text: "#2c3e50",
      heading: "#1a252f",
      accent: "#4a5d3c",
      accentLight: "#7a8a6a",
      border: "#dee2e6",
      sectionBg: "#ffffff",
    },
    5: {
      bg: "#0f1a0a",
      cardBg: "#1f2b1a",
      text: "#a8b8a0",
      heading: "#d4e0cc",
      accent: "#6b8f5b",
      accentLight: "#8cb369",
      border: "#2d3a24",
      sectionBg: "#162010",
    },
  };

  $: temaAtual = temas[$tema] || temas[1];

  onMount(async () => {
    await loadAllData();
  });

  $: if ($refreshTrigger) {
    loadAllData();
  }

  async function loadAllData() {
    await Promise.all([loadConfig(), loadSecoes()]);
  }

  async function loadConfig() {
    try {
      const resultado = await controllerGetConfiguracao();
      if (resultado && resultado.response) {
        config.set(resultado.response);
      }
    } catch (err) {
      console.error("Erro ao carregar config:", err);
    }
  }

  async function loadSecoes() {
    try {
      const resultado = await controllerListarSecoes();
      secoes = resultado.response || resultado || [];
    } catch (err) {
      console.error("Erro ao carregar secoes:", err);
    }
  }

  function openEditConfig(tipo: string) {
    tipoFormConfig.set(tipo);
    showFormConfig.set(true);
  }

  function openAddSecao() {
    secaoEditando.set(null);
    showFormSecao.set(true);
  }

  function openEditSecao(secao: any) {
    secaoEditando.set(secao);
    showFormSecao.set(true);
  }

  function parseListItems(conteudo: string) {
    if (!conteudo) return [];
    return conteudo.split("\n").filter((line) => line.trim().length > 0);
  }
</script>

<div
  class="page-sobre"
  style="background: {temaAtual.bg}; color: {temaAtual.text};"
>
  <!-- HERO BANNER -->
  <section class="sobre-hero" style="background: {temaAtual.accent};">
    <div class="sobre-hero-inner">
      <h1 class="sobre-hero-titulo" style="color: #ffffff;">
        {$config.sobreTitulo || "Sobre o Projeto"}
      </h1>
      {#if $isAdmin}
        <button
          class="btn-admin-hero"
          style="background: rgba(255,255,255,0.2); color: #ffffff; border: 1px solid rgba(255,255,255,0.4);"
          on:click={() => openEditConfig("sobre")}
        >
          Editar Seção Sobre
        </button>
      {/if}
    </div>
  </section>

  <div class="sobre-content">
    <!-- CONTEUDO PRINCIPAL -->
    {#if $config.sobreConteudo}
      <section
        class="sobre-section"
        style="background: {temaAtual.sectionBg}; border-color: {temaAtual.border};"
      >
        <div class="section-inner">
          <h2 class="section-title" style="color: {temaAtual.heading};">
            Sobre
          </h2>
          <p class="section-text">{$config.sobreConteudo}</p>
        </div>
      </section>
    {/if}

    <!-- MISSAO E VISAO -->
    <div class="missao-visao-grid">
      {#if $config.sobreMissao}
        <section
          class="mv-card"
          style="background: {temaAtual.cardBg}; border-color: {temaAtual.border};"
        >
          <h3 class="mv-titulo" style="color: {temaAtual.accent};">Missão</h3>
          <p class="mv-text">{$config.sobreMissao}</p>
        </section>
      {/if}
      {#if $config.sobreVisao}
        <section
          class="mv-card"
          style="background: {temaAtual.cardBg}; border-color: {temaAtual.border};"
        >
          <h3 class="mv-titulo" style="color: {temaAtual.accent};">Visão</h3>
          <p class="mv-text">{$config.sobreVisao}</p>
        </section>
      {/if}
    </div>

    <!-- CUSTOM SECTIONS -->
    {#if secoes.length > 0}
      <div class="custom-sections">
        {#each secoes as secao}
          <section
            class="custom-section"
            style="background: {temaAtual.sectionBg}; border-color: {temaAtual.border};"
          >
            <div class="section-inner">
              <div class="section-header">
                <h2 class="section-title" style="color: {temaAtual.heading};">
                  {secao.titulo}
                </h2>
                {#if $isAdmin}
                  <button
                    class="btn-edit-sm"
                    style="color: {temaAtual.accentLight};"
                    on:click={() => openEditSecao(secao)}>Editar</button
                  >
                {/if}
              </div>

              {#if secao.tipo === "lista"}
                <ul class="secao-lista">
                  {#each parseListItems(secao.conteudo) as item}
                    <li
                      class="secao-lista-item"
                      style="background-color: {temaAtual.border}; border-left-color: {temaAtual.accent}; color: {temaAtual.text};"
                    >
                      {item}
                    </li>
                  {/each}
                </ul>
              {:else}
                <p class="section-text">{secao.conteudo}</p>
              {/if}
            </div>
          </section>
        {/each}
      </div>
    {/if}

    <!-- ADMIN ACTIONS -->
    {#if $isAdmin}
      <div class="admin-bar" style="border-color: {temaAtual.border};">
        <button
          class="btn-admin"
          style="background: {temaAtual.accent}; color: #ffffff;"
          on:click={openAddSecao}
        >
          + Nova Seção
        </button>
        <button
          class="btn-admin"
          style="background: none; color: {temaAtual.accent}; border: 1px solid {temaAtual.accent};"
          on:click={() => showGerenciarSecoes.set(true)}
        >
          Gerenciar Seções
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .page-sobre {
    min-height: 100vh;
  }

  .sobre-hero {
    padding: 60px 0;
  }

  .sobre-hero-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
  }

  .sobre-hero-titulo {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 800;
  }

  .btn-admin-hero {
    margin-top: 16px;
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-admin-hero:hover {
    opacity: 0.8;
  }

  .sobre-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px 60px;
  }

  .sobre-section,
  .custom-section {
    margin-top: 30px;
    border: 1px solid;
    border-radius: 12px;
    padding: 32px;
    margin-bottom: 24px;
  }

  .section-inner {
    max-width: 100%;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 12px;
  }

  .section-title {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0;
  }

  .section-text {
    font-size: 1rem;
    line-height: 1.75;
    margin: 0;
  }

  .btn-edit-sm {
    background: none;
    border: none;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    padding: 4px 10px;
    transition: opacity 0.2s;
  }

  .btn-edit-sm:hover {
    opacity: 0.7;
  }

  /* MISSAO VISAO GRID */
  .missao-visao-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 24px;
  }

  .mv-card {
    border: 1px solid;
    border-radius: 12px;
    padding: 28px;
  }

  .mv-titulo {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0 0 12px;
  }

  .mv-text {
    font-size: 0.95rem;
    line-height: 1.7;
    margin: 0;
  }

  /* LISTA */
  .secao-lista {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .secao-lista-item {
    padding: 16px 20px;
    margin-bottom: 12px;
    font-size: 1rem;
    line-height: 1.6;
    border-radius: 4px;
    border-left: 6px solid;
  }

  /* ADMIN BAR */
  .admin-bar {
    display: flex;
    gap: 12px;
    justify-content: center;
    padding: 24px 0;
    border-top: 1px solid;
    margin-top: 20px;
  }

  .btn-admin {
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-admin:hover {
    opacity: 0.85;
  }

  @media (max-width: 768px) {
    .sobre-hero-titulo {
      font-size: 1.8rem;
    }

    .missao-visao-grid {
      grid-template-columns: 1fr;
    }

    .section-title {
      font-size: 1.4rem;
    }

    .sobre-section,
    .custom-section {
      padding: 24px 18px;
    }
  }
</style>

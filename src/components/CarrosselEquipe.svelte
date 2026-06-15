<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { MembroEquipeModel } from '../models/MembroEquipeModel';

  export let membros: MembroEquipeModel[] = [];
  export let tema: number = 1;
  export let isDestaque: boolean = false;

  let paginaAtual: number = 0;
  let itensPorPagina: number = 3;
  let containerWidth: number = 0;
  let containerEl: HTMLDivElement | undefined;

  const temas = {
    1: { cardBg: '#ffffff', text: '#333333', accent: '#4a5d3c', border: '#e0e0e0' },
    2: { cardBg: '#ffffff', text: '#4a3728', accent: '#c97b3a', border: '#e8d5c0' },
    3: { cardBg: 'linear-gradient(145deg, #2d3a24, #1f2b1a)', text: '#d4e0cc', accent: '#8cb369', border: '#3d4f31' },
    4: { cardBg: '#ffffff', text: '#2c3e50', accent: '#4a5d3c', border: '#e0e0e0' },
    5: { cardBg: '#2d3a24', text: '#c8d6c0', accent: '#6b8f5b', border: '#3d4f31' }
  };

  $: temaAtual = temas[tema] || temas[1];
  $: isGradientCard = tema === 3;
  $: totalPaginas = Math.ceil(membros.length / itensPorPagina);
  $: membrosPagina = membros.slice(
    paginaAtual * itensPorPagina,
    paginaAtual * itensPorPagina + itensPorPagina
  );

  function proximo() {
    if (totalPaginas <= 1) return;
    paginaAtual = (paginaAtual + 1) % totalPaginas;
  }

  function anterior() {
    if (totalPaginas <= 1) return;
    paginaAtual = (paginaAtual - 1 + totalPaginas) % totalPaginas;
  }

  function irParaPagina(p: number) {
    paginaAtual = p;
  }

  function calcularItensPorPagina() {
    if (!containerEl) return;
    containerWidth = containerEl.offsetWidth;
    if (containerWidth < 600) {
      itensPorPagina = 1;
    } else if (containerWidth < 900) {
      itensPorPagina = 2;
    } else {
      itensPorPagina = 3;
    }
  }

  function onResize() {
    calcularItensPorPagina();
  }

  onMount(() => {
    calcularItensPorPagina();
    window.addEventListener('resize', onResize);
  });

  onDestroy(() => {
    window.removeEventListener('resize', onResize);
  });

  function getCardBg(membro: MembroEquipeModel, i: number) {
    const bg = temaAtual.cardBg;
    return isGradientCard ? bg : bg;
  }
</script>

<div class="carrossel-equipe" bind:this={containerEl}>
  {#if membros.length === 0}
    <div class="empty">
      <p>Nenhum membro da equipe para exibir.</p>
    </div>
  {:else}
    <div class="equipe-grid">
      {#each membrosPagina as membro, i}
        <div
          class="membro-card"
          class:destaque={isDestaque && membro.pesquisador}
          style="background: {getCardBg(membro, i)}; color: {temaAtual.text}; border-color: {temaAtual.border};"
        >
          <div class="membro-foto-wrapper">
            {#if membro.fotoUrl}
              <img src={membro.fotoUrl} alt={membro.nome || 'Membro'} class="membro-foto" />
            {:else}
              <div class="membro-foto-placeholder" style="background: {temaAtual.accent};">
                {membro.nome ? membro.nome.charAt(0).toUpperCase() : '?'}
              </div>
            {/if}
          </div>

          <div class="membro-info">
            <h4 class="membro-nome" style="color: {temaAtual.accent};">
              {membro.nome || 'Sem nome'}
            </h4>
            {#if membro.cargo}
              <p class="membro-cargo">{membro.cargo}</p>
            {/if}
            {#if membro.instituicao}
              <p class="membro-instituicao">{membro.instituicao}</p>
            {/if}
            {#if membro.descricao}
              <p class="membro-descricao">{membro.descricao}</p>
            {/if}
            {#if membro.lattes}
              <a
                href={membro.lattes}
                target="_blank"
                rel="noopener"
                class="lattes-link"
                style="color: {temaAtual.accent};"
              >
                Currículo Lattes
              </a>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    {#if totalPaginas > 1}
      <button class="btn-nav btn-prev" on:click={anterior}>
        &#10094;
      </button>

      <button class="btn-nav btn-next" on:click={proximo}>
        &#10095;
      </button>

      <div class="dots">
        {#each Array(totalPaginas) as _, p}
          <button
            class="dot"
            class:active={p === paginaAtual}
            style="background-color: {p === paginaAtual ? '#4a5d3c' : '#e8ddc5'};"
            on:click={() => irParaPagina(p)}
          ></button>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .carrossel-equipe {
    position: relative;
    width: 100%;
    margin-bottom: 60px;
    overflow: hidden;
  }

  .equipe-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
    padding: 0 20px;
    align-items: start;
  }

  .membro-card {
    border: 1px solid;
    border-radius: 8px;
    padding: 25px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s;
  }

  .membro-card.destaque {
    border-width: 2px;
  }

  .membro-foto-wrapper {
    margin: 0 auto 15px;
    width: 120px;
    height: 120px;
  }

  .membro-foto {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #7a8a6a;
  }

  .membro-foto-placeholder {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 2rem;
    font-weight: 700;
    border: 4px solid #7a8a6a;
  }

  .membro-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .membro-nome {
    margin: 0 0 8px;
    font-size: 18px;
    font-weight: bold;
  }

  .membro-cargo {
    margin: 0 0 8px;
    font-size: 14.5px;
    font-weight: 400;
  }

  .membro-instituicao {
    margin: 0 0 10px;
    font-size: 13px;
  }

  .membro-descricao {
    margin: 0 0 10px;
    font-size: 14.5px;
    line-height: 1.6;
  }

  .lattes-link {
    font-size: 12px;
    color: #7a8a6a;
    text-decoration: underline;
  }

  .btn-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: #7a8a6a;
    color: #ffffff;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 18px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .btn-prev {
    left: 10px;
  }

  .btn-next {
    right: 10px;
  }

  .dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    padding: 0;
  }

  .empty {
    text-align: center;
    padding: 40px 20px;
    color: #7a8a6a;
  }

  @media (max-width: 900px) {
    .equipe-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .equipe-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let imagens: any[] = [];
  export let altura: string = '400px';
  export let autoPlay: boolean = true;
  export let intervalo: number = 5000;

  let indiceAtual: number = 0;
  let timerId: ReturnType<typeof setInterval> | null = null;
  let isTransitioning: boolean = false;

  $: totalImagens = imagens.length;
  $: imagemAtual = imagens[indiceAtual] || null;

  function proximo() {
    if (totalImagens === 0) return;
    isTransitioning = true;
    indiceAtual = (indiceAtual + 1) % totalImagens;
    resetTimer();
  }

  function anterior() {
    if (totalImagens === 0) return;
    isTransitioning = true;
    indiceAtual = (indiceAtual - 1 + totalImagens) % totalImagens;
    resetTimer();
  }

  function irPara(i: number) {
    if (i === indiceAtual) return;
    isTransitioning = true;
    indiceAtual = i;
    resetTimer();
  }

  function iniciarTimer() {
    if (!autoPlay || totalImagens <= 1) return;
    timerId = setInterval(proximo, intervalo);
  }

  function pararTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function resetTimer() {
    pararTimer();
    iniciarTimer();
  }

  function handleTransitionEnd() {
    isTransitioning = false;
  }

  onMount(() => {
    iniciarTimer();
  });

  onDestroy(() => {
    pararTimer();
  });
</script>

<div class="carrossel" style="height: {altura};">
  {#if totalImagens > 0}
    <div class="slides-container">
      {#each imagens as img, i}
        <div
          class="slide"
          class:active={i === indiceAtual}
          on:transitionend={handleTransitionEnd}
        >
          <img src={img.url} alt={img.titulo || 'Imagem'} class="slide-img" />
        </div>
      {/each}
    </div>

    {#if totalImagens > 1}
      <button class="btn-nav btn-prev" on:click={anterior} aria-label="Anterior">&#10094;</button>
      <button class="btn-nav btn-next" on:click={proximo} aria-label="Próximo">&#10095;</button>

      <div class="dots">
        {#each imagens as _, i}
          <button
            class="dot"
            class:active={i === indiceAtual}
            on:click={() => irPara(i)}
            aria-label="Ir para imagem {i + 1}"
          ></button>
        {/each}
      </div>
    {/if}
  {:else}
    <div class="placeholder">
      <p>Nenhuma imagem disponível</p>
    </div>
  {/if}
</div>

{#if totalImagens > 0 && imagens[indiceAtual] && (imagens[indiceAtual].titulo || imagens[indiceAtual].legenda)}
  <div class="caption-externo">
    {#if imagens[indiceAtual].titulo}
      <h3 class="caption-titulo-externo">{imagens[indiceAtual].titulo}</h3>
    {/if}
    {#if imagens[indiceAtual].legenda}
      <p class="caption-legenda-externo">{imagens[indiceAtual].legenda}</p>
    {/if}
  </div>
{/if}

<style>
  .carrossel {
    position: relative;
    width: 100%;
    overflow: hidden;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  .caption-externo {
    text-align: center;
    margin-bottom: 40px;
    color: #4a5d3c;
  }

  .caption-titulo-externo {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: bold;
  }

  .caption-legenda-externo {
    margin: 0;
    font-size: 16px;
    color: #666;
  }

  .slides-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
    z-index: 0;
  }

  .slide.active {
    opacity: 1;
    z-index: 1;
  }

  .slide-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: #4a5d3c;
    transition: opacity 0.5s ease-in-out;
  }

  .overlay-gradient {
    display: none; /* Combined with caption in TSX */
  }

  .caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
    padding: 40px 30px 20px;
    color: #ffffff;
    z-index: 2;
  }

  .caption-titulo {
    margin: 0;
    margin-bottom: 8px;
    font-size: 32px;
    font-weight: bold;
  }

  .caption-legenda {
    margin: 0;
    font-size: 14.5px;
    line-height: 1.5;
  }

  .btn-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background-color: rgba(122, 138, 106, 0.9);
    color: #ffffff;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
    padding: 0;
  }

  .btn-nav:hover {
    background-color: rgba(122, 138, 106, 1);
  }

  .btn-prev {
    left: 20px;
  }

  .btn-next {
    right: 20px;
  }

  .dots {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 10;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.4);
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    padding: 0;
  }

  .dot.active {
    background-color: #ffffff;
  }

  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #888;
    font-size: 1rem;
  }
</style>

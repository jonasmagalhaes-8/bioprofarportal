<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let items: any[] = [];

  let indiceAtual: number = 0;
  let trackEl: HTMLDivElement | undefined;
  let autoPlayId: ReturnType<typeof setInterval> | null = null;
  let autoPlayInterval: number = 5000;

  $: totalItems = items.length;
  $: translateX = -(indiceAtual * 100);

  function proximo() {
    if (totalItems === 0) return;
    indiceAtual = (indiceAtual + 1) % totalItems;
  }

  function anterior() {
    if (totalItems === 0) return;
    indiceAtual = (indiceAtual - 1 + totalItems) % totalItems;
  }

  function irPara(i: number) {
    indiceAtual = i;
  }

  function iniciarAutoPlay() {
    if (totalItems <= 1) return;
    autoPlayId = setInterval(proximo, autoPlayInterval);
  }

  function pararAutoPlay() {
    if (autoPlayId) {
      clearInterval(autoPlayId);
      autoPlayId = null;
    }
  }

  function onMouseEnter() {
    pararAutoPlay();
  }

  function onMouseLeave() {
    iniciarAutoPlay();
  }

  onMount(() => {
    iniciarAutoPlay();
  });

  onDestroy(() => {
    pararAutoPlay();
  });
</script>

<div class="carrossel-items" on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>
  {#if totalItems === 0}
    <div class="empty">
      <p>Nenhum item para exibir.</p>
    </div>
  {:else}
    <div class="viewport">
      <div
        class="track"
        bind:this={trackEl}
        style="transform: translateX({translateX}%);"
      >
        {#each items as item, i}
          <div class="slide">
            <slot {item} {i}>
              <!-- Default fallback content -->
              <div class="default-item">
                Item {i + 1}
              </div>
            </slot>
          </div>
        {/each}
      </div>
    </div>

    {#if totalItems > 1}
      <button class="btn-nav btn-prev" on:click={anterior} aria-label="Anterior">&#10094;</button>
      <button class="btn-nav btn-next" on:click={proximo} aria-label="Próximo">&#10095;</button>

      <div class="dots">
        {#each items as _, i}
          <button
            class="dot"
            class:active={i === indiceAtual}
            on:click={() => irPara(i)}
            aria-label="Ir para item {i + 1}"
          ></button>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .carrossel-items {
    position: relative;
    width: 100%;
    margin-bottom: 60px;
  }

  .viewport {
    width: 100%;
    overflow: hidden;
  }

  .track {
    display: flex;
    transition: transform 0.3s ease-in-out;
  }

  .slide {
    min-width: 100%;
    box-sizing: border-box;
    padding: 0 10px;
  }

  .default-item {
    padding: 40px;
    background: #f0f0f0;
    border-radius: 8px;
    text-align: center;
    color: #888;
  }

  .btn-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background-color: rgba(74, 93, 60, 0.8);
    color: #ffffff;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }

  .btn-prev {
    left: 5px;
  }

  .btn-next {
    right: 5px;
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
    background-color: #e8ddc5;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: background-color 0.3s;
  }

  .dot.active {
    background-color: #4a5d3c;
  }

  .empty {
    text-align: center;
    padding: 40px 20px;
    color: #888;
  }
</style>

<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { LogIn, LogOut, User } from 'lucide-svelte';

  export let tema: number = 1;
  export let usuario: any = null;
  export let secaoAtual: string = 'inicio';

  const dispatch = createEventDispatcher();

  let menuAberto: boolean = false;
  let scrolled: boolean = false;

  const navItems = [
    { key: 'inicio', label: 'Início' },
    { key: 'sobre', label: 'Sobre o Projeto' }
  ];

  function handleNav(secao: string) {
    dispatch('navigate', { secao });
    menuAberto = false;
  }

  function handleLogin() {
    dispatch('loginClick');
    menuAberto = false;
  }

  function handleLogout() {
    dispatch('logoutClick');
    menuAberto = false;
  }

  function toggleMenu() {
    menuAberto = !menuAberto;
  }

  function onScroll() {
    scrolled = window.scrollY > 10;
  }

  onMount(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  });

  // Tema mapping functions
  function getHeaderStyle(t: number) {
    let style = "padding: 8px 40px; display: flex; flex-direction: row; align-items: center; justify-content: center; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.1); gap: 15px;";
    if (t === 1) return style + " background-color: #4a5d3c;";
    if (t === 2) return style + " background-color: #fef5e7; border-bottom: 3px solid #d4a574;";
    if (t === 3) return style + " background: linear-gradient(135deg, #4a5d3c 0%, #7a8a6a 100%);";
    if (t === 4) return style + " background-color: #ffffff; border-bottom: 4px solid #34495e;";
    return style + " background-color: #1f2b1a;";
  }

  function getNavItemStyle(t: number, isActive: boolean) {
    let style = `cursor: pointer; font-size: 14.5px; font-weight: ${isActive ? 'bold' : 'normal'}; text-decoration: none; transition: all 0.3s; padding: 8px 12px; border-radius: 4px; white-space: nowrap;`;
    if (t === 1) return style + ` color: ${isActive ? '#ffffff' : '#e8ddc5'}; background-color: ${isActive ? '#7a8a6a' : 'transparent'};`;
    if (t === 2) return style + ` color: ${isActive ? '#ffffff' : '#4a5d3c'}; background-color: ${isActive ? '#d4a574' : 'transparent'};`;
    if (t === 3) return style + ` color: #ffffff; background-color: ${isActive ? 'rgba(255,255,255,0.2)' : 'transparent'};`;
    if (t === 4) return style + ` color: ${isActive ? '#ffffff' : '#2c3e50'}; background-color: ${isActive ? '#34495e' : 'transparent'}; border: ${isActive ? 'none' : '2px solid #34495e'};`;
    return style + ` color: ${isActive ? '#e8ddc5' : '#b8c7a8'}; background-color: ${isActive ? '#4a5d3c' : 'transparent'};`;
  }

  function getIconButtonStyle(t: number) {
    let style = "padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; white-space: nowrap; transition: all 0.3s; background-color: transparent;";
    if (t === 1) return style + " color: #e8ddc5; border: 1px solid #e8ddc5;";
    if (t === 2) return style + " color: #4a5d3c; border: 1px solid #4a5d3c;";
    if (t === 3) return style + " color: #ffffff; border: 1px solid #ffffff;";
    if (t === 4) return style + " color: #34495e; border: 1px solid #34495e;";
    return style + " color: #b8c7a8; border: 1px solid #b8c7a8;";
  }

</script>

<header class="header" class:scrolled style={getHeaderStyle(tema)}>
  <a href="/">
    <img
      src="/f36a4f0b600a0203c7ae5628277c078ff555fe29.png"
      alt="BioProFar"
      class="logo-img"
    />
  </a>

  <nav class="nav-desktop">
    {#each navItems as item}
      <span
        class="nav-link"
        style={getNavItemStyle(tema, secaoAtual === item.key)}
        on:click={() => handleNav(item.key)}
      >
        {item.label}
      </span>
    {/each}

    {#if usuario}
      <div style="display: flex; align-items: center; gap: 10px;">
        <button
          class="btn-auth"
          style={getIconButtonStyle(tema)}
          on:click={handleLogout}
          title={`Sair (${usuario.nomeUsuario})`}
        >
          <LogOut size={18} />
          <span class="auth-text">Sair</span>
        </button>
      </div>
    {:else}
      <button
        class="btn-auth"
        style={getIconButtonStyle(tema)}
        on:click={handleLogin}
        title="Acesso Restrito"
      >
        <LogIn size={18} />
        <span class="auth-text">Acesso Restrito</span>
      </button>
    {/if}
  </nav>

  <button class="menu-toggle" on:click={toggleMenu} aria-label="Menu" style="color: {tema === 2 || tema === 4 ? '#4a5d3c' : '#ffffff'};">
    <span class="hamburger" class:open={menuAberto}>
      <span></span>
      <span></span>
      <span></span>
    </span>
  </button>
</header>

{#if menuAberto}
  <nav class="nav-mobile" style="background: {tema === 1 ? '#4a5d3c' : tema === 2 ? '#fef5e7' : tema === 3 ? '#2d3a24' : tema === 4 ? '#ffffff' : '#1f2b1a'};">
    {#each navItems as item}
      <span
        class="nav-link-mobile"
        style={getNavItemStyle(tema, secaoAtual === item.key)}
        on:click={() => handleNav(item.key)}
      >
        {item.label}
      </span>
    {/each}

    {#if usuario}
      <button
        class="nav-link-mobile btn-auth-mobile"
        style={getIconButtonStyle(tema)}
        on:click={handleLogout}
      >
        <LogOut size={18} />
        Sair
      </button>
    {:else}
      <button
        class="nav-link-mobile btn-auth-mobile"
        style={getIconButtonStyle(tema)}
        on:click={handleLogin}
      >
        <LogIn size={18} />
        Acesso Restrito
      </button>
    {/if}
  </nav>
{/if}

<style>
  .logo-img {
    height: 140px;
    max-width: 100%;
    margin-top: -10px;
    cursor: pointer;
  }

  .nav-desktop {
    display: flex;
    flex-direction: row;
    gap: 30px;
    align-items: center;
    justify-content: center;
  }

  .menu-toggle {
    display: none;
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
    padding: 10px;
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 24px;
  }

  .hamburger span {
    display: block;
    height: 2px;
    background: currentColor;
    border-radius: 2px;
    transition: transform 0.3s, opacity 0.3s;
  }

  .hamburger.open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .hamburger.open span:nth-child(2) {
    opacity: 0;
  }

  .hamburger.open span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }

  .nav-mobile {
    display: none;
    flex-direction: column;
    padding: 12px 20px 16px;
    border-top: 1px solid rgba(128, 128, 128, 0.2);
  }

  .nav-link-mobile {
    text-align: left;
    margin-bottom: 8px;
  }

  .btn-auth-mobile {
    justify-content: center;
  }

  @media (max-width: 768px) {
    .header {
      padding: 10px 20px !important;
      flex-direction: column !important;
      gap: 15px !important;
    }
    .logo-img {
      height: 100px !important;
      margin-top: 0 !important;
    }
    .nav-desktop {
      gap: 15px;
      flex-wrap: wrap;
    }
    .auth-text {
      display: none;
    }
    .menu-toggle {
      display: none;
    }
    .nav-mobile {
      display: none !important;
    }
  }
</style>

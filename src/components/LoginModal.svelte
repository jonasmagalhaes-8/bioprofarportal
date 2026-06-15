<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { controllerLoginUsuario } from '../controllers/UsuarioController';

  const dispatch = createEventDispatcher();

  let email: string = '';
  let senha: string = '';
  let loading: boolean = false;
  let erro: string = '';
  let modalEl: HTMLDivElement | undefined = undefined;

  function handleClose() {
    dispatch('close');
  }

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === modalEl) {
      handleClose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  async function handleSubmit() {
    if (!email.trim() || !senha.trim()) {
      erro = 'Preencha todos os campos.';
      return;
    }

    loading = true;
    erro = '';

    try {
      const usuarioLogin = {
        emailUsuario: email.trim(),
        senhaUsuario: senha,
        nomeUsuario: '', // Campos obrigatórios na interface, mas ignorados no login backend
        usuarioAdmin: false
      };
      const resultado = await controllerLoginUsuario(usuarioLogin);

      if (resultado && resultado.sucesso !== false) {
        dispatch('loginSuccess', { usuario: resultado.response || resultado });
        handleClose();
      } else {
        erro = resultado.mensagem || 'Email ou senha inválidos.';
      }
    } catch (err) {
      erro = err.message || 'Erro ao fazer login. Tente novamente.';
    } finally {
      loading = false;
    }
  }

  function onDocumentKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }

  onMount(() => {
    document.addEventListener('keydown', onDocumentKeydown);
    return () => {
      document.removeEventListener('keydown', onDocumentKeydown);
    };
  });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="overlay" bind:this={modalEl} on:click={handleOverlayClick}>
  <div class="modal" on:click|stopPropagation>
    <button class="close-btn" on:click={handleClose} aria-label="Fechar">&times;</button>

    <h2 class="modal-title">Login</h2>

    {#if erro}
      <div class="error-msg">{erro}</div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
      <div class="field">
        <label for="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          bind:value={email}
          placeholder="seu@email.com"
          disabled={loading}
          autocomplete="email"
        />
      </div>

      <div class="field">
        <label for="login-senha">Senha</label>
        <input
          id="login-senha"
          type="password"
          bind:value={senha}
          placeholder="Sua senha"
          disabled={loading}
          autocomplete="current-password"
        />
      </div>

      <button type="submit" class="btn-submit" disabled={loading}>
        {#if loading}
          <span class="spinner"></span> Entrando...
        {:else}
          Entrar
        {/if}
      </button>
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
    z-index: 1000;
  }

  .modal {
    background-color: #ffffff;
    padding: 40px;
    border-radius: 8px;
    max-width: 400px;
    width: 98%;
    height: 95vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  .close-btn {
    /* If close btn exists, we give it transparent or match the top right for svelte */
    position: absolute;
    top: 12px;
    right: 16px;
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    color: #4a5d3c;
    line-height: 1;
    transition: color 0.2s;
    padding: 4px;
  }

  .modal-title {
    margin: 0 0 20px 0;
    color: #4a5d3c;
    font-size: 24px;
    font-weight: bold;
  }

  .error-msg {
    color: #d32f2f;
    font-size: 14px;
    margin-top: 10px;
    margin-bottom: 15px; /* Svelte specific addition to space out */
  }

  .field {
    /* Svelte specific wrapper */
  }

  .field label {
    display: none; /* React doesn't have labels, just placeholders */
  }

  .field input {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 2px solid #e8ddc5;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .field input:focus {
    outline: none;
  }

  .field input:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }

  .btn-submit {
    /* Mapped to buttonStyle */
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    background-color: #4a5d3c;
    color: #ffffff;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 20px; /* spacing since no button container in svelte */
  }

  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
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

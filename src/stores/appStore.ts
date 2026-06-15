import { writable } from 'svelte/store';
import type { UsuarioModel } from '../models/UsuarioModel';
import type { ConfiguracaoSiteModel } from '../models/ConfiguracaoSiteModel';
import type { ArtigoModel } from '../models/ArtigoModel';
import type { NoticiaModel } from '../models/NoticiaModel';
import type { MembroEquipeModel } from '../models/MembroEquipeModel';
import type { PortfolioModel } from '../models/PortfolioModel';
import type { ImagemCarrosselModel } from '../models/ImagemCarrosselModel';
import type { SecaoCustomModel } from '../models/SecaoCustomModel';

export const tema = writable<number>(1);
export const layout = writable<number>(1);
export const secaoAtual = writable<string>('inicio');
export const usuario = writable<UsuarioModel | null>(null);
export const config = writable<ConfiguracaoSiteModel>({} as ConfiguracaoSiteModel);
export const isAdmin = writable<boolean>(false);
export const refreshTrigger = writable<number>(0);

// Modal state stores
export const showLoginModal = writable<boolean>(false);
export const showFormArtigo = writable<boolean>(false);
export const showFormNoticia = writable<boolean>(false);
export const showFormEquipe = writable<boolean>(false);
export const showFormConfig = writable<boolean>(false);
export const showFormSecao = writable<boolean>(false);
export const showFormImagemCarrossel = writable<boolean>(false);
export const showFormPortfolio = writable<boolean>(false);
export const showGerenciarEquipe = writable<boolean>(false);
export const showGerenciarPesquisadores = writable<boolean>(false);
export const showGerenciarNoticias = writable<boolean>(false);
export const showGerenciarArtigos = writable<boolean>(false);
export const showGerenciarPortfolio = writable<boolean>(false);
export const showGerenciarImagensCarrossel = writable<boolean>(false);
export const showGerenciarSecoes = writable<boolean>(false);

// Editing item stores
export const artigoEditando = writable<ArtigoModel | null>(null);
export const noticiaEditando = writable<NoticiaModel | null>(null);
export const membroEditando = writable<MembroEquipeModel | null>(null);
export const portfolioEditando = writable<PortfolioModel | null>(null);
export const imagemCarrosselEditando = writable<ImagemCarrosselModel | null>(null);
export const secaoEditando = writable<SecaoCustomModel | null>(null);
export const tipoFormConfig = writable<string>('hero');
export const origemFormEquipe = writable<string | null>(null);

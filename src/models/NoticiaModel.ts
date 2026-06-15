export interface NoticiaModel {
  id?: number;
  titulo: string;
  conteudo: string;
  data: string;
  autor: string;
  imagemUrl: string;
  imagens?: string[];
}

export function createNoticiaModel(overrides?: Partial<NoticiaModel>): NoticiaModel {
  return {
    id: undefined,
    titulo: '',
    conteudo: '',
    data: '',
    autor: '',
    imagemUrl: '',
    imagens: [],
    ...overrides,
  };
}

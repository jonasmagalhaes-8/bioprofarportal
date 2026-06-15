export interface ArtigoModel {
  id?: number;
  titulo: string;
  autores: string;
  resumo: string;
  conteudo: string;
  dataPublicacao: string;
  revista: string;
  doi: string;
}

export function createArtigoModel(overrides?: Partial<ArtigoModel>): ArtigoModel {
  return {
    id: undefined,
    titulo: '',
    autores: '',
    resumo: '',
    conteudo: '',
    dataPublicacao: '',
    revista: '',
    doi: '',
    ...overrides,
  };
}

export interface ImagemCarrosselModel {
  id?: number;
  url: string;
  titulo: string;
  legenda: string;
  ordem: number;
}

export function createImagemCarrosselModel(overrides?: Partial<ImagemCarrosselModel>): ImagemCarrosselModel {
  return {
    id: undefined,
    url: '',
    titulo: '',
    legenda: '',
    ordem: 0,
    ...overrides,
  };
}

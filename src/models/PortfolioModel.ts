export interface PortfolioModel {
  id?: number;
  titulo: string;
  tipo: string;
  ano: string;
  descricao: string;
  imagemUrl: string;
}

export function createPortfolioModel(overrides?: Partial<PortfolioModel>): PortfolioModel {
  return {
    titulo: '',
    tipo: '',
    ano: '',
    descricao: '',
    imagemUrl: '',
    ...overrides,
  };
}

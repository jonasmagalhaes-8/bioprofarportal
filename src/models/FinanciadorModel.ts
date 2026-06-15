export interface FinanciadorModel {
  id?: number;
  nome: string;
  logoUrl: string;
  ordem: number;
  temDestaque: boolean;
  mostrarLogo: boolean;
}

export function createFinanciadorModel(overrides?: Partial<FinanciadorModel>): FinanciadorModel {
  return {
    id: undefined,
    nome: '',
    logoUrl: '',
    ordem: 0,
    temDestaque: false,
    mostrarLogo: true,
    ...overrides,
  };
}

export interface ApoioModel {
  id?: number;
  nome: string;
  logoUrl: string;
  ordem: number;
  temDestaque: boolean;
  mostrarLogo: boolean;
}

export function createApoioModel(overrides?: Partial<ApoioModel>): ApoioModel {
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

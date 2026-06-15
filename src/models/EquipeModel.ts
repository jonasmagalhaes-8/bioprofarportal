export interface EquipeModel {
  id?: number;
  nome: string;
  descricao: string;
  ordem: number;
}

export function createEquipeModel(overrides?: Partial<EquipeModel>): EquipeModel {
  return {
    id: undefined,
    nome: '',
    descricao: '',
    ordem: 0,
    ...overrides,
  };
}

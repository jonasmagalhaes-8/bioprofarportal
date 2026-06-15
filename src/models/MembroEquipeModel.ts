export interface MembroEquipeModel {
  id?: number;
  nome: string;
  cargo: string;
  instituicao: string;
  email: string;
  lattes: string;
  fotoUrl: string;
  descricao: string;
  comite: boolean;
  pesquisador: boolean;
  ordemComite?: number;
}

export function createMembroEquipeModel(overrides?: Partial<MembroEquipeModel>): MembroEquipeModel {
  return {
    id: undefined,
    nome: '',
    cargo: '',
    instituicao: '',
    email: '',
    lattes: '',
    fotoUrl: '',
    descricao: '',
    comite: false,
    pesquisador: false,
    ordemComite: undefined,
    ...overrides,
  };
}

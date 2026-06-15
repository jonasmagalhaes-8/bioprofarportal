export interface SecaoCustomModel {
  id?: number;
  titulo: string;
  conteudo: string;
  tipo: 'texto' | 'lista';
  ordem: number;
}

export function createSecaoCustomModel(overrides?: Partial<SecaoCustomModel>): SecaoCustomModel {
  return {
    id: undefined,
    titulo: '',
    conteudo: '',
    tipo: 'texto',
    ordem: 0,
    ...overrides,
  };
}

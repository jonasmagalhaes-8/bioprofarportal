export interface UsuarioModel {
  idUsuario?: number;
  nomeUsuario: string;
  emailUsuario: string;
  senhaUsuario: string;
  usuarioAdmin: boolean;
}

export function createUsuarioModel(overrides?: Partial<UsuarioModel>): UsuarioModel {
  return {
    idUsuario: undefined,
    nomeUsuario: '',
    emailUsuario: '',
    senhaUsuario: '',
    usuarioAdmin: false,
    ...overrides,
  };
}

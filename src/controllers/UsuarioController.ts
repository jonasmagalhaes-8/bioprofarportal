import { apiBackend } from '../services/api';
import type { UsuarioModel } from '../models/UsuarioModel';
import type { ResponseModel } from '../models/ResponseModel';

export async function controllerLoginUsuario(user: UsuarioModel): Promise<ResponseModel> {
  try {
    const json = await apiBackend.post('/usuario/login', user);
    const data = json.data;
    data.sucesso = true;

    if (data.response) {
      localStorage.setItem('token', 'mock-token-admin');
      localStorage.setItem('usuario', JSON.stringify(data.response));
    }

    return data;
  } catch (err) {
    // MOCK quando cair no catch
    if (user.emailUsuario === 'admin@bioprfar.ba.gov.br' && user.senhaUsuario === 'admin123') {
      const mockUser: UsuarioModel = {
        idUsuario: 1,
        nomeUsuario: 'Administrador',
        emailUsuario: user.emailUsuario,
        usuarioAdmin: true,
      };

      const response: ResponseModel = {
        response: mockUser,
        mensagem: 'Login realizado com sucesso!',
        sucesso: true,
      };

      localStorage.setItem('token', 'mock-token-admin');
      localStorage.setItem('usuario', JSON.stringify(mockUser));

      return response;
    }

    const response: ResponseModel = {
      response: null,
      mensagem: 'Email ou senha incorretos',
      sucesso: false,
    };
    return response;
  }
}

export function controllerLogoutUsuario(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}

export function controllerGetUsuarioLogado(): UsuarioModel | null {
  const usuarioStr = localStorage.getItem('usuario');
  if (usuarioStr) {
    const data = JSON.parse(usuarioStr);
    const usuario: UsuarioModel = {
      idUsuario: data.idUsuario,
      nomeUsuario: data.nomeUsuario,
      emailUsuario: data.emailUsuario,
      usuarioAdmin: data.usuarioAdmin,
    };
    return usuario;
  }
  return null;
}

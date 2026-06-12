import { apiBackend } from '../services/api';
import { UsuarioModel } from '../models/UsuarioModel';
import { ResponseModel } from '../models/ResponseModel';

export async function controllerLoginUsuario(
  user: UsuarioModel
): Promise<ResponseModel<UsuarioModel>> {
  try {
    const json = await apiBackend.post<ResponseModel<UsuarioModel>>('/usuario/login', user);
    const data = json.data;
    data.sucesso = true;
    
    if (data.response) {
      localStorage.setItem('token', 'mock-token-admin');
      localStorage.setItem('usuario', JSON.stringify(data.response));
    }
    
    return data;
  } catch (err: any) {
    // MOCK quando cair no catch
    if (user.emailUsuario === 'admin@bioprfar.ba.gov.br' && user.senhaUsuario === 'admin123') {
      const mockUser = new UsuarioModel();
      mockUser.idUsuario = 1;
      mockUser.nomeUsuario = 'Administrador';
      mockUser.emailUsuario = user.emailUsuario;
      mockUser.usuarioAdmin = true;
      
      const response = new ResponseModel<UsuarioModel>();
      response.response = mockUser;
      response.mensagem = 'Login realizado com sucesso!';
      response.sucesso = true;
      
      localStorage.setItem('token', 'mock-token-admin');
      localStorage.setItem('usuario', JSON.stringify(mockUser));
      
      return response;
    }
    
    const response = new ResponseModel<UsuarioModel>();
    response.response = null;
    response.mensagem = 'Email ou senha incorretos';
    response.sucesso = false;
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
    const usuario = new UsuarioModel();
    usuario.idUsuario = data.idUsuario;
    usuario.nomeUsuario = data.nomeUsuario;
    usuario.emailUsuario = data.emailUsuario;
    usuario.usuarioAdmin = data.usuarioAdmin;
    return usuario;
  }
  return null;
}

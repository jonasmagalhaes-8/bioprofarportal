import { apiBackend } from '../services/api';
import { FinanciadorModel } from '../models/FinanciadorModel';
import { ResponseModel } from '../models/ResponseModel';

let mockFinanciadores: FinanciadorModel[] = [];

function initMockFinanciadores() {
  if (mockFinanciadores.length === 0) {
    const fapesb = new FinanciadorModel();
    fapesb.id = 1;
    fapesb.nome = 'FAPESB';
    fapesb.logoUrl = 'https://cidacs.bahia.fiocruz.br/wp-content/uploads/2017/11/fapesb.png';
    fapesb.ordem = 1;
    fapesb.temDestaque = true;
    fapesb.mostrarLogo = true;
    mockFinanciadores = [fapesb];
  }
  return mockFinanciadores;
}

export async function controllerListarFinanciadores(): Promise<ResponseModel<FinanciadorModel[]>> {
  try {
    const json = await apiBackend.get('/financiador/listar');
    return json.data;
  } catch (err: any) {
    const response = new ResponseModel<FinanciadorModel[]>();
    response.response = initMockFinanciadores();
    response.mensagem = 'Financiadores carregados com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerCriarFinanciador(item: FinanciadorModel): Promise<ResponseModel<FinanciadorModel>> {
  try {
    const json = await apiBackend.post('/financiador/salvar', item);
    return json.data;
  } catch (err: any) {
    item.id = Date.now();
    mockFinanciadores.push(item);
    
    const response = new ResponseModel<FinanciadorModel>();
    response.response = item;
    response.mensagem = 'Financiador criado com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerAtualizarFinanciador(item: FinanciadorModel): Promise<ResponseModel<FinanciadorModel>> {
  try {
    let json;
    if (item.id) {
      json = await apiBackend.put('/financiador/atualizar', item);
    } else {
      json = await apiBackend.post('/financiador/salvar', item);
    }
    return json.data;
  } catch (err: any) {
    const index = mockFinanciadores.findIndex(i => i.id === item.id);
    if (index !== -1) mockFinanciadores[index] = item;
    
    const response = new ResponseModel<FinanciadorModel>();
    response.response = item;
    response.mensagem = 'Financiador atualizado com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerDeletarFinanciador(id: number): Promise<ResponseModel<null>> {
  try {
    const json = await apiBackend.delete(`/financiador/deletar/${id}`);
    return json.data;
  } catch (err: any) {
    mockFinanciadores = mockFinanciadores.filter(i => i.id !== id);
    
    const response = new ResponseModel<null>();
    response.response = null;
    response.mensagem = 'Financiador removido com sucesso';
    response.sucesso = true;
    return response;
  }
}

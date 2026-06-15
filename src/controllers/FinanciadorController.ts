import { apiBackend } from '../services/api';
import type { FinanciadorModel } from '../models/FinanciadorModel';
import type { ResponseModel } from '../models/ResponseModel';

let mockFinanciadores: FinanciadorModel[] = [];

function initMockFinanciadores(): FinanciadorModel[] {
  if (mockFinanciadores.length === 0) {
    const fapesb: FinanciadorModel = {
      id: 1,
      nome: 'FAPESB',
      logoUrl: 'https://cidacs.bahia.fiocruz.br/wp-content/uploads/2017/11/fapesb.png',
      ordem: 1,
      temDestaque: true,
      mostrarLogo: true,
    };
    mockFinanciadores = [fapesb];
  }
  return mockFinanciadores;
}

export async function controllerListarFinanciadores(): Promise<ResponseModel> {
  try {
    const json = await apiBackend.get('/financiador/listar');
    return json.data;
  } catch (err) {
    const response: ResponseModel = {
      response: initMockFinanciadores(),
      mensagem: 'Financiadores carregados com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerCriarFinanciador(item: FinanciadorModel): Promise<ResponseModel> {
  try {
    const json = await apiBackend.post('/financiador/salvar', item);
    return json.data;
  } catch (err) {
    item.id = Date.now();
    mockFinanciadores.push(item);

    const response: ResponseModel = {
      response: item,
      mensagem: 'Financiador criado com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerAtualizarFinanciador(item: FinanciadorModel): Promise<ResponseModel> {
  try {
    let json;
    if (item.id) {
      json = await apiBackend.put('/financiador/atualizar', item);
    } else {
      json = await apiBackend.post('/financiador/salvar', item);
    }
    return json.data;
  } catch (err) {
    const index = mockFinanciadores.findIndex(function (i) { return i.id === item.id; });
    if (index !== -1) mockFinanciadores[index] = item;

    const response: ResponseModel = {
      response: item,
      mensagem: 'Financiador atualizado com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerDeletarFinanciador(id: number): Promise<ResponseModel> {
  try {
    const json = await apiBackend.delete('/financiador/deletar/' + id);
    return json.data;
  } catch (err) {
    mockFinanciadores = mockFinanciadores.filter(function (i) { return i.id !== id; });

    const response: ResponseModel = {
      response: null,
      mensagem: 'Financiador removido com sucesso',
      sucesso: true,
    };
    return response;
  }
}

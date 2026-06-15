import { apiBackend } from '../services/api';
import type { ApoioModel } from '../models/ApoioModel';
import type { ResponseModel } from '../models/ResponseModel';

let mockApoios: ApoioModel[] = [];

function initMockApoios(): ApoioModel[] {
  if (mockApoios.length === 0) {
    const cnpq: ApoioModel = {
      id: 1,
      nome: 'CNPq',
      logoUrl: 'https://www.gov.br/cnpq/pt-br/canais_atendimento/identidade-visual/CNPq_v2017_rgb.png',
      ordem: 1,
      temDestaque: false,
      mostrarLogo: true,
    };

    const capes: ApoioModel = {
      id: 2,
      nome: 'CAPES',
      logoUrl: 'https://www.gov.br/capes/pt-br/centrais-de-conteudo/logo-original-fundo-claro-png.png',
      ordem: 2,
      temDestaque: false,
      mostrarLogo: true,
    };

    mockApoios = [cnpq, capes];
  }
  return mockApoios;
}

export async function controllerListarApoios(): Promise<ResponseModel> {
  try {
    const json = await apiBackend.get('/apoio/listar');
    return json.data;
  } catch (err) {
    const response: ResponseModel = {
      response: initMockApoios(),
      mensagem: 'Apoios carregados com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerCriarApoio(item: ApoioModel): Promise<ResponseModel> {
  try {
    const json = await apiBackend.post('/apoio/salvar', item);
    return json.data;
  } catch (err) {
    item.id = Date.now();
    mockApoios.push(item);

    const response: ResponseModel = {
      response: item,
      mensagem: 'Apoio criado com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerAtualizarApoio(item: ApoioModel): Promise<ResponseModel> {
  try {
    let json;
    if (item.id) {
      json = await apiBackend.put('/apoio/atualizar', item);
    } else {
      json = await apiBackend.post('/apoio/salvar', item);
    }
    return json.data;
  } catch (err) {
    const index = mockApoios.findIndex(function (i) { return i.id === item.id; });
    if (index !== -1) mockApoios[index] = item;

    const response: ResponseModel = {
      response: item,
      mensagem: 'Apoio atualizado com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerDeletarApoio(id: number): Promise<ResponseModel> {
  try {
    const json = await apiBackend.delete('/apoio/deletar/' + id);
    return json.data;
  } catch (err) {
    mockApoios = mockApoios.filter(function (i) { return i.id !== id; });

    const response: ResponseModel = {
      response: null,
      mensagem: 'Apoio removido com sucesso',
      sucesso: true,
    };
    return response;
  }
}

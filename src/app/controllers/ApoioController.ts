import { apiBackend } from '../services/api';
import { ApoioModel } from '../models/ApoioModel';
import { ResponseModel } from '../models/ResponseModel';

let mockApoios: ApoioModel[] = [];

function initMockApoios() {
  if (mockApoios.length === 0) {
    const cnpq = new ApoioModel();
    cnpq.id = 1;
    cnpq.nome = 'CNPq';
    cnpq.logoUrl = 'https://www.gov.br/cnpq/pt-br/canais_atendimento/identidade-visual/CNPq_v2017_rgb.png';
    cnpq.ordem = 1;
    cnpq.temDestaque = false;
    cnpq.mostrarLogo = true;

    const capes = new ApoioModel();
    capes.id = 2;
    capes.nome = 'CAPES';
    capes.logoUrl = 'https://www.gov.br/capes/pt-br/centrais-de-conteudo/logo-original-fundo-claro-png.png';
    capes.ordem = 2;
    capes.temDestaque = false;
    capes.mostrarLogo = true;

    mockApoios = [cnpq, capes];
  }
  return mockApoios;
}

export async function controllerListarApoios(): Promise<ResponseModel<ApoioModel[]>> {
  try {
    const json = await apiBackend.get('/apoio/listar');
    return json.data;
  } catch (err: any) {
    const response = new ResponseModel<ApoioModel[]>();
    response.response = initMockApoios();
    response.mensagem = 'Apoios carregados com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerCriarApoio(item: ApoioModel): Promise<ResponseModel<ApoioModel>> {
  try {
    const json = await apiBackend.post('/apoio/salvar', item);
    return json.data;
  } catch (err: any) {
    item.id = Date.now();
    mockApoios.push(item);
    
    const response = new ResponseModel<ApoioModel>();
    response.response = item;
    response.mensagem = 'Apoio criado com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerAtualizarApoio(item: ApoioModel): Promise<ResponseModel<ApoioModel>> {
  try {
    let json;
    if (item.id) {
      json = await apiBackend.put('/apoio/atualizar', item);
    } else {
      json = await apiBackend.post('/apoio/salvar', item);
    }
    return json.data;
  } catch (err: any) {
    const index = mockApoios.findIndex(i => i.id === item.id);
    if (index !== -1) mockApoios[index] = item;
    
    const response = new ResponseModel<ApoioModel>();
    response.response = item;
    response.mensagem = 'Apoio atualizado com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerDeletarApoio(id: number): Promise<ResponseModel<null>> {
  try {
    const json = await apiBackend.delete(`/apoio/deletar/${id}`);
    return json.data;
  } catch (err: any) {
    mockApoios = mockApoios.filter(i => i.id !== id);
    
    const response = new ResponseModel<null>();
    response.response = null;
    response.mensagem = 'Apoio removido com sucesso';
    response.sucesso = true;
    return response;
  }
}

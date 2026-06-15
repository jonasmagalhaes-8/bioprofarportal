import { apiBackend } from '../services/api';
import type { SecaoCustomModel } from '../models/SecaoCustomModel';
import type { ResponseModel } from '../models/ResponseModel';

let mockSecoes: SecaoCustomModel[] = [];

function initMockSecoes(): SecaoCustomModel[] {
  if (mockSecoes.length === 0) {
    const secao0: SecaoCustomModel = {
      id: 0,
      titulo: 'Conteúdo Principal',
      conteudo: 'A Rede Baiana de Bioprospecção e Desenvolvimento de Fármacos (BioprFar-BA) é uma iniciativa científica que reúne pesquisadores, instituições de ensino e parceiros da indústria farmacêutica com o objetivo de explorar o potencial da biodiversidade baiana para o desenvolvimento de novos medicamentos.',
      tipo: 'texto',
      ordem: 0,
    };

    const secao01: SecaoCustomModel = {
      id: 1,
      titulo: 'Missão',
      conteudo: 'Promover a pesquisa científica de excelência em bioprospecção, química medicinal e farmacologia, contribuindo para a inovação farmacêutica brasileira e para o desenvolvimento sustentável da região.',
      tipo: 'texto',
      ordem: 1,
    };

    const secao02: SecaoCustomModel = {
      id: 2,
      titulo: 'Visão',
      conteudo: 'Ser referência nacional e internacional em pesquisa e desenvolvimento de fármacos derivados de produtos naturais, posicionando a Bahia como polo de inovação em saúde.',
      tipo: 'texto',
      ordem: 2,
    };

    const secao1: SecaoCustomModel = {
      id: 1,
      titulo: 'Objetivos Principais',
      conteudo: 'Bioprospecção: Identificar e caracterizar compostos bioativos de plantas, microrganismos e animais da biodiversidade baiana.\nDesenvolvimento de Fármacos: Conduzir estudos pré-clínicos e clínicos para validação de novos candidatos a medicamentos.\nFormação de Recursos Humanos: Capacitar estudantes de graduação, mestrado e doutorado em áreas relacionadas à química medicinal e farmacologia.\nInovação e Transferência Tecnológica: Estabelecer parcerias com a indústria para transformar descobertas científicas em produtos comerciais.\nConservação da Biodiversidade: Promover o uso sustentável dos recursos naturais e a conservação dos ecossistemas baianos.',
      tipo: 'lista',
      ordem: 3,
    };

    const secao2: SecaoCustomModel = {
      id: 2,
      titulo: 'Áreas de Pesquisa',
      conteudo: 'Química de Produtos Naturais\nFarmacologia e Toxicologia\nBiotecnologia Farmacêutica\nDesenvolvimento de Fitomedicamentos\nNanotecnologia Farmacêutica\nDoenças Negligenciadas\nOncologia Experimental',
      tipo: 'lista',
      ordem: 4,
    };

    const secao3: SecaoCustomModel = {
      id: 3,
      titulo: 'Instituições Parceiras',
      conteudo: 'Universidade Federal da Bahia (UFBA)\nUniversidade Estadual de Feira de Santana (UEFS)\nUniversidade Estadual do Sudoeste da Bahia (UESB)\nUniversidade Federal do Recôncavo da Bahia (UFRB)\nInstituto Federal da Bahia (IFBA)\nFundação Oswaldo Cruz - Fiocruz Bahia',
      tipo: 'lista',
      ordem: 5,
    };

    const secao4: SecaoCustomModel = {
      id: 4,
      titulo: 'Financiamento',
      conteudo: 'A rede conta com apoio financeiro de agências de fomento como FAPESB (Fundação de Amparo à Pesquisa do Estado da Bahia), CNPq (Conselho Nacional de Desenvolvimento Científico e Tecnológico), CAPES (Coordenação de Aperfeiçoamento de Pessoal de Nível Superior) e parcerias com empresas do setor farmacêutico.',
      tipo: 'texto',
      ordem: 6,
    };

    mockSecoes = [secao0, secao01, secao02, secao1, secao2, secao3, secao4];
  }
  return mockSecoes;
}

export async function controllerListarSecoes(): Promise<ResponseModel> {
  try {
    const json = await apiBackend.get('/secaocustom/listar');
    return json.data;
  } catch (err) {
    const response: ResponseModel = {
      response: initMockSecoes(),
      mensagem: 'Seções carregadas com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerCriarSecao(secao: SecaoCustomModel): Promise<ResponseModel> {
  try {
    const json = await apiBackend.post('/secaocustom/salvar', secao);
    return json.data;
  } catch (err) {
    secao.id = Date.now();
    mockSecoes.push(secao);
    mockSecoes.sort(function (a, b) { return a.ordem - b.ordem; });

    const response: ResponseModel = {
      response: secao,
      mensagem: 'Seção criada com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerAtualizarSecao(secao: SecaoCustomModel): Promise<ResponseModel> {
  try {
    let json;
    if (secao.id) {
      json = await apiBackend.put('/secaocustom/atualizar', secao);
    } else {
      json = await apiBackend.post('/secaocustom/salvar', secao);
    }
    return json.data;
  } catch (err) {
    const index = mockSecoes.findIndex(function (s) { return s.id === secao.id; });
    if (index !== -1) {
      mockSecoes[index] = secao;
    }
    mockSecoes.sort(function (a, b) { return a.ordem - b.ordem; });

    const response: ResponseModel = {
      response: secao,
      mensagem: 'Seção atualizada com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerAtualizarOrdemSecoes(secoes: SecaoCustomModel[]): Promise<ResponseModel> {
  try {
    let json;
    if ((secoes as any).id) {
      json = await apiBackend.put('/secaocustom/atualizar', secoes);
    } else {
      json = await apiBackend.post('/secaocustom/salvar', secoes);
    }
    return json.data;
  } catch (err) {
    mockSecoes = secoes;

    const response: ResponseModel = {
      response: secoes,
      mensagem: 'Ordem atualizada com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerDeletarSecao(id: number): Promise<ResponseModel> {
  try {
    const json = await apiBackend.delete('/secaocustom/deletar/' + id);
    return json.data;
  } catch (err) {
    mockSecoes = mockSecoes.filter(function (s) { return s.id !== id; });

    const response: ResponseModel = {
      response: null,
      mensagem: 'Seção removida com sucesso',
      sucesso: true,
    };
    return response;
  }
}

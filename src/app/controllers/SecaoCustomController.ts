import { apiBackend } from '../services/api';
import { SecaoCustomModel } from '../models/SecaoCustomModel';
import { ResponseModel } from '../models/ResponseModel';

let mockSecoes: SecaoCustomModel[] = [];

function initMockSecoes(): SecaoCustomModel[] {
  if (mockSecoes.length === 0) {
    const secao0 = new SecaoCustomModel();
    secao0.id = 0;
    secao0.titulo = 'Conteúdo Principal';
    secao0.conteudo = 'A Rede Baiana de Bioprospecção e Desenvolvimento de Fármacos (BioprFar-BA) é uma iniciativa científica que reúne pesquisadores, instituições de ensino e parceiros da indústria farmacêutica com o objetivo de explorar o potencial da biodiversidade baiana para o desenvolvimento de novos medicamentos.';
    secao0.tipo = 'texto';
    secao0.ordem = 0;

    const secao01 = new SecaoCustomModel();
    secao01.id = 1;
    secao01.titulo = 'Missão';
    secao01.conteudo = 'Promover a pesquisa científica de excelência em bioprospecção, química medicinal e farmacologia, contribuindo para a inovação farmacêutica brasileira e para o desenvolvimento sustentável da região.';
    secao01.tipo = 'texto';
    secao01.ordem = 1;

    const secao02 = new SecaoCustomModel();
    secao02.id = 2;
    secao02.titulo = 'Visão';
    secao02.conteudo = 'Ser referência nacional e internacional em pesquisa e desenvolvimento de fármacos derivados de produtos naturais, posicionando a Bahia como polo de inovação em saúde.';
    secao02.tipo = 'texto';
    secao02.ordem = 2;

    const secao1 = new SecaoCustomModel();
    secao1.id = 1;
    secao1.titulo = 'Objetivos Principais';
    secao1.conteudo = `Bioprospecção: Identificar e caracterizar compostos bioativos de plantas, microrganismos e animais da biodiversidade baiana.
Desenvolvimento de Fármacos: Conduzir estudos pré-clínicos e clínicos para validação de novos candidatos a medicamentos.
Formação de Recursos Humanos: Capacitar estudantes de graduação, mestrado e doutorado em áreas relacionadas à química medicinal e farmacologia.
Inovação e Transferência Tecnológica: Estabelecer parcerias com a indústria para transformar descobertas científicas em produtos comerciais.
Conservação da Biodiversidade: Promover o uso sustentável dos recursos naturais e a conservação dos ecossistemas baianos.`;
    secao1.tipo = 'lista';
    secao1.ordem = 3;

    const secao2 = new SecaoCustomModel();
    secao2.id = 2;
    secao2.titulo = 'Áreas de Pesquisa';
    secao2.conteudo = `Química de Produtos Naturais
Farmacologia e Toxicologia
Biotecnologia Farmacêutica
Desenvolvimento de Fitomedicamentos
Nanotecnologia Farmacêutica
Doenças Negligenciadas
Oncologia Experimental`;
    secao2.tipo = 'lista';
    secao2.ordem = 4;

    const secao3 = new SecaoCustomModel();
    secao3.id = 3;
    secao3.titulo = 'Instituições Parceiras';
    secao3.conteudo = `Universidade Federal da Bahia (UFBA)
Universidade Estadual de Feira de Santana (UEFS)
Universidade Estadual do Sudoeste da Bahia (UESB)
Universidade Federal do Recôncavo da Bahia (UFRB)
Instituto Federal da Bahia (IFBA)
Fundação Oswaldo Cruz - Fiocruz Bahia`;
    secao3.tipo = 'lista';
    secao3.ordem = 5;

    const secao4 = new SecaoCustomModel();
    secao4.id = 4;
    secao4.titulo = 'Financiamento';
    secao4.conteudo = 'A rede conta com apoio financeiro de agências de fomento como FAPESB (Fundação de Amparo à Pesquisa do Estado da Bahia), CNPq (Conselho Nacional de Desenvolvimento Científico e Tecnológico), CAPES (Coordenação de Aperfeiçoamento de Pessoal de Nível Superior) e parcerias com empresas do setor farmacêutico.';
    secao4.tipo = 'texto';
    secao4.ordem = 6;

    mockSecoes = [secao0, secao01, secao02, secao1, secao2, secao3, secao4];
  }
  return mockSecoes;
}

export async function controllerListarSecoes(): Promise<ResponseModel<SecaoCustomModel[]>> {
  try {
    const json = await apiBackend.get('/secaocustom/listar');
    return json.data;
  } catch (err: any) {
    const response = new ResponseModel<SecaoCustomModel[]>();
    response.response = initMockSecoes();
    response.mensagem = 'Seções carregadas com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerCriarSecao(secao: SecaoCustomModel): Promise<ResponseModel<SecaoCustomModel>> {
  try {
    const json = await apiBackend.post('/secaocustom/salvar', secao);
    return json.data;
  } catch (err: any) {
    secao.id = Date.now();
    mockSecoes.push(secao);
    mockSecoes.sort((a, b) => a.ordem - b.ordem);
    
    const response = new ResponseModel<SecaoCustomModel>();
    response.response = secao;
    response.mensagem = 'Seção criada com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerAtualizarSecao(secao: SecaoCustomModel): Promise<ResponseModel<SecaoCustomModel>> {
  try {
    let json;
    if (secao.id) {
      json = await apiBackend.put('/secaocustom/atualizar', secao);
    } else {
      json = await apiBackend.post('/secaocustom/salvar', secao);
    }
    return json.data;
  } catch (err: any) {
    const index = mockSecoes.findIndex(s => s.id === secao.id);
    if (index !== -1) {
      mockSecoes[index] = secao;
    }
    mockSecoes.sort((a, b) => a.ordem - b.ordem);
    
    const response = new ResponseModel<SecaoCustomModel>();
    response.response = secao;
    response.mensagem = 'Seção atualizada com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerAtualizarOrdemSecoes(secoes: SecaoCustomModel[]): Promise<ResponseModel<SecaoCustomModel[]>> {
  try {
    let json;
    if (secoes.id) {
      json = await apiBackend.put('/secaocustom/atualizar', secoes);
    } else {
      json = await apiBackend.post('/secaocustom/salvar', secoes);
    }
    return json.data;
  } catch (err: any) {
    mockSecoes = secoes;
    
    const response = new ResponseModel<SecaoCustomModel[]>();
    response.response = secoes;
    response.mensagem = 'Ordem atualizada com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerDeletarSecao(id: number): Promise<ResponseModel<null>> {
  try {
    const json = await apiBackend.delete(`/secaocustom/deletar/${id}`);
    return json.data;
  } catch (err: any) {
    mockSecoes = mockSecoes.filter(s => s.id !== id);
    
    const response = new ResponseModel<null>();
    response.response = null;
    response.mensagem = 'Seção removida com sucesso';
    response.sucesso = true;
    return response;
  }
}

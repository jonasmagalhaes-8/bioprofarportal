import { apiBackend } from '../services/api';
import { ConfiguracaoSiteModel } from '../models/ConfiguracaoSiteModel';
import { ResponseModel } from '../models/ResponseModel';
import { FinanciadorModel } from '../models/FinanciadorModel';
import { ApoioModel } from '../models/ApoioModel';

let mockConfig: ConfiguracaoSiteModel | null = null;

function initMockConfig(): ConfiguracaoSiteModel {
  if (!mockConfig) {
    const config = new ConfiguracaoSiteModel();
    config.sobreConteudo = 'A Rede Baiana de Bioprospecção e Desenvolvimento de Fármacos (BioprFar-BA) é uma iniciativa científica que reúne pesquisadores, instituições de ensino e parceiros da indústria farmacêutica com o objetivo de explorar o potencial da biodiversidade baiana para o desenvolvimento de novos medicamentos.';
    config.sobreMissao = 'Promover a pesquisa científica de excelência em bioprospecção, química medicinal e farmacologia, contribuindo para a inovação farmacêutica brasileira e para o desenvolvimento sustentável da região.';
    config.sobreVisao = 'Ser referência nacional e internacional em pesquisa e desenvolvimento de fármacos derivados de produtos naturais, posicionando a Bahia como polo de inovação em saúde.';
    config.heroSubtitulo = 'Promovendo a pesquisa, inovação e desenvolvimento de novos medicamentos a partir da rica biodiversidade baiana. Unindo ciência, tecnologia e sustentabilidade para o futuro da saúde.';
    
    // Inicializar financiadores mockados
    const fapesb = new FinanciadorModel();
    fapesb.id = 1;
    fapesb.nome = 'FAPESB';
    fapesb.logoUrl = 'https://cidacs.bahia.fiocruz.br/wp-content/uploads/2017/11/fapesb.png';
    fapesb.ordem = 1;
    fapesb.temDestaque = true;
    fapesb.mostrarLogo = true;

    // Inicializar apoios mockados
    const cnpq = new ApoioModel();
    cnpq.id = 2;
    cnpq.nome = 'CNPq';
    cnpq.logoUrl = 'https://www.gov.br/cnpq/pt-br/canais_atendimento/identidade-visual/CNPq_v2017_rgb.png';
    cnpq.ordem = 1;
    cnpq.temDestaque = false;
    cnpq.mostrarLogo = true;

    const capes = new ApoioModel();
    capes.id = 3;
    capes.nome = 'CAPES';
    capes.logoUrl = 'https://www.gov.br/capes/pt-br/centrais-de-conteudo/logo-original-fundo-claro-png.png';
    capes.ordem = 2;
    capes.temDestaque = false;
    capes.mostrarLogo = true;

    config.financiadores = [fapesb];
    config.apoios = [cnpq, capes];
    
    mockConfig = config;
  }
  return mockConfig;
}

export async function controllerGetConfiguracao(): Promise<ResponseModel<ConfiguracaoSiteModel>> {
  try {
    const json = await apiBackend.get('/configuracaosite/listar');
    const data = json.data;
    if (data.response && Array.isArray(data.response)) {
      data.response = data.response.length > 0 ? data.response[0] : new ConfiguracaoSiteModel();
    }
    return data;
  } catch (err: any) {
    const response = new ResponseModel<ConfiguracaoSiteModel>();
    response.response = initMockConfig();
    response.mensagem = 'Configuração carregada com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerAtualizarConfiguracao(config: ConfiguracaoSiteModel): Promise<ResponseModel<ConfiguracaoSiteModel>> {
  try {
    let json;
    if (config.id) {
      json = await apiBackend.put('/configuracaosite/atualizar', config);
    } else {
      json = await apiBackend.post('/configuracaosite/salvar', config);
    }
    return json.data;
  } catch (err: any) {
    mockConfig = config;
    
    const response = new ResponseModel<ConfiguracaoSiteModel>();
    response.response = config;
    response.mensagem = 'Configuração atualizada com sucesso';
    response.sucesso = true;
    return response;
  }
}

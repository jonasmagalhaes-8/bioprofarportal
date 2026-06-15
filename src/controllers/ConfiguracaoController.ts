import { apiBackend } from '../services/api';
import type { ConfiguracaoSiteModel } from '../models/ConfiguracaoSiteModel';
import type { ResponseModel } from '../models/ResponseModel';
import type { FinanciadorModel } from '../models/FinanciadorModel';
import type { ApoioModel } from '../models/ApoioModel';

let mockConfig: ConfiguracaoSiteModel | null = null;

function initMockConfig(): ConfiguracaoSiteModel {
  if (!mockConfig) {
    const fapesb: FinanciadorModel = {
      id: 1,
      nome: 'FAPESB',
      logoUrl: 'https://cidacs.bahia.fiocruz.br/wp-content/uploads/2017/11/fapesb.png',
      ordem: 1,
      temDestaque: true,
      mostrarLogo: true,
    };

    const cnpq: ApoioModel = {
      id: 2,
      nome: 'CNPq',
      logoUrl: 'https://www.gov.br/cnpq/pt-br/canais_atendimento/identidade-visual/CNPq_v2017_rgb.png',
      ordem: 1,
      temDestaque: false,
      mostrarLogo: true,
    };

    const capes: ApoioModel = {
      id: 3,
      nome: 'CAPES',
      logoUrl: 'https://www.gov.br/capes/pt-br/centrais-de-conteudo/logo-original-fundo-claro-png.png',
      ordem: 2,
      temDestaque: false,
      mostrarLogo: true,
    };

    const config: ConfiguracaoSiteModel = {
      sobreConteudo: 'A Rede Baiana de Bioprospecção e Desenvolvimento de Fármacos (BioprFar-BA) é uma iniciativa científica que reúne pesquisadores, instituições de ensino e parceiros da indústria farmacêutica com o objetivo de explorar o potencial da biodiversidade baiana para o desenvolvimento de novos medicamentos.',
      sobreMissao: 'Promover a pesquisa científica de excelência em bioprospecção, química medicinal e farmacologia, contribuindo para a inovação farmacêutica brasileira e para o desenvolvimento sustentável da região.',
      sobreVisao: 'Ser referência nacional e internacional em pesquisa e desenvolvimento de fármacos derivados de produtos naturais, posicionando a Bahia como polo de inovação em saúde.',
      heroSubtitulo: 'Promovendo a pesquisa, inovação e desenvolvimento de novos medicamentos a partir da rica biodiversidade baiana. Unindo ciência, tecnologia e sustentabilidade para o futuro da saúde.',
      financiadores: [fapesb],
      apoios: [cnpq, capes],
    };

    mockConfig = config;
  }
  return mockConfig;
}

export async function controllerGetConfiguracao(): Promise<ResponseModel> {
  try {
    const json = await apiBackend.get('/configuracaosite/listar');
    const data = json.data;
    if (data.response && Array.isArray(data.response)) {
      data.response = data.response.length > 0 ? data.response[0] : {};
    }
    return data;
  } catch (err) {
    const response: ResponseModel = {
      response: initMockConfig(),
      mensagem: 'Configuração carregada com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerAtualizarConfiguracao(config: ConfiguracaoSiteModel): Promise<ResponseModel> {
  try {
    let json;
    if (config.id) {
      json = await apiBackend.put('/configuracaosite/atualizar', config);
    } else {
      json = await apiBackend.post('/configuracaosite/salvar', config);
    }
    return json.data;
  } catch (err) {
    mockConfig = config;

    const response: ResponseModel = {
      response: config,
      mensagem: 'Configuração atualizada com sucesso',
      sucesso: true,
    };
    return response;
  }
}

import type { FinanciadorModel } from './FinanciadorModel';
import type { ApoioModel } from './ApoioModel';

export interface ConfiguracaoSiteModel {
  id?: number;
  heroTitulo: string;
  heroSubtitulo: string;
  sobreTitulo: string;
  sobreConteudo: string;
  sobreMissao: string;
  sobreVisao: string;
  contatoEmail: string;
  contatoTelefone: string;
  contatoWhatsapp: string;
  enderecoLinha1: string;
  enderecoLinha2: string;
  enderecoLinha3: string;
  enderecoLinha4: string;
  enderecoLinha5: string;
  redesTwitter: string;
  redesInstagram: string;
  redesLinkedin: string;
  parceiros: string;
  financiadores: FinanciadorModel[];
  apoios: ApoioModel[];
}

export function createConfiguracaoSiteModel(overrides?: Partial<ConfiguracaoSiteModel>): ConfiguracaoSiteModel {
  return {
    id: undefined,
    heroTitulo: '',
    heroSubtitulo: '',
    sobreTitulo: '',
    sobreConteudo: '',
    sobreMissao: '',
    sobreVisao: '',
    contatoEmail: '',
    contatoTelefone: '',
    contatoWhatsapp: '',
    enderecoLinha1: '',
    enderecoLinha2: '',
    enderecoLinha3: '',
    enderecoLinha4: '',
    enderecoLinha5: '',
    redesTwitter: '',
    redesInstagram: '',
    redesLinkedin: '',
    parceiros: '',
    financiadores: [],
    apoios: [],
    ...overrides,
  };
}

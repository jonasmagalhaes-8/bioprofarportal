import { FinanciadorModel } from './FinanciadorModel';
import { ApoioModel } from './ApoioModel';

export class ConfiguracaoSiteModel {
  id?: number;
  heroTitulo: string = '';
  heroSubtitulo: string = '';

  sobreTitulo: string = '';
  sobreConteudo: string = '';
  sobreMissao: string = '';
  sobreVisao: string = '';

  contatoEmail: string = '';
  contatoTelefone: string = '';
  contatoWhatsapp: string = '';

  enderecoLinha1: string = '';
  enderecoLinha2: string = '';
  enderecoLinha3: string = '';
  enderecoLinha4: string = '';
  enderecoLinha5: string = '';

  redesTwitter: string = '';
  redesInstagram: string = '';
  redesLinkedin: string = '';

  parceiros: string = '';
  financiadores: FinanciadorModel[] = [];
  apoios: ApoioModel[] = [];
}

import type { MembroEquipeModel } from '../models/MembroEquipeModel';
import { apiBackend } from '../services/api';

let mockMembros: MembroEquipeModel[] = [];

function initMockMembros(): MembroEquipeModel[] {
  if (mockMembros.length === 0) {
    const data: MembroEquipeModel[] = [
      {
        id: '1',
        nome: 'Darízy Flávia Silva Amorim de Vasconcelos',
        cargo: 'Coordenação Geral / Comitê Gestor',
        instituicao: 'Universidade Federal da Bahia (UFBA)',
        fotoUrl: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?w=400',
        descricao: 'Farmacêutica. Membro do comitê gestor, Gestão Técnico-Científica do projeto e Líder da pesquisa com PNs e Diabetes / Hipertensão.',
        lattesUrl: 'http://lattes.cnpq.br/7803405172044612',
        comite: true,
        ordemComite: 1
      },
      {
        id: '2',
        nome: 'Luciana Lyra Casais e Silva',
        cargo: 'Vice-Coordenação / Comitê Gestor',
        instituicao: 'Universidade Federal da Bahia (UFBA)',
        fotoUrl: 'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?w=400',
        descricao: 'Ciências Biológicas. Líder da pesquisa com Inflamação decorrente de envenenamento por animais peçonhentos.',
        lattesUrl: 'http://lattes.cnpq.br/3662018860660208',
        comite: true,
        ordemComite: 2
      },
      {
        id: '3',
        nome: 'Angélica Maria Lucchese',
        cargo: 'Gestão Científica / Comitê Gestor',
        instituicao: 'Universidade Estadual de Feira de Santana (UEFS)',
        fotoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
        descricao: 'Química industrial. Líder da pesquisa em Análise Fitoquímica.',
        lattesUrl: 'http://lattes.cnpq.br/5840452818024313',
        comite: true,
        ordemComite: 7
      },
      {
        id: '4',
        nome: 'Paulo José Lima Juíz',
        cargo: 'Gestão de Interações Interinstitucionais / Comitê Gestor',
        instituicao: 'Universidade Federal do Recôncavo Baiano (UFRB)',
        fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        descricao: 'Odontologia. Líder da pesquisa com PNs e atividade antimicrobiana.',
        lattesUrl: 'http://lattes.cnpq.br/2818533344854916',
        comite: true,
        ordemComite: 6
      },
      {
        id: '5',
        nome: 'Fabrício Luíz Tulini',
        cargo: 'Gestão de Compartilhamento Estrutural / Comitê Gestor',
        instituicao: 'Universidade Federal do Oeste Baiano (UFOB)',
        fotoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
        descricao: 'Farmácia-Bioquímica. Líder da pesquisa em Análise de Valor Nutricional.',
        lattesUrl: 'http://lattes.cnpq.br/1376824797910581',
        comite: true,
        ordemComite: 3
      },
      {
        id: '6',
        nome: 'Jannaína Velasques da Costa Pinto',
        cargo: 'Gestão de Ações Extensionistas / Comitê Gestor',
        instituicao: 'Universidade Federal do Sul da Bahia (UFSB)',
        fotoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
        descricao: 'Engenharia Agronômica. Pesquisadora colaboradora em Boas Práticas de Cultivo de Plantas Medicinas.',
        lattesUrl: 'http://lattes.cnpq.br/4066841095002234',
        comite: true,
        ordemComite: 4
      },
      {
        id: '7',
        nome: 'Ana Leonor Pardo Campos Godoy',
        cargo: 'Líder de Pesquisa',
        instituicao: 'Universidade Federal da Bahia (UFBA)',
        fotoUrl: 'https://images.unsplash.com/photo-1581475319737-4ae69b8926c7?w=400',
        descricao: 'Farmácia. Líder da pesquisa com ensaios para avaliação toxicológica dos PNs.',
        lattesUrl: 'http://lattes.cnpq.br/4869914850863025',
        comite: false
      },
      {
        id: '8',
        nome: 'Edilson Araújo Pires',
        cargo: 'Gestão do NIT / Comitê Gestor',
        instituicao: 'Universidade Federal do Recôncavo Baiano (UFRB)',
        fotoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
        descricao: 'Licenciatura em História. Colaborados do Núcleo de Inovação Tecnológica.',
        lattesUrl: 'http://lattes.cnpq.br/3127833504285218',
        comite: true,
        ordemComite: 5
      },
      {
        id: '9',
        nome: 'Cristiane Flora Villarreal',
        cargo: 'Líder de Pesquisa',
        instituicao: 'Universidade Federal da Bahia (UFBA)',
        fotoUrl: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?w=400',
        descricao: 'Medicina Veterinária. Líder da pesquisa com PNS na Inflamação decorrente da asma.',
        lattesUrl: 'http://lattes.cnpq.br/1772671211614750',
        comite: false
      },
      {
        id: '10',
        nome: 'Elisalva Teixeira Guimarães',
        cargo: 'Pesquisadora Colaboradora',
        instituicao: 'Universidade do Estado da Bahia (UNEB)',
        fotoUrl: 'https://images.unsplash.com/photo-1618053448492-2b629c2c912c?w=400',
        descricao: 'Ciências Biológicas. Pesquisadora colaboradora na pesquisa em PNs e Doenças Infecciosas.',
        lattesUrl: 'http://lattes.cnpq.br/7840482835489813',
        comite: false
      },
      {
        id: '11',
        nome: 'Emiliano de Oliveira Barreto',
        cargo: 'Líder de Pesquisa',
        instituicao: 'Universidade Federal de Alagoas (UFAL)',
        fotoUrl: 'https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?w=400',
        descricao: 'Ciências Biológicas. Líder da pesquisa em PNs e Fibrose.',
        lattesUrl: 'http://lattes.cnpq.br/2655854155812760',
        comite: false
      },
      {
        id: '12',
        nome: 'Francine Johansson Azeredo',
        cargo: 'Líder de Pesquisa',
        instituicao: 'Universidade Federal da Bahia (UFBA)',
        fotoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
        descricao: 'Farmácia. Líder da pesquisa em farmacocinética dos PNs.',
        lattesUrl: 'http://lattes.cnpq.br/7304067762920542',
        comite: false
      },
      {
        id: '13',
        nome: 'Henrique Rodrigues Marcelino',
        cargo: 'Líder de Pesquisa',
        instituicao: 'Universidade Federal da Bahia (UFBA)',
        fotoUrl: 'https://images.unsplash.com/photo-1527154341204-319eeba2d06e?w=400',
        descricao: 'Farmácia. Líder da pesquisa em desenvolvimento de fármacos nanoencapsulados.',
        lattesUrl: 'http://lattes.cnpq.br/7409770121537667',
        comite: false
      },
      {
        id: '14',
        nome: 'Hugo Sabá Pereira Cardoso',
        cargo: 'Pesquisador',
        instituicao: 'Universidade do Estado da Bahia (UNEB)',
        fotoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
        descricao: 'Tecnólogo em Processamento de Dados. Pesquisa em desenvolvimento de aplicativo para Android.',
        lattesUrl: 'http://lattes.cnpq.br/1966167015825708',
        comite: false
      },
      {
        id: '15',
        nome: 'Isac Almeida de Medeiros',
        cargo: 'Pesquisador Colaborador',
        instituicao: 'Universidade Federal da Paraíba (UFPB)',
        fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        descricao: 'Farmácia. Pesquisador colaborador em pesquisa com PNs e estresse Oxidativo associados à Hipertensão.',
        lattesUrl: 'http://lattes.cnpq.br/3412816427200150',
        comite: false
      },
      {
        id: '16',
        nome: 'Jackson Roberto Guedes da Silva Almeida',
        cargo: 'Pesquisador Colaborador',
        instituicao: 'Universidade Federal do Vale do São Francisco (UNIVASF)',
        fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        descricao: 'Farmácia. Pesquisador colaborador em pesquisa de Análise Fitoquímica.',
        lattesUrl: 'http://lattes.cnpq.br/6762742002660251',
        comite: false
      },
      {
        id: '17',
        nome: 'Josean Fechine Tavares',
        cargo: 'Pesquisador Colaborador',
        instituicao: 'Universidade Federal da Paraíba (UFPB)',
        fotoUrl: 'https://images.unsplash.com/photo-1527154341204-319eeba2d06e?w=400',
        descricao: 'Farmácia. Pesquisador colaborador na obtenção de extratos, frações semipurificadas e óleos essenciais.',
        lattesUrl: 'http://lattes.cnpq.br/6009412640611523',
        comite: false
      },
      {
        id: '18',
        nome: 'José Wilson do Nascimento Corrêa',
        cargo: 'Pesquisador Colaborador',
        instituicao: 'Universidade Federal do Amazonas (UFAM)',
        fotoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
        descricao: 'Farmácia. Pesquisador colaborador da pesquisa com modelo de doença renal e hipertensão.',
        lattesUrl: 'http://lattes.cnpq.br/9130747433263550',
        comite: false
      },
      {
        id: '19',
        nome: 'Jullyana de Souza Siqueira Quintans',
        cargo: 'Líder de Pesquisa',
        instituicao: 'Universidade Federal de Sergipe (UFS)',
        fotoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
        descricao: 'Farmácia. Líder da pesquisa com Ensaios clínicos com PNs e suas atividades sobre doenças articulares.',
        lattesUrl: 'http://lattes.cnpq.br/8972140763217377',
        comite: false
      },
      {
        id: '20',
        nome: 'Lucindo José Quintans Júnior',
        cargo: 'Pesquisador Colaborador',
        instituicao: 'Universidade Federal de Sergipe (UFS)',
        fotoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
        descricao: 'Farmácia. Pesquisador colaborador da pesquisa com Ensaios clínicos com PNs e suas atividades sobre doenças articulares.',
        lattesUrl: 'http://lattes.cnpq.br/4178844355922772',
        comite: false
      },
      {
        id: '21',
        nome: 'Marcelo Santos Castilho',
        cargo: 'Líder de Pesquisa',
        instituicao: 'Universidade Federal da Bahia (UFBA)',
        fotoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
        descricao: 'Farmácia. Líder da pesquisa em ensaios In Sílico.',
        lattesUrl: 'http://lattes.cnpq.br/3662018860660208',
        comite: false
      },
      {
        id: '22',
        nome: 'Márcio Luís Valença Araújo',
        cargo: 'Líder de Pesquisa',
        instituicao: 'Instituto Federal da Bahia (IFBA)',
        fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
        descricao: 'Tecnólogo em Processamento de Dados. Líder da pesquisa em desenvolvimento de aplicativo para Android.',
        lattesUrl: 'http://lattes.cnpq.br/0777733127275321',
        comite: false
      },
      {
        id: '23',
        nome: 'Max Denisson Maurício Viana',
        cargo: 'Pesquisador Colaborador',
        instituicao: 'Universidade Federal da Bahia (UFBA)',
        fotoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400',
        descricao: 'Farmácia. Pesquisador colaborador na pesquisa com Neuropatia diabética.',
        lattesUrl: 'http://lattes.cnpq.br/4565462073434241',
        comite: false
      },
      {
        id: '24',
        nome: 'Mayara de Queiroz Oliveira Ribeiro da Silva',
        cargo: 'Pesquisadora',
        instituicao: 'Secretaria de Saúde do Estado da Bahia (SESAB)',
        fotoUrl: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=400',
        descricao: 'Farmácia. Orientação técnica para estruturação das farmácias-verdes.',
        lattesUrl: 'http://lattes.cnpq.br/5107328580429170',
        comite: false
      },
      {
        id: '25',
        nome: 'Wagner Rodrigues de Assis Soares',
        cargo: 'Pesquisador Colaborador',
        instituicao: 'Universidade Estadual do Sudoeste da Bahia (UESB)',
        fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        descricao: 'Farmácia. Pesquisador colaborador da pesquisa em Ensaios In Sílico.',
        lattesUrl: 'http://lattes.cnpq.br/1548123755379008',
        comite: false
      }
    ];

    mockMembros = data.map(function (item) {
      if (item.pesquisador === undefined) {
        item.pesquisador = !item.comite;
      }
      return item;
    });
  }
  return mockMembros;
}

export class MembroEquipeController {
  async listar(): Promise<MembroEquipeModel[]> {
    try {
      const json = await apiBackend.get('/membroequipe/listar');
      return json.data.response;
    } catch (err) {
      return initMockMembros();
    }
  }

  async obterPorId(id: string): Promise<MembroEquipeModel | null> {
    try {
      const membros = await this.listar();
      return membros.find(function (m) { return m.id === id; }) || null;
    } catch (err) {
      const membros = initMockMembros();
      return membros.find(function (m) { return m.id === id; }) || null;
    }
  }

  async criar(membro: MembroEquipeModel): Promise<MembroEquipeModel> {
    try {
      const json = await apiBackend.post('/membroequipe/salvar', membro);
      return json.data.response;
    } catch (err) {
      const novoMembro: MembroEquipeModel = Object.assign({}, membro);
      novoMembro.id = String(mockMembros.length + 1);
      mockMembros.push(novoMembro);
      return novoMembro;
    }
  }

  async atualizar(id: string, membro: MembroEquipeModel): Promise<MembroEquipeModel | null> {
    try {
      let json;
      if (membro.id) {
        json = await apiBackend.put('/membroequipe/atualizar', membro);
      } else {
        json = await apiBackend.post('/membroequipe/salvar', membro);
      }
      return json.data.response;
    } catch (err) {
      const index = mockMembros.findIndex(function (m) { return m.id === id; });
      if (index !== -1) {
        Object.assign(mockMembros[index], membro);
        return mockMembros[index];
      }
      return null;
    }
  }

  async excluir(id: string): Promise<boolean> {
    try {
      await apiBackend.delete('/membroequipe/deletar/' + id);
      return true;
    } catch (err) {
      const index = mockMembros.findIndex(function (m) { return m.id === id; });
      if (index !== -1) {
        mockMembros.splice(index, 1);
        return true;
      }
      return false;
    }
  }
}

const controller = new MembroEquipeController();

export const controllerListarMembros = (): Promise<MembroEquipeModel[]> => controller.listar();
export const controllerObterMembroPorId = (id: string): Promise<MembroEquipeModel | null> => controller.obterPorId(id);
export const controllerCriarMembro = (membro: MembroEquipeModel): Promise<MembroEquipeModel> => controller.criar(membro);
export const controllerAtualizarMembro = (id: string, membro: MembroEquipeModel): Promise<MembroEquipeModel | null> => controller.atualizar(id, membro);
export const controllerDeletarMembro = (id: string): Promise<boolean> => controller.excluir(id);

export const controllerListarComite = async function (): Promise<MembroEquipeModel[]> {
  const membros = await controller.listar();
  return membros
    .filter(function (m) { return m.comite; })
    .sort(function (a, b) { return (a.ordemComite || 99) - (b.ordemComite || 99); });
};

export const controllerListarPesquisadores = async function (): Promise<MembroEquipeModel[]> {
  const membros = await controller.listar();
  return membros
    .filter(function (m) { return m.pesquisador; })
    .sort(function (a, b) { return a.nome.localeCompare(b.nome); });
};

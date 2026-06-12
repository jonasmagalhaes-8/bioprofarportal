import { apiBackend } from '../services/api';
import { PortfolioModel } from '../models/PortfolioModel';
import { ResponseModel } from '../models/ResponseModel';

let portfolioDatabase: PortfolioModel[] = [
  {
    id: 1,
    titulo: 'Sistema de Monitoramento Ambiental',
    tipo: 'Software',
    ano: '2025',
    descricao: 'Plataforma integrada para monitoramento de dados ambientais em tempo real com análise preditiva',
    imagemUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
  },
  {
    id: 2,
    titulo: 'Sensor IoT para Agricultura de Precisão',
    tipo: 'Hardware',
    ano: '2024',
    descricao: 'Dispositivo de sensoriamento para otimização de recursos hídricos em culturas agrícolas',
    imagemUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
  },
  {
    id: 3,
    titulo: 'Prêmio de Inovação em Sustentabilidade',
    tipo: 'Premiação',
    ano: '2024',
    descricao: 'Reconhecimento nacional por desenvolvimento de tecnologias sustentáveis aplicadas',
    imagemUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400',
  },
];

export const controllerListarPortfolio = async (): Promise<ResponseModel<PortfolioModel[]>> => {
  try {
    const json = await apiBackend.get('/portfolio/listar');
    return json.data;
  } catch (err: any) {
    const response = new ResponseModel<PortfolioModel[]>();
    response.response = portfolioDatabase;
    response.sucesso = true;
    response.mensagem = 'Portfólio listado com sucesso';
    return response;
  }
};

export const controllerAdicionarPortfolio = async (portfolio: PortfolioModel): Promise<ResponseModel<PortfolioModel>> => {
  try {
    const json = await apiBackend.post('/portfolio/salvar', portfolio);
    return json.data;
  } catch (err: any) {
    const novoId = Math.max(...portfolioDatabase.map(p => p.id), 0) + 1;
    const novoItem = { ...portfolio, id: novoId };
    portfolioDatabase.push(novoItem);
    
    const response = new ResponseModel<PortfolioModel>();
    response.response = novoItem;
    response.sucesso = true;
    response.mensagem = 'Item adicionado ao portfólio';
    return response;
  }
};

export const controllerAtualizarPortfolio = async (portfolio: PortfolioModel): Promise<ResponseModel<PortfolioModel>> => {
  try {
    let json;
    if (portfolio.id) {
      json = await apiBackend.put('/portfolio/atualizar', portfolio);
    } else {
      json = await apiBackend.post('/portfolio/salvar', portfolio);
    }
    return json.data;
  } catch (err: any) {
    const index = portfolioDatabase.findIndex(p => p.id === portfolio.id);
    if (index !== -1) {
      portfolioDatabase[index] = portfolio;
    }
    
    const response = new ResponseModel<PortfolioModel>();
    response.response = portfolio;
    response.sucesso = true;
    response.mensagem = 'Item atualizado';
    return response;
  }
};

export const controllerRemoverPortfolio = async (id: number): Promise<ResponseModel<null>> => {
  try {
    const json = await apiBackend.delete(`/portfolio/deletar/${id}`);
    return json.data;
  } catch (err: any) {
    portfolioDatabase = portfolioDatabase.filter(p => p.id !== id);
    
    const response = new ResponseModel<null>();
    response.response = null;
    response.sucesso = true;
    response.mensagem = 'Item removido';
    return response;
  }
};

import { apiBackend } from '../services/api';
import type { PortfolioModel } from '../models/PortfolioModel';
import type { ResponseModel } from '../models/ResponseModel';

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

export const controllerListarPortfolio = async function (): Promise<ResponseModel> {
  try {
    const json = await apiBackend.get('/portfolio/listar');
    return json.data;
  } catch (err) {
    const response: ResponseModel = {
      response: portfolioDatabase,
      sucesso: true,
      mensagem: 'Portfólio listado com sucesso',
    };
    return response;
  }
};

export const controllerAdicionarPortfolio = async function (portfolio: PortfolioModel): Promise<ResponseModel> {
  try {
    const json = await apiBackend.post('/portfolio/salvar', portfolio);
    return json.data;
  } catch (err) {
    const novoId = Math.max(...portfolioDatabase.map(function (p) { return p.id; }).concat([0])) + 1;
    const novoItem: PortfolioModel = Object.assign({}, portfolio, { id: novoId });
    portfolioDatabase.push(novoItem);

    const response: ResponseModel = {
      response: novoItem,
      sucesso: true,
      mensagem: 'Item adicionado ao portfólio',
    };
    return response;
  }
};

export const controllerAtualizarPortfolio = async function (portfolio: PortfolioModel): Promise<ResponseModel> {
  try {
    let json;
    if (portfolio.id) {
      json = await apiBackend.put('/portfolio/atualizar', portfolio);
    } else {
      json = await apiBackend.post('/portfolio/salvar', portfolio);
    }
    return json.data;
  } catch (err) {
    const index = portfolioDatabase.findIndex(function (p) { return p.id === portfolio.id; });
    if (index !== -1) {
      portfolioDatabase[index] = portfolio;
    }

    const response: ResponseModel = {
      response: portfolio,
      sucesso: true,
      mensagem: 'Item atualizado',
    };
    return response;
  }
};

export const controllerRemoverPortfolio = async function (id: number): Promise<ResponseModel> {
  try {
    const json = await apiBackend.delete('/portfolio/deletar/' + id);
    return json.data;
  } catch (err) {
    portfolioDatabase = portfolioDatabase.filter(function (p) { return p.id !== id; });

    const response: ResponseModel = {
      response: null,
      sucesso: true,
      mensagem: 'Item removido',
    };
    return response;
  }
};

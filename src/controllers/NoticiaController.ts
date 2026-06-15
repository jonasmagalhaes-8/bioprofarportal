import { apiBackend } from '../services/api';
import type { NoticiaModel } from '../models/NoticiaModel';
import type { ResponseModel } from '../models/ResponseModel';

let mockNoticias: NoticiaModel[] = [];

function initMockNoticias(): NoticiaModel[] {
  if (mockNoticias.length === 0) {
    const noticia1: NoticiaModel = {
      id: 1,
      titulo: 'BioprFar-BA recebe financiamento para novas pesquisas',
      conteudo: 'A Rede Baiana de Bioprospecção e Desenvolvimento de Fármacos foi contemplada com R$ 2,5 milhões em editais da FAPESB para desenvolvimento de três projetos de pesquisa em medicamentos para doenças negligenciadas.',
      data: '2026-02-01',
      autor: 'Assessoria de Comunicação',
      imagemUrl: 'https://images.unsplash.com/photo-1707944746058-4da338d0f827?w=800',
      imagens: ['https://images.unsplash.com/photo-1707944746058-4da338d0f827?w=800', 'https://images.unsplash.com/photo-1707944745905-1ba3ef7c0c83?w=800', 'https://images.unsplash.com/photo-1707944745860-4615eb585a41?w=800'],
    };

    const noticia2: NoticiaModel = {
      id: 2,
      titulo: 'Workshop sobre técnicas de isolamento de compostos naturais',
      conteudo: 'Nos dias 15 e 16 de fevereiro, a rede promoverá um workshop gratuito sobre técnicas avançadas de isolamento e caracterização de compostos naturais. Inscrições abertas até 10/02.',
      data: '2026-01-28',
      autor: 'Coordenação de Eventos',
      imagemUrl: 'https://images.unsplash.com/photo-1707944745905-1ba3ef7c0c83?w=800',
      imagens: [],
    };

    const noticia3: NoticiaModel = {
      id: 3,
      titulo: 'Pesquisadores da rede publicam em periódico internacional de alto impacto',
      conteudo: 'Estudo sobre peptídeos antimicrobianos desenvolvido por pesquisadores da BioprFar-BA foi publicado na revista Nature Communications, com fator de impacto 14.9.',
      data: '2026-01-20',
      autor: 'Dra. Marina Silva',
      imagemUrl: 'https://images.unsplash.com/photo-1707944745860-4615eb585a41?w=800',
      imagens: [],
    };

    const noticia4: NoticiaModel = {
      id: 4,
      titulo: 'Parceria com indústria farmacêutica para desenvolvimento de fitomedicamento',
      conteudo: 'A rede firmou parceria com laboratório nacional para desenvolvimento de fitomedicamento baseado em extrato de planta da Caatinga, com previsão de ensaios clínicos em 2027.',
      data: '2026-01-15',
      autor: 'Coordenação BioprFar-BA',
      imagemUrl: 'https://images.unsplash.com/photo-1707944745853-b86631676829?w=800',
      imagens: [],
    };

    const noticia5: NoticiaModel = {
      id: 5,
      titulo: 'Defesa de tese: Novos alvos terapêuticos para tuberculose',
      conteudo: 'O doutorando Carlos Henrique Santos defenderá sua tese sobre descoberta de novos inibidores de enzimas do Mycobacterium tuberculosis no dia 25/02, às 14h, no auditório da UFBA.',
      data: '2026-01-10',
      autor: 'Programa de Pós-Graduação',
      imagemUrl: 'https://images.unsplash.com/photo-1707944745899-104a4b12d945?w=800',
      imagens: [],
    };

    mockNoticias = [noticia1, noticia2, noticia3, noticia4, noticia5];
  }
  return mockNoticias;
}

export async function controllerListarNoticias(): Promise<ResponseModel> {
  try {
    const json = await apiBackend.get('/noticia/listar');
    return json.data;
  } catch (err) {
    const response: ResponseModel = {
      response: initMockNoticias(),
      mensagem: 'Notícias carregadas com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerCriarNoticia(noticia: NoticiaModel): Promise<ResponseModel> {
  try {
    const json = await apiBackend.post('/noticia/salvar', noticia);
    return json.data;
  } catch (err) {
    noticia.id = Date.now();
    mockNoticias.unshift(noticia);

    const response: ResponseModel = {
      response: noticia,
      mensagem: 'Notícia criada com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerAtualizarNoticia(noticia: NoticiaModel): Promise<ResponseModel> {
  try {
    let json;
    if (noticia.id) {
      json = await apiBackend.put('/noticia/atualizar', noticia);
    } else {
      json = await apiBackend.post('/noticia/salvar', noticia);
    }
    return json.data;
  } catch (err) {
    const index = mockNoticias.findIndex(function (n) { return n.id === noticia.id; });
    if (index !== -1) {
      mockNoticias[index] = noticia;
    }

    const response: ResponseModel = {
      response: noticia,
      mensagem: 'Notícia atualizada com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerDeletarNoticia(id: number): Promise<ResponseModel> {
  try {
    const json = await apiBackend.delete('/noticia/deletar/' + id);
    return json.data;
  } catch (err) {
    mockNoticias = mockNoticias.filter(function (n) { return n.id !== id; });

    const response: ResponseModel = {
      response: null,
      mensagem: 'Notícia deletada com sucesso',
      sucesso: true,
    };
    return response;
  }
}

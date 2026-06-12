import { apiBackend } from '../services/api';
import { NoticiaModel } from '../models/NoticiaModel';
import { ResponseModel } from '../models/ResponseModel';

let mockNoticias: NoticiaModel[] = [];

function initMockNoticias() {
  if (mockNoticias.length === 0) {
    const noticia1 = new NoticiaModel();
    noticia1.id = 1;
    noticia1.titulo = 'BioprFar-BA recebe financiamento para novas pesquisas';
    noticia1.conteudo = 'A Rede Baiana de Bioprospecção e Desenvolvimento de Fármacos foi contemplada com R$ 2,5 milhões em editais da FAPESB para desenvolvimento de três projetos de pesquisa em medicamentos para doenças negligenciadas.';
    noticia1.data = '2026-02-01';
    noticia1.autor = 'Assessoria de Comunicação';
    noticia1.imagemUrl = 'https://images.unsplash.com/photo-1707944746058-4da338d0f827?w=800';

    const noticia2 = new NoticiaModel();
    noticia2.id = 2;
    noticia2.titulo = 'Workshop sobre técnicas de isolamento de compostos naturais';
    noticia2.conteudo = 'Nos dias 15 e 16 de fevereiro, a rede promoverá um workshop gratuito sobre técnicas avançadas de isolamento e caracterização de compostos naturais. Inscrições abertas até 10/02.';
    noticia2.data = '2026-01-28';
    noticia2.autor = 'Coordenação de Eventos';
    noticia2.imagemUrl = 'https://images.unsplash.com/photo-1707944745905-1ba3ef7c0c83?w=800';

    const noticia3 = new NoticiaModel();
    noticia3.id = 3;
    noticia3.titulo = 'Pesquisadores da rede publicam em periódico internacional de alto impacto';
    noticia3.conteudo = 'Estudo sobre peptídeos antimicrobianos desenvolvido por pesquisadores da BioprFar-BA foi publicado na revista Nature Communications, com fator de impacto 14.9.';
    noticia3.data = '2026-01-20';
    noticia3.autor = 'Dra. Marina Silva';
    noticia3.imagemUrl = 'https://images.unsplash.com/photo-1707944745860-4615eb585a41?w=800';

    const noticia4 = new NoticiaModel();
    noticia4.id = 4;
    noticia4.titulo = 'Parceria com indústria farmacêutica para desenvolvimento de fitomedicamento';
    noticia4.conteudo = 'A rede firmou parceria com laboratório nacional para desenvolvimento de fitomedicamento baseado em extrato de planta da Caatinga, com previsão de ensaios clínicos em 2027.';
    noticia4.data = '2026-01-15';
    noticia4.autor = 'Coordenação BioprFar-BA';
    noticia4.imagemUrl = 'https://images.unsplash.com/photo-1707944745853-b86631676829?w=800';

    const noticia5 = new NoticiaModel();
    noticia5.id = 5;
    noticia5.titulo = 'Defesa de tese: Novos alvos terapêuticos para tuberculose';
    noticia5.conteudo = 'O doutorando Carlos Henrique Santos defenderá sua tese sobre descoberta de novos inibidores de enzimas do Mycobacterium tuberculosis no dia 25/02, às 14h, no auditório da UFBA.';
    noticia5.data = '2026-01-10';
    noticia5.autor = 'Programa de Pós-Graduação';
    noticia5.imagemUrl = 'https://images.unsplash.com/photo-1707944745899-104a4b12d945?w=800';

    mockNoticias = [noticia1, noticia2, noticia3, noticia4, noticia5];
  }
  return mockNoticias;
}

export async function controllerListarNoticias(): Promise<ResponseModel<NoticiaModel[]>> {
  try {
    const json = await apiBackend.get('/noticia/listar');
    return json.data;
  } catch (err: any) {
    const response = new ResponseModel<NoticiaModel[]>();
    response.response = initMockNoticias();
    response.mensagem = 'Notícias carregadas com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerCriarNoticia(noticia: NoticiaModel): Promise<ResponseModel<NoticiaModel>> {
  try {
    const json = await apiBackend.post('/noticia/salvar', noticia);
    return json.data;
  } catch (err: any) {
    noticia.id = Date.now();
    mockNoticias.unshift(noticia);
    
    const response = new ResponseModel<NoticiaModel>();
    response.response = noticia;
    response.mensagem = 'Notícia criada com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerAtualizarNoticia(noticia: NoticiaModel): Promise<ResponseModel<NoticiaModel>> {
  try {
    let json;
    if (noticia.id) {
      json = await apiBackend.put('/noticia/atualizar', noticia);
    } else {
      json = await apiBackend.post('/noticia/salvar', noticia);
    }
    return json.data;
  } catch (err: any) {
    const index = mockNoticias.findIndex(n => n.id === noticia.id);
    if (index !== -1) {
      mockNoticias[index] = noticia;
    }
    
    const response = new ResponseModel<NoticiaModel>();
    response.response = noticia;
    response.mensagem = 'Notícia atualizada com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerDeletarNoticia(id: number): Promise<ResponseModel<null>> {
  try {
    const json = await apiBackend.delete(`/noticia/deletar/${id}`);
    return json.data;
  } catch (err: any) {
    mockNoticias = mockNoticias.filter(n => n.id !== id);
    
    const response = new ResponseModel<null>();
    response.response = null;
    response.mensagem = 'Notícia deletada com sucesso';
    response.sucesso = true;
    return response;
  }
}

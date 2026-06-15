import { apiBackend } from '../services/api';
import type { ImagemCarrosselModel } from '../models/ImagemCarrosselModel';
import type { ResponseModel } from '../models/ResponseModel';

let mockImagens: ImagemCarrosselModel[] = [];

function initMockImagens(): ImagemCarrosselModel[] {
  if (mockImagens.length === 0) {
    const img1: ImagemCarrosselModel = {
      id: 1,
      url: 'https://images.unsplash.com/photo-1582719471137-c3967ffb7d42?w=1200',
      titulo: 'Pesquisa em Bioprospecção',
      legenda: 'Desenvolvimento de novos fármacos a partir da biodiversidade baiana',
      ordem: 1,
    };

    const img2: ImagemCarrosselModel = {
      id: 2,
      url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200',
      titulo: 'Laboratórios de Ponta',
      legenda: 'Infraestrutura moderna para pesquisa e inovação farmacêutica',
      ordem: 2,
    };

    const img3: ImagemCarrosselModel = {
      id: 3,
      url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200',
      titulo: 'Equipe Multidisciplinar',
      legenda: 'Profissionais qualificados trabalhando em projetos de desenvolvimento de medicamentos',
      ordem: 3,
    };

    const img4: ImagemCarrosselModel = {
      id: 4,
      url: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=1200',
      titulo: 'Inovação Tecnológica',
      legenda: 'Tecnologia de ponta aplicada à descoberta de novos compostos terapêuticos',
      ordem: 4,
    };

    mockImagens = [img1, img2, img3, img4];
  }
  return mockImagens;
}

export async function controllerListarImagensCarrossel(): Promise<ResponseModel> {
  try {
    const json = await apiBackend.get('/imagemcarrossel/listar');
    return json.data;
  } catch (err) {
    const response: ResponseModel = {
      response: initMockImagens(),
      mensagem: 'Imagens carregadas com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerCriarImagemCarrossel(imagem: ImagemCarrosselModel): Promise<ResponseModel> {
  try {
    const json = await apiBackend.post('/imagemcarrossel/salvar', imagem);
    return json.data;
  } catch (err) {
    imagem.id = Date.now();
    mockImagens.push(imagem);

    const response: ResponseModel = {
      response: imagem,
      mensagem: 'Imagem adicionada com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerAtualizarImagemCarrossel(imagem: ImagemCarrosselModel): Promise<ResponseModel> {
  try {
    let json;
    if (imagem.id) {
      json = await apiBackend.put('/imagemcarrossel/atualizar', imagem);
    } else {
      json = await apiBackend.post('/imagemcarrossel/salvar', imagem);
    }
    return json.data;
  } catch (err) {
    const index = mockImagens.findIndex(function (i) { return i.id === imagem.id; });
    if (index !== -1) {
      mockImagens[index] = imagem;
    }

    const response: ResponseModel = {
      response: imagem,
      mensagem: 'Imagem atualizada com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerDeletarImagemCarrossel(id: number): Promise<ResponseModel> {
  try {
    const json = await apiBackend.delete('/imagemcarrossel/deletar/' + id);
    return json.data;
  } catch (err) {
    mockImagens = mockImagens.filter(function (i) { return i.id !== id; });

    const response: ResponseModel = {
      response: null,
      mensagem: 'Imagem removida com sucesso',
      sucesso: true,
    };
    return response;
  }
}

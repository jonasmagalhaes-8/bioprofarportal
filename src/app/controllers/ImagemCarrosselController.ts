import { apiBackend } from '../services/api';
import { ImagemCarrosselModel } from '../models/ImagemCarrosselModel';
import { ResponseModel } from '../models/ResponseModel';

let mockImagens: ImagemCarrosselModel[] = [];

function initMockImagens() {
  if (mockImagens.length === 0) {
    const img1 = new ImagemCarrosselModel();
    img1.id = 1;
    img1.url = 'https://images.unsplash.com/photo-1582719471137-c3967ffb7d42?w=1200';
    img1.titulo = 'Pesquisa em Bioprospecção';
    img1.legenda = 'Desenvolvimento de novos fármacos a partir da biodiversidade baiana';
    img1.ordem = 1;

    const img2 = new ImagemCarrosselModel();
    img2.id = 2;
    img2.url = 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200';
    img2.titulo = 'Laboratórios de Ponta';
    img2.legenda = 'Infraestrutura moderna para pesquisa e inovação farmacêutica';
    img2.ordem = 2;

    const img3 = new ImagemCarrosselModel();
    img3.id = 3;
    img3.url = 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200';
    img3.titulo = 'Equipe Multidisciplinar';
    img3.legenda = 'Profissionais qualificados trabalhando em projetos de desenvolvimento de medicamentos';
    img3.ordem = 3;

    const img4 = new ImagemCarrosselModel();
    img4.id = 4;
    img4.url = 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=1200';
    img4.titulo = 'Inovação Tecnológica';
    img4.legenda = 'Tecnologia de ponta aplicada à descoberta de novos compostos terapêuticos';
    img4.ordem = 4;

    mockImagens = [img1, img2, img3, img4];
  }
  return mockImagens;
}

export async function controllerListarImagensCarrossel(): Promise<ResponseModel<ImagemCarrosselModel[]>> {
  try {
    const json = await apiBackend.get('/imagemcarrossel/listar');
    return json.data;
  } catch (err: any) {
    const response = new ResponseModel<ImagemCarrosselModel[]>();
    response.response = initMockImagens();
    response.mensagem = 'Imagens carregadas com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerCriarImagemCarrossel(imagem: ImagemCarrosselModel): Promise<ResponseModel<ImagemCarrosselModel>> {
  try {
    const json = await apiBackend.post('/imagemcarrossel/salvar', imagem);
    return json.data;
  } catch (err: any) {
    imagem.id = Date.now();
    mockImagens.push(imagem);

    const response = new ResponseModel<ImagemCarrosselModel>();
    response.response = imagem;
    response.mensagem = 'Imagem adicionada com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerAtualizarImagemCarrossel(imagem: ImagemCarrosselModel): Promise<ResponseModel<ImagemCarrosselModel>> {
  try {
    let json;
    if (imagem.id) {
      json = await apiBackend.put('/imagemcarrossel/atualizar', imagem);
    } else {
      json = await apiBackend.post('/imagemcarrossel/salvar', imagem);
    }
    return json.data;
  } catch (err: any) {
    const index = mockImagens.findIndex(i => i.id === imagem.id);
    if (index !== -1) {
      mockImagens[index] = imagem;
    }

    const response = new ResponseModel<ImagemCarrosselModel>();
    response.response = imagem;
    response.mensagem = 'Imagem atualizada com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerDeletarImagemCarrossel(id: number): Promise<ResponseModel<null>> {
  try {
    const json = await apiBackend.delete(`/imagemcarrossel/deletar/${id}`);
    return json.data;
  } catch (err: any) {
    mockImagens = mockImagens.filter(i => i.id !== id);

    const response = new ResponseModel<null>();
    response.response = null;
    response.mensagem = 'Imagem removida com sucesso';
    response.sucesso = true;
    return response;
  }
}

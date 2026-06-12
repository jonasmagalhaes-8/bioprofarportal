import { apiBackend } from '../services/api';
import { ArtigoModel } from '../models/ArtigoModel';
import { ResponseModel } from '../models/ResponseModel';

let mockArtigos: ArtigoModel[] = [];

function initMockArtigos() {
  if (mockArtigos.length === 0) {
    const artigo1 = new ArtigoModel();
    artigo1.id = 1;
    artigo1.titulo = 'Bioprospecção de compostos bioativos em plantas da Caatinga baiana';
    artigo1.autores = 'Silva JM, Santos AR, Oliveira PC, Costa LF';
    artigo1.resumo = 'Este estudo investigou o potencial farmacológico de extratos de plantas endêmicas da Caatinga, com foco em atividades antimicrobianas e antioxidantes.';
    artigo1.conteudo = 'A biodiversidade da Caatinga representa uma fonte promissora para descoberta de novos fármacos. Nosso estudo avaliou 15 espécies vegetais...';
    artigo1.dataPublicacao = '2025-01-15';
    artigo1.revista = 'Journal of Natural Products Research';
    artigo1.doi = '10.1016/j.jnpr.2025.01.015';

    const artigo2 = new ArtigoModel();
    artigo2.id = 2;
    artigo2.titulo = 'Desenvolvimento de inibidores de proteases para tratamento de doenças negligenciadas';
    artigo2.autores = 'Ferreira AB, Machado TC, Rocha MH';
    artigo2.resumo = 'Investigação de novos inibidores de cisteína proteases com potencial aplicação no tratamento de leishmaniose e doença de Chagas.';
    artigo2.conteudo = 'As doenças negligenciadas representam um desafio para a saúde pública no Brasil. Este trabalho apresenta a síntese e avaliação...';
    artigo2.dataPublicacao = '2024-11-22';
    artigo2.revista = 'Brazilian Journal of Pharmaceutical Sciences';
    artigo2.doi = '10.1590/s2175-97902024000122';

    const artigo3 = new ArtigoModel();
    artigo3.id = 3;
    artigo3.titulo = 'Caracterização fitoquímica de Anacardium occidentale e suas propriedades anti-inflamatórias';
    artigo3.autores = 'Almeida RS, Nascimento KS, Pereira LM, Santos DF';
    artigo3.resumo = 'Análise dos compostos fenólicos presentes no cajueiro e avaliação de sua eficácia em modelos in vitro de inflamação.';
    artigo3.conteudo = 'O cajueiro (Anacardium occidentale) é amplamente distribuído no Nordeste brasileiro. Nossos experimentos demonstraram...';
    artigo3.dataPublicacao = '2024-09-10';
    artigo3.revista = 'Phytomedicine International';
    artigo3.doi = '10.1016/j.phymed.2024.09.010';

    const artigo4 = new ArtigoModel();
    artigo4.id = 4;
    artigo4.titulo = 'Peptídeos antimicrobianos de anfíbios da Mata Atlântica baiana';
    artigo4.autores = 'Carvalho MN, Souza RL, Barbosa JT';
    artigo4.resumo = 'Isolamento e caracterização de peptídeos com atividade antimicrobiana de secreções cutâneas de anuros nativos da Bahia.';
    artigo4.conteudo = 'Os anfíbios são fontes ricas de peptídeos bioativos. Este estudo identificou 8 novos peptídeos com potente atividade...';
    artigo4.dataPublicacao = '2024-07-05';
    artigo4.revista = 'Peptides Journal';
    artigo4.doi = '10.1016/j.peptides.2024.07.005';

    const artigo5 = new ArtigoModel();
    artigo5.id = 5;
    artigo5.titulo = 'Nanopartículas funcionalizadas para entrega de fármacos antitumorais';
    artigo5.autores = 'Lima FG, Cruz HS, Menezes TA';
    artigo5.resumo = 'Desenvolvimento de sistemas nanoestruturados para aumentar a biodisponibilidade e reduzir efeitos colaterais de quimioterápicos.';
    artigo5.conteudo = 'A nanotecnologia farmacêutica oferece soluções inovadoras para problemas de formulação. Nosso grupo desenvolveu...';
    artigo5.dataPublicacao = '2024-05-18';
    artigo5.revista = 'International Journal of Nanomedicine';
    artigo5.doi = '10.2147/IJN.S2024.05.018';

    mockArtigos = [artigo1, artigo2, artigo3, artigo4, artigo5];
  }
  return mockArtigos;
}

export async function controllerListarArtigos(): Promise<ResponseModel<ArtigoModel[]>> {
  try {
    const json = await apiBackend.get('/artigo/listar');
    return json.data;
  } catch (err: any) {
    const response = new ResponseModel<ArtigoModel[]>();
    response.response = initMockArtigos();
    response.mensagem = 'Artigos carregados com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerCriarArtigo(artigo: ArtigoModel): Promise<ResponseModel<ArtigoModel>> {
  try {
    const json = await apiBackend.post('/artigo/salvar', artigo);
    return json.data;
  } catch (err: any) {
    artigo.id = Date.now();
    mockArtigos.push(artigo);
    
    const response = new ResponseModel<ArtigoModel>();
    response.response = artigo;
    response.mensagem = 'Artigo criado com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerAtualizarArtigo(artigo: ArtigoModel): Promise<ResponseModel<ArtigoModel>> {
  try {
    let json;
    if (artigo.id) {
      json = await apiBackend.put('/artigo/atualizar', artigo);
    } else {
      json = await apiBackend.post('/artigo/salvar', artigo);
    }
    return json.data;
  } catch (err: any) {
    const index = mockArtigos.findIndex(a => a.id === artigo.id);
    if (index !== -1) {
      mockArtigos[index] = artigo;
    }
    
    const response = new ResponseModel<ArtigoModel>();
    response.response = artigo;
    response.mensagem = 'Artigo atualizado com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerDeletarArtigo(id: number): Promise<ResponseModel<null>> {
  try {
    const json = await apiBackend.delete(`/artigo/deletar/${id}`);
    return json.data;
  } catch (err: any) {
    mockArtigos = mockArtigos.filter(a => a.id !== id);
    
    const response = new ResponseModel<null>();
    response.response = null;
    response.mensagem = 'Artigo deletado com sucesso';
    response.sucesso = true;
    return response;
  }
}

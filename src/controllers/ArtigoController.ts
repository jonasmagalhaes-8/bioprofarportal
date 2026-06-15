import { apiBackend } from '../services/api';
import type { ArtigoModel } from '../models/ArtigoModel';
import type { ResponseModel } from '../models/ResponseModel';

let mockArtigos: ArtigoModel[] = [];

function initMockArtigos(): ArtigoModel[] {
  if (mockArtigos.length === 0) {
    const artigo1: ArtigoModel = {
      id: 1,
      titulo: 'Bioprospecção de compostos bioativos em plantas da Caatinga baiana',
      autores: 'Silva JM, Santos AR, Oliveira PC, Costa LF',
      resumo: 'Este estudo investigou o potencial farmacológico de extratos de plantas endêmicas da Caatinga, com foco em atividades antimicrobianas e antioxidantes.',
      conteudo: 'A biodiversidade da Caatinga representa uma fonte promissora para descoberta de novos fármacos. Nosso estudo avaliou 15 espécies vegetais...',
      dataPublicacao: '2025-01-15',
      revista: 'Journal of Natural Products Research',
      doi: '10.1016/j.jnpr.2025.01.015',
    };

    const artigo2: ArtigoModel = {
      id: 2,
      titulo: 'Desenvolvimento de inibidores de proteases para tratamento de doenças negligenciadas',
      autores: 'Ferreira AB, Machado TC, Rocha MH',
      resumo: 'Investigação de novos inibidores de cisteína proteases com potencial aplicação no tratamento de leishmaniose e doença de Chagas.',
      conteudo: 'As doenças negligenciadas representam um desafio para a saúde pública no Brasil. Este trabalho apresenta a síntese e avaliação...',
      dataPublicacao: '2024-11-22',
      revista: 'Brazilian Journal of Pharmaceutical Sciences',
      doi: '10.1590/s2175-97902024000122',
    };

    const artigo3: ArtigoModel = {
      id: 3,
      titulo: 'Caracterização fitoquímica de Anacardium occidentale e suas propriedades anti-inflamatórias',
      autores: 'Almeida RS, Nascimento KS, Pereira LM, Santos DF',
      resumo: 'Análise dos compostos fenólicos presentes no cajueiro e avaliação de sua eficácia em modelos in vitro de inflamação.',
      conteudo: 'O cajueiro (Anacardium occidentale) é amplamente distribuído no Nordeste brasileiro. Nossos experimentos demonstraram...',
      dataPublicacao: '2024-09-10',
      revista: 'Phytomedicine International',
      doi: '10.1016/j.phymed.2024.09.010',
    };

    const artigo4: ArtigoModel = {
      id: 4,
      titulo: 'Peptídeos antimicrobianos de anfíbios da Mata Atlântica baiana',
      autores: 'Carvalho MN, Souza RL, Barbosa JT',
      resumo: 'Isolamento e caracterização de peptídeos com atividade antimicrobiana de secreções cutâneas de anuros nativos da Bahia.',
      conteudo: 'Os anfíbios são fontes ricas de peptídeos bioativos. Este estudo identificou 8 novos peptídeos com potente atividade...',
      dataPublicacao: '2024-07-05',
      revista: 'Peptides Journal',
      doi: '10.1016/j.peptides.2024.07.005',
    };

    const artigo5: ArtigoModel = {
      id: 5,
      titulo: 'Nanopartículas funcionalizadas para entrega de fármacos antitumorais',
      autores: 'Lima FG, Cruz HS, Menezes TA',
      resumo: 'Desenvolvimento de sistemas nanoestruturados para aumentar a biodisponibilidade e reduzir efeitos colaterais de quimioterápicos.',
      conteudo: 'A nanotecnologia farmacêutica oferece soluções inovadoras para problemas de formulação. Nosso grupo desenvolveu...',
      dataPublicacao: '2024-05-18',
      revista: 'International Journal of Nanomedicine',
      doi: '10.2147/IJN.S2024.05.018',
    };

    mockArtigos = [artigo1, artigo2, artigo3, artigo4, artigo5];
  }
  return mockArtigos;
}

export async function controllerListarArtigos(): Promise<ResponseModel> {
  try {
    const json = await apiBackend.get('/artigo/listar');
    return json.data;
  } catch (err) {
    const response: ResponseModel = {
      response: initMockArtigos(),
      mensagem: 'Artigos carregados com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerCriarArtigo(artigo: ArtigoModel): Promise<ResponseModel> {
  try {
    const json = await apiBackend.post('/artigo/salvar', artigo);
    return json.data;
  } catch (err) {
    artigo.id = Date.now();
    mockArtigos.push(artigo);

    const response: ResponseModel = {
      response: artigo,
      mensagem: 'Artigo criado com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerAtualizarArtigo(artigo: ArtigoModel): Promise<ResponseModel> {
  try {
    let json;
    if (artigo.id) {
      json = await apiBackend.put('/artigo/atualizar', artigo);
    } else {
      json = await apiBackend.post('/artigo/salvar', artigo);
    }
    return json.data;
  } catch (err) {
    const index = mockArtigos.findIndex(function (a) { return a.id === artigo.id; });
    if (index !== -1) {
      mockArtigos[index] = artigo;
    }

    const response: ResponseModel = {
      response: artigo,
      mensagem: 'Artigo atualizado com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerDeletarArtigo(id: number): Promise<ResponseModel> {
  try {
    const json = await apiBackend.delete('/artigo/deletar/' + id);
    return json.data;
  } catch (err) {
    mockArtigos = mockArtigos.filter(function (a) { return a.id !== id; });

    const response: ResponseModel = {
      response: null,
      mensagem: 'Artigo deletado com sucesso',
      sucesso: true,
    };
    return response;
  }
}

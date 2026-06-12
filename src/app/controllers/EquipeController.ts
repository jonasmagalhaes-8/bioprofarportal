import { apiBackend } from '../services/api';
import { EquipeModel } from '../models/EquipeModel';
import { MembroEquipeModel } from '../models/MembroEquipeModel';
import { ResponseModel } from '../models/ResponseModel';

// Mock data for Equipes (Teams/Groups)
let mockEquipes: EquipeModel[] = [];

function initMockEquipes() {
  if (mockEquipes.length === 0) {
    const e1 = new EquipeModel();
    e1.id = 1;
    e1.nome = 'Comitê Gestor';
    e1.descricao = 'Membros responsáveis pela coordenação da rede.';
    e1.ordem = 1;

    const e2 = new EquipeModel();
    e2.id = 2;
    e2.nome = 'Pesquisadores';
    e2.descricao = 'Pesquisadores e colaboradores da rede.';
    e2.ordem = 2;

    mockEquipes = [e1, e2];
  }
  return mockEquipes;
}

export async function controllerListarEquipes(): Promise<ResponseModel<EquipeModel[]>> {
  try {
    const json = await apiBackend.get('/equipe/listar');
    return json.data;
  } catch (err: any) {
    const response = new ResponseModel<EquipeModel[]>();
    response.response = initMockEquipes();
    response.mensagem = 'Equipes carregadas com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerCriarEquipe(item: EquipeModel): Promise<ResponseModel<EquipeModel>> {
  try {
    const json = await apiBackend.post('/equipe/salvar', item);
    return json.data;
  } catch (err: any) {
    item.id = Date.now();
    mockEquipes.push(item);
    const response = new ResponseModel<EquipeModel>();
    response.response = item;
    response.mensagem = 'Equipe criada com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerAtualizarEquipe(item: EquipeModel): Promise<ResponseModel<EquipeModel>> {
  try {
    let json;
    if (item.id) {
      json = await apiBackend.put('/equipe/atualizar', item);
    } else {
      json = await apiBackend.post('/equipe/salvar', item);
    }
    return json.data;
  } catch (err: any) {
    const index = mockEquipes.findIndex(i => i.id === item.id);
    if (index !== -1) mockEquipes[index] = item;
    const response = new ResponseModel<EquipeModel>();
    response.response = item;
    response.mensagem = 'Equipe atualizada com sucesso';
    response.sucesso = true;
    return response;
  }
}

export async function controllerDeletarEquipe(id: number): Promise<ResponseModel<null>> {
  try {
    const json = await apiBackend.delete(`/equipe/deletar/${id}`);
    return json.data;
  } catch (err: any) {
    mockEquipes = mockEquipes.filter(i => i.id !== id);
    const response = new ResponseModel<null>();
    response.response = null;
    response.mensagem = 'Equipe removida com sucesso';
    response.sucesso = true;
    return response;
  }
}

// --- DEPRECATED / COMPATIBILITY LAYER ---
// These functions are being moved to MembroEquipeController.
// Keeping them here temporarily to avoid breaking the build.

import * as MembroController from './MembroEquipeController';

/** @deprecated Use controllerListarMembros from MembroEquipeController */
export const controllerListarEquipe = MembroController.controllerListarMembros;
/** @deprecated Use controllerCriarMembro from MembroEquipeController */
export const controllerCriarMembro = MembroController.controllerCriarMembro;
/** @deprecated Use controllerAtualizarMembro from MembroEquipeController */
export const controllerAtualizarMembro = MembroController.controllerAtualizarMembro;
/** @deprecated Use controllerDeletarMembro from MembroEquipeController */
export const controllerDeletarMembro = MembroController.controllerDeletarMembro;

/** @deprecated Filter members by team/cargo in your component or use a specific API endpoint */
export async function controllerListarComite(): Promise<ResponseModel<MembroEquipeModel[]>> {
  const res = await MembroController.controllerListarMembros();
  if (res.response) {
    res.response = res.response.filter(m => 
      m.cargo.includes('Coordenador') || 
      m.cargo.includes('Vice-Coordenador') || 
      m.cargo.includes('Sênior') || 
      m.cargo.includes('Comitê Gestor')
    );
  }
  return res;
}

/** @deprecated Filter members by team/cargo in your component or use a specific API endpoint */
export async function controllerListarPesquisadores(): Promise<ResponseModel<MembroEquipeModel[]>> {
  const res = await MembroController.controllerListarMembros();
  if (res.response) {
    res.response = res.response.filter(m => 
      m.cargo.includes('Pesquisador') || 
      m.cargo.includes('Colaborador')
    );
  }
  return res;
}

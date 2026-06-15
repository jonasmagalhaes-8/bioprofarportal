import { apiBackend } from '../services/api';
import type { EquipeModel } from '../models/EquipeModel';
import type { MembroEquipeModel } from '../models/MembroEquipeModel';
import type { ResponseModel } from '../models/ResponseModel';

// Mock data for Equipes (Teams/Groups)
let mockEquipes: EquipeModel[] = [];

function initMockEquipes(): EquipeModel[] {
  if (mockEquipes.length === 0) {
    const e1: EquipeModel = {
      id: 1,
      nome: 'Comitê Gestor',
      descricao: 'Membros responsáveis pela coordenação da rede.',
      ordem: 1,
    };

    const e2: EquipeModel = {
      id: 2,
      nome: 'Pesquisadores',
      descricao: 'Pesquisadores e colaboradores da rede.',
      ordem: 2,
    };

    mockEquipes = [e1, e2];
  }
  return mockEquipes;
}

export async function controllerListarEquipes(): Promise<ResponseModel> {
  try {
    const json = await apiBackend.get('/equipe/listar');
    return json.data;
  } catch (err) {
    const response: ResponseModel = {
      response: initMockEquipes(),
      mensagem: 'Equipes carregadas com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerCriarEquipe(item: EquipeModel): Promise<ResponseModel> {
  try {
    const json = await apiBackend.post('/equipe/salvar', item);
    return json.data;
  } catch (err) {
    item.id = Date.now();
    mockEquipes.push(item);
    const response: ResponseModel = {
      response: item,
      mensagem: 'Equipe criada com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerAtualizarEquipe(item: EquipeModel): Promise<ResponseModel> {
  try {
    let json;
    if (item.id) {
      json = await apiBackend.put('/equipe/atualizar', item);
    } else {
      json = await apiBackend.post('/equipe/salvar', item);
    }
    return json.data;
  } catch (err) {
    const index = mockEquipes.findIndex(function (i) { return i.id === item.id; });
    if (index !== -1) mockEquipes[index] = item;
    const response: ResponseModel = {
      response: item,
      mensagem: 'Equipe atualizada com sucesso',
      sucesso: true,
    };
    return response;
  }
}

export async function controllerDeletarEquipe(id: number): Promise<ResponseModel> {
  try {
    const json = await apiBackend.delete('/equipe/deletar/' + id);
    return json.data;
  } catch (err) {
    mockEquipes = mockEquipes.filter(function (i) { return i.id !== id; });
    const response: ResponseModel = {
      response: null,
      mensagem: 'Equipe removida com sucesso',
      sucesso: true,
    };
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
export async function controllerListarComite(): Promise<ResponseModel> {
  const res = await MembroController.controllerListarMembros();
  if ((res as any).response) {
    (res as any).response = (res as any).response.filter(function (m: MembroEquipeModel) {
      return m.comite === true;
    }).sort(function (a: MembroEquipeModel, b: MembroEquipeModel) { return (a.ordemComite || 99) - (b.ordemComite || 99); });
  } else if (Array.isArray(res)) {
    return {
      sucesso: true,
      mensagem: '',
      response: res.filter(function (m: MembroEquipeModel) { return m.comite === true; })
                 .sort(function (a: MembroEquipeModel, b: MembroEquipeModel) { return (a.ordemComite || 99) - (b.ordemComite || 99); })
    } as any;
  }
  return res as any;
}

/** @deprecated Filter members by team/cargo in your component or use a specific API endpoint */
export async function controllerListarPesquisadores(): Promise<ResponseModel> {
  const res = await MembroController.controllerListarMembros();
  if ((res as any).response) {
    (res as any).response = (res as any).response.filter(function (m: MembroEquipeModel) {
      return m.pesquisador === true;
    }).sort(function (a: MembroEquipeModel, b: MembroEquipeModel) { return a.nome.localeCompare(b.nome); });
  } else if (Array.isArray(res)) {
    return {
      sucesso: true,
      mensagem: '',
      response: res.filter(function (m: MembroEquipeModel) { return m.pesquisador === true; })
                 .sort(function (a: MembroEquipeModel, b: MembroEquipeModel) { return a.nome.localeCompare(b.nome); })
    } as any;
  }
  return res as any;
}

export class MembroEquipeModel {
  id?: number;
  nome: string = '';
  cargo: string = '';
  instituicao: string = '';
  email: string = '';
  lattes: string = '';
  fotoUrl: string = '';
  descricao: string = '';
  comite: boolean = false;
  pesquisador: boolean = false;
  ordemComite?: number;
}

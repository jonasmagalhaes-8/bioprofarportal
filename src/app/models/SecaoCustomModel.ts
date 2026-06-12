export class SecaoCustomModel {
  id?: number;
  titulo: string = '';
  conteudo: string = '';
  tipo: 'texto' | 'lista' = 'texto';
  ordem: number = 0;
}

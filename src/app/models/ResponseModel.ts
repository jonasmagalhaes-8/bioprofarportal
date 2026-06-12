export class ResponseModel<T> {
  response: T | null = null;
  mensagem: string = '';
  sucesso: boolean = false;
}

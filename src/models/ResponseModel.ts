export interface ResponseModel<T = unknown> {
  response: T | null;
  mensagem: string;
  sucesso: boolean;
}

export function createResponseModel<T = unknown>(overrides?: Partial<ResponseModel<T>>): ResponseModel<T> {
  return {
    response: null,
    mensagem: '',
    sucesso: false,
    ...overrides,
  };
}

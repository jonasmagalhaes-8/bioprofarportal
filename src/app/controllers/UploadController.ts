import { apiBackend } from '../services/api';

export const controllerUploadImagem = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiBackend.post('/api/upload/imagem', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  if (response.data && response.data.response) {
    return response.data.response;
  }
  
  throw new Error('Erro ao enviar imagem');
};

import api from './api';

export const buscarProbabilidade = async (cidade) => {
  const response = await api.get(`/api/risk/${cidade}`);
  return response.data;
};

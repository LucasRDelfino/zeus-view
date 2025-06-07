import api from './api';

export const buscarClima = async (cidade) => {
  const response = await api.get('/api/weather', { params: { cidade } });
  return response.data;
};

import api from './api';

export const buscarAlertas = async (uf) => {
  try {
    const response = await api.get(`/api/alerts/${uf}`);
    return response.data.alerts || [];
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return []; 
  }
};
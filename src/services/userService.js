import axios from 'axios';

const API_URL = 'http://localhost:8080/users';

export const cadastrarUsuario = async (usuario) => {
  const response = await axios.post(API_URL, usuario);
  return response.data;
};

export const loginUsuario = async (usuario) => {
  const response = await axios.post(`${API_URL}/login`, usuario);
  return response.data;
};

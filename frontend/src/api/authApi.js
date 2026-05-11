import { httpClient } from './httpClient';

export const signup = async (payload) => {
  const response = await httpClient.post('/auth/signup', payload);
  return response.data;
};

export const login = async (payload) => {
  const response = await httpClient.post('/auth/login', payload);
  return response.data;
};

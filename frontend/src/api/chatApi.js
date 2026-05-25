import { httpClient } from './httpClient';

export const getChatHistory = async () => {
  const response = await httpClient.get('/chat/history');
  return response.data;
};

export const sendChatMessage = async (message) => {
  const response = await httpClient.post('/chat', { message });
  return response.data;
};

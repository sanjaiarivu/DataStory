import { httpClient } from './httpClient';

export const getFiles = async () => {
  const response = await httpClient.get('/files');
  return response.data;
};

export const uploadFiles = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await httpClient.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

export const deleteFile = async (fileId) => {
  const response = await httpClient.delete(`/files/${fileId}`);
  return response.data;
};

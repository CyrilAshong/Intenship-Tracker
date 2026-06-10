import api from './api';
import { Platform } from 'react-native';

export interface Document {
  id: string;
  userId: string;
  applicationId: string | null;
  url: string;
  type: 'CV' | 'LETTER';
  fileName: string;
  fileSize: number | null;
  uploadedAt: string;
}

export const uploadDocument = async (
  file: {
    uri: string;
    name: string;
    type: string;
  },
  documentType: 'CV' | 'LETTER',
  applicationId?: string,
): Promise<Document> => {
  const formData = new FormData();

  formData.append('file', {
    uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
    name: file.name,
    type: file.type,
  } as any);

  formData.append('type', documentType);

  if (applicationId) {
    formData.append('applicationId', applicationId);
  }

  const response = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

export const fetchMyDocuments = async (): Promise<Document[]> => {
  const response = await api.get('/documents');
  return response.data.data;
};

export const deleteDocument = async (id: string): Promise<void> => {
  await api.delete(`/documents/${id}`);
};
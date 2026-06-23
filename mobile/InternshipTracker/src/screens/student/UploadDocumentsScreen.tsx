import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import api from '../../services/api';

interface Document {
  id: string;
  type: 'CV' | 'LETTER';
  fileName: string;
  fileSize: number | null;
  uploadedAt: string;
  url: string;
}

const UploadDocumentsScreen = ({ navigation }: any) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<'CV' | 'LETTER' | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load documents.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (docType: 'CV' | 'LETTER') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      if (file.size && file.size > 5 * 1024 * 1024) {
        Alert.alert('File Too Large', 'Please select a PDF under 5MB.');
        return;
      }

      setUploadingType(docType);

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: 'application/pdf',
      } as any);
      formData.append('type', docType);

      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert(
        'Success',
        `${docType === 'CV' ? 'CV' : 'Cover Letter'} uploaded successfully!`,
      );
      loadDocuments();
    } catch (error: any) {
      const message = error.response?.data?.message ?? 'Upload failed.';
      Alert.alert('Upload Failed', message);
    } finally {
      setUploadingType(null);
    }
  };

  const handleDelete = (id: string, fileName: string) => {
    Alert.alert(
      'Delete Document',
      `Are you sure you want to delete ${fileName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/documents/${id}`);
              setDocuments(documents.filter((d) => d.id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete document.');
            }
          },
        },
      ],
    );
  };

  const cvDocs = documents.filter((d) => d.type === 'CV');
  const letterDocs = documents.filter((d) => d.type === 'LETTER');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#1a2b4a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 pt-14 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-2xl text-navy">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-navy">My Documents</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

        {/* CV Section */}
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-bold text-navy">📄 Curriculum Vitae</Text>
            <TouchableOpacity
              className="bg-navy rounded-full px-4 py-2"
              onPress={() => handleUpload('CV')}
              disabled={uploadingType === 'CV'}>
              {uploadingType === 'CV' ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-xs font-semibold text-white">+ Upload</Text>
              )}
            </TouchableOpacity>
          </View>

          {cvDocs.length === 0 ? (
            <View className="border border-dashed border-gray-200 rounded-xl py-6 items-center">
              <Text className="text-sm text-gray-400">No CV uploaded yet</Text>
            </View>
          ) : (
            cvDocs.map((doc) => (
              <View
                key={doc.id}
                className="flex-row items-center bg-gray-50 rounded-xl p-3 mb-2">
                <View className="w-10 h-10 bg-red-100 rounded-lg items-center justify-center mr-3">
                  <Text className="text-xs font-bold text-red-500">PDF</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-navy" numberOfLines={1}>
                    {doc.fileName}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {doc.fileSize
                      ? `${(doc.fileSize / 1024).toFixed(1)} KB`
                      : 'Unknown size'}{' '}
                    • {new Date(doc.uploadedAt).toDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  className="p-2"
                  onPress={() => handleDelete(doc.id, doc.fileName)}>
                  <Text className="text-lg">🗑️</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Letter Section */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-bold text-navy">✉️ Endorsement Letter</Text>
            <TouchableOpacity
              className="bg-navy rounded-full px-4 py-2"
              onPress={() => handleUpload('LETTER')}
              disabled={uploadingType === 'LETTER'}>
              {uploadingType === 'LETTER' ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-xs font-semibold text-white">+ Upload</Text>
              )}
            </TouchableOpacity>
          </View>

          {letterDocs.length === 0 ? (
            <View className="border border-dashed border-gray-200 rounded-xl py-6 items-center">
              <Text className="text-sm text-gray-400">No letter uploaded yet</Text>
            </View>
          ) : (
            letterDocs.map((doc) => (
              <View
                key={doc.id}
                className="flex-row items-center bg-gray-50 rounded-xl p-3 mb-2">
                <View className="w-10 h-10 bg-red-100 rounded-lg items-center justify-center mr-3">
                  <Text className="text-xs font-bold text-red-500">PDF</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-navy" numberOfLines={1}>
                    {doc.fileName}
                  </Text>
                  <Text className="text-xs text-gray-400">
                    {doc.fileSize
                      ? `${(doc.fileSize / 1024).toFixed(1)} KB`
                      : 'Unknown size'}{' '}
                    • {new Date(doc.uploadedAt).toDateString()}
                  </Text>
                </View>
                <TouchableOpacity
                  className="p-2"
                  onPress={() => handleDelete(doc.id, doc.fileName)}>
                  <Text className="text-lg">🗑️</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
};

export default UploadDocumentsScreen;
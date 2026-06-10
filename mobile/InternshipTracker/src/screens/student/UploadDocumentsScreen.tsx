import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  pick,
  types,
} from '@react-native-documents/picker';
import { uploadDocument, fetchMyDocuments, deleteDocument, Document } from '../../services/documentService';

const UploadDocumentsScreen = ({ navigation }: any) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<'CV' | 'LETTER' | null>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await fetchMyDocuments();
      setDocuments(docs);
    } catch (error) {
      Alert.alert('Error', 'Failed to load documents.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickAndUpload = async (docType: 'CV' | 'LETTER') => {
    try {
      const result = await pick({
        type: [types.pdf],
        allowMultiSelection: false,
      });

      const file = result[0];

      if (!file) return;

      // Validate file size
      if (file.size && file.size > MAX_FILE_SIZE) {
        Alert.alert('File Too Large', 'Please select a PDF under 5MB.');
        return;
      }

      setUploadingType(docType);

      await uploadDocument(
        {
          uri: file.uri,
          name: file.name ?? `${docType}_${Date.now()}.pdf`,
          type: 'application/pdf',
        },
        docType,
      );

      Alert.alert('Success', `${docType === 'CV' ? 'CV' : 'Cover Letter'} uploaded successfully!`);
      loadDocuments();
    } catch (error) {
      if ((error as any)?.code !== 'DOCUMENT_PICKER_CANCELED') {
        const message = error instanceof Error ? error.message : 'Upload failed.';
        Alert.alert('Upload Failed', message);
      }
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
              await deleteDocument(id);
              setDocuments(documents.filter((d) => d.id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete document.');
            }
          },
        },
      ],
    );
  };

  const cvDocuments = documents.filter((d) => d.type === 'CV');
  const letterDocuments = documents.filter((d) => d.type === 'LETTER');

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Documents</Text>
        <Text style={styles.headerSubtitle}>
          Upload your CV and cover letter as PDF files
        </Text>
      </View>

      {/* CV Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📄 Curriculum Vitae (CV)</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handlePickAndUpload('CV')}
            disabled={uploadingType === 'CV'}>
            {uploadingType === 'CV' ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.uploadButtonText}>+ Upload</Text>
            )}
          </TouchableOpacity>
        </View>

        {cvDocuments.length === 0 ? (
          <View style={styles.emptyDoc}>
            <Text style={styles.emptyDocText}>No CV uploaded yet</Text>
          </View>
        ) : (
          cvDocuments.map((doc) => (
            <View key={doc.id} style={styles.docCard}>
              <View style={styles.docIcon}>
                <Text style={styles.docIconText}>PDF</Text>
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docName} numberOfLines={1}>
                  {doc.fileName}
                </Text>
                <Text style={styles.docSize}>
                  {doc.fileSize
                    ? `${(doc.fileSize / 1024).toFixed(1)} KB`
                    : 'Unknown size'}
                </Text>
                <Text style={styles.docDate}>
                  {new Date(doc.uploadedAt).toDateString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(doc.id, doc.fileName)}>
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Cover Letter Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>✉️ Cover Letter</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => handlePickAndUpload('LETTER')}
            disabled={uploadingType === 'LETTER'}>
            {uploadingType === 'LETTER' ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.uploadButtonText}>+ Upload</Text>
            )}
          </TouchableOpacity>
        </View>

        {letterDocuments.length === 0 ? (
          <View style={styles.emptyDoc}>
            <Text style={styles.emptyDocText}>No cover letter uploaded yet</Text>
          </View>
        ) : (
          letterDocuments.map((doc) => (
            <View key={doc.id} style={styles.docCard}>
              <View style={styles.docIcon}>
                <Text style={styles.docIconText}>PDF</Text>
              </View>
              <View style={styles.docInfo}>
                <Text style={styles.docName} numberOfLines={1}>
                  {doc.fileName}
                </Text>
                <Text style={styles.docSize}>
                  {doc.fileSize
                    ? `${(doc.fileSize / 1024).toFixed(1)} KB`
                    : 'Unknown size'}
                </Text>
                <Text style={styles.docDate}>
                  {new Date(doc.uploadedAt).toDateString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(doc.id, doc.fileName)}>
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  uploadButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyDoc: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  emptyDocText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  docIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  docIconText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ef4444',
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  docSize: {
    fontSize: 12,
    color: '#6b7280',
  },
  docDate: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 18,
  },
});

export default UploadDocumentsScreen;
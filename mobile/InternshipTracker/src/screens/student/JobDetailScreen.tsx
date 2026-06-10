import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { fetchJobById, applyForJob, Job } from '../../services/jobService';

const JobDetailScreen = ({ route, navigation }: any) => {
  const { jobId } = route.params;
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [coverNote, setCoverNote] = useState('');

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await fetchJobById(jobId);
        setJob(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load job details.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };
    loadJob();
  }, [jobId]);

  const handleApply = async () => {
    try {
      setIsApplying(true);
      await applyForJob(jobId, coverNote);
      setModalVisible(false);
      Alert.alert(
        'Application Submitted!',
        'Your application has been sent successfully.',
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (error: any) {
      const message =
        error.response?.data?.message ?? 'Failed to submit application.';
      Alert.alert('Error', message);
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!job) return null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Company Header */}
        <View style={styles.header}>
          <View style={styles.companyBadge}>
            <Text style={styles.companyInitial}>
              {job.company.companyProfile?.companyName?.charAt(0) ?? 'C'}
            </Text>
          </View>
          <Text style={styles.companyName}>
            {job.company.companyProfile?.companyName ?? 'Company'}
          </Text>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.location}>
            📍 {job.location ?? 'Location not specified'}
          </Text>
        </View>

        {/* Quick Info */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>
              {job.type.replace('_', ' ')}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Stipend</Text>
            <Text style={styles.infoValue}>
              {job.isPaid ? `GH₵${job.stipend}/mo` : 'Unpaid'}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>
              {job.duration ?? 'N/A'}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Spots</Text>
            <Text style={styles.infoValue}>{job.vacancies}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Role</Text>
          <Text style={styles.sectionText}>{job.description}</Text>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills Required</Text>
          <View style={styles.skillsContainer}>
            {job.skillsRequired.map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Deadline */}
        {job.deadline && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Application Deadline</Text>
            <Text style={styles.sectionText}>
              {new Date(job.deadline).toDateString()}
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.applyContainer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>

      {/* Apply Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Apply for {job.title}</Text>
            <Text style={styles.modalSubtitle}>
              Add a cover note (optional)
            </Text>
            <TextInput
              style={styles.coverNoteInput}
              placeholder="Tell the company why you're a great fit..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
              value={coverNote}
              onChangeText={setCoverNote}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleApply}
                disabled={isApplying}>
                {isApplying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  backButton: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  companyBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyInitial: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6366f1',
  },
  companyName: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: '#9ca3af',
  },
  infoRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#ede9fe',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6366f1',
  },
  applyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  applyButton: {
    backgroundColor: '#6366f1',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  coverNoteInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#111827',
    textAlignVertical: 'top',
    minHeight: 120,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export default JobDetailScreen;
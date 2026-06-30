import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { fetchJobById, applyForJob, fetchMyApplications } from '../../services/jobService';
import { Job } from '../../types';
import api from '../../services/api';

interface Document {
  id: string;
  type: 'CV' | 'LETTER';
  fileName: string;
}

const JobDetailScreen = ({ route, navigation }: any) => {
  const { jobId } = route.params;
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [existingApplication, setExistingApplication] = useState<{ status: string } | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await fetchJobById(jobId);
        setJob(data);

        const applications = await fetchMyApplications();
        const existing = applications.find(
          (app: any) => app.jobPosting.id === jobId,
        );
        if (existing) {
          setExistingApplication({ status: existing.status });
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load job details.');
        navigation.goBack();
      } finally {
        setIsLoading(false);
      }
    };
    loadJob();
  }, [jobId]);

  const loadDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data.data);
    } catch (error) {
      // silent fail
    }
  };

  const handleOpenModal = () => {
    loadDocuments();
    setModalVisible(true);
  };

  const handleApply = async () => {
    if (!confirmed) {
      Alert.alert('Error', 'Please confirm that your documents are authentic.');
      return;
    }
    try {
      setIsApplying(true);
      await applyForJob(jobId, coverNote);
      setModalVisible(false);
      Alert.alert(
        '🎉 Application Submitted!',
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

  const cvDoc = documents.find((d) => d.type === 'CV');
  const letterDoc = documents.find((d) => d.type === 'LETTER');

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#1a2b4a" />
      </View>
    );
  }

  if (!job) return null;

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Dark Header */}
        <View className="bg-navy flex-row items-center justify-between pt-14 pb-4 px-4">
          <TouchableOpacity
            className="w-9 h-9 items-center justify-center"
            onPress={() => navigation.goBack()}>
            <Text className="text-2xl text-white font-bold">←</Text>
          </TouchableOpacity>
          <Text className="text-base font-semibold text-white">
            Internship Details
          </Text>
          <View className="flex-row gap-2">
            <TouchableOpacity className="w-9 h-9 items-center justify-center">
              <Text className="text-lg text-white">↗</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-9 h-9 items-center justify-center">
              <Text className="text-lg text-white">🔖</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Title Section */}
        <View className="p-4 pt-6">
          <View className="w-14 h-14 rounded-xl bg-gray-50 items-center justify-center border border-gray-200 mb-4">
            <Text className="text-2xl font-bold text-navy">
              {job.company.companyProfile?.companyName?.charAt(0) ?? 'C'}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-navy mb-2 leading-8">
            {job.title}
          </Text>
          <View className="gap-1">
            <Text className="text-sm text-gray-500">
              🏢 {job.company.companyProfile?.companyName ?? 'Company'}
            </Text>
            <Text className="text-sm text-gray-500">
              📍 {job.location ?? 'Location not specified'}
            </Text>
            {job.duration && (
              <Text className="text-sm text-gray-500">⏱ {job.duration}</Text>
            )}
          </View>
        </View>

        {/* Info Cards */}
        <View className="px-4 mb-4">
          <View className="flex-row gap-2 mb-2">
            <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
              <Text className="text-[10px] font-semibold text-gray-400 tracking-wide mb-1">
                STIPEND
              </Text>
              <Text className="text-lg font-bold text-navy">
                {job.isPaid ? `GH₵${job.stipend}/mo` : 'Unpaid'}
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
              <Text className="text-[10px] font-semibold text-gray-400 tracking-wide mb-1">
                DEADLINE
              </Text>
              <Text className="text-lg font-bold text-red-500">
                {job.deadline
                  ? new Date(job.deadline).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : 'Open'}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
              <Text className="text-[10px] font-semibold text-gray-400 tracking-wide mb-1">
                APPLICANTS
              </Text>
              <Text className="text-lg font-bold text-navy">
                {job._count.applications}
              </Text>
            </View>
            <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
              <Text className="text-[10px] font-semibold text-gray-400 tracking-wide mb-1">
                LEVEL
              </Text>
              <Text className="text-lg font-bold text-navy">Undergrad</Text>
            </View>
          </View>
        </View>
        
        {/* Skills */}
        <View className="px-4 pb-4">
          <Text className="text-base font-bold text-navy mb-3">
            Technical Skills Required
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {job.skillsRequired.map((skill, index) => (
              <View
                key={index}
                className="bg-teal-light rounded-full px-3 py-1.5 border border-teal">
                <Text className="text-xs font-medium text-teal-dark">
                  {skill}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View className="px-4 pb-4">
          <Text className="text-base font-bold text-navy mb-2">
            Role Description
          </Text>
          <Text className="text-sm text-gray-500 leading-6">
            {job.description}
          </Text>
        </View>

        {/* Key Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <View className="mx-4 mb-4 bg-white rounded-2xl p-5 border border-gray-200">
            <Text className="text-base font-bold text-navy mb-4">
              Key Responsibilities
            </Text>
            {job.responsibilities.map((item, index) => (
              <View key={index} className="flex-row gap-2 mb-3 items-start">
                <Text className="text-base mt-0.5">✅</Text>
                <Text className="flex-1 text-sm text-gray-500 leading-5">
                  {item}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Academic Requirements */}
        {job.academicRequirements && (
          <View className="px-4 pb-4">
            <Text className="text-base font-bold text-navy mb-2">
              Academic Requirements
            </Text>
            <Text className="text-sm text-gray-500 leading-6">
              {job.academicRequirements}
            </Text>
          </View>
        )}

        {/* Hero Image */}
        {job.imageUrl && (
          <View className="px-4 pb-4">
            <ImageBackground
              source={{ uri: job.imageUrl }}
              className="rounded-2xl overflow-hidden h-40 justify-end"
              imageStyle={{ borderRadius: 16 }}>
              <View className="bg-black/30 p-3 rounded-b-2xl">
                <Text className="text-xs font-semibold text-white">
                  {job.company.companyProfile?.companyName ?? 'Company'} •{' '}
                  {job.location ?? 'Global'}
                </Text>
              </View>
            </ImageBackground>
          </View>
        )}

        <View className="h-24" />
      </ScrollView>

      {/* Bottom Apply Bar */}
      <View className="absolute bottom-0 left-0 right-0 flex-row p-4 pb-7 bg-white border-t border-gray-100 gap-2">
        {existingApplication ? (
          <View className="flex-1 bg-gray-100 rounded-xl py-4 items-center">
            <Text className="text-gray-500 text-base font-bold">
              Already Applied · {existingApplication.status.charAt(0) + existingApplication.status.slice(1).toLowerCase()}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            className="flex-1 bg-navy rounded-xl py-4 items-center"
            onPress={handleOpenModal}>
            <Text className="text-white text-base font-bold">Apply Now →</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity className="px-4 rounded-xl border border-gray-200 items-center justify-center">
          <Text className="text-lg text-gray-500">⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Apply Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5" style={{ maxHeight: '90%' }}>
            <View className="flex-row justify-between items-start mb-5">
              <View>
                <Text className="text-xl font-bold text-navy">
                  Complete Application
                </Text>
                <Text className="text-sm text-gray-500 mt-0.5">
                  {job.company.companyProfile?.companyName} - {job.title}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-lg text-gray-500 p-1">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

              {/* CV */}
              <Text className="text-base font-bold text-navy mb-1">CV PDF</Text>
              <Text className="text-sm text-gray-500 mb-2 leading-5">
                Upload your latest professional curriculum vitae in PDF format.
              </Text>
              {cvDoc ? (
                <View className="flex-row items-center bg-teal-light rounded-xl p-3 mb-4 border border-teal">
                  <Text className="text-lg mr-2">📄</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-navy" numberOfLines={1}>
                      {cvDoc.fileName}
                    </Text>
                    <Text className="text-xs text-teal-dark">CV ready ✓</Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('UploadDocuments')}>
                    <Text className="text-xs text-navy font-semibold">Change</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  className="border border-gray-200 rounded-xl p-6 items-center mb-4"
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('UploadDocuments');
                  }}>
                  <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mb-2">
                    <Text className="text-xl">📄</Text>
                  </View>
                  <Text className="text-sm font-semibold text-navy mb-1">
                    Click to upload CV
                  </Text>
                  <Text className="text-xs text-gray-400">PDF max 5MB</Text>
                </TouchableOpacity>
              )}

              {/* Letter */}
              <Text className="text-base font-bold text-navy mb-1">
                University Endorsement Letter
              </Text>
              <Text className="text-sm text-gray-500 mb-2 leading-5">
                A signed letter from your Career Office confirming your academic
                eligibility.
              </Text>
              {letterDoc ? (
                <View className="flex-row items-center bg-teal-light rounded-xl p-3 mb-4 border border-teal">
                  <Text className="text-lg mr-2">✅</Text>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-navy" numberOfLines={1}>
                      {letterDoc.fileName}
                    </Text>
                    <Text className="text-xs text-teal-dark">Letter ready ✓</Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('UploadDocuments')}>
                    <Text className="text-xs text-navy font-semibold">Change</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  className="border border-gray-200 rounded-xl p-6 items-center mb-4"
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('UploadDocuments');
                  }}>
                  <View className="w-12 h-12 rounded-full bg-teal-light items-center justify-center mb-2">
                    <Text className="text-xl">✅</Text>
                  </View>
                  <Text className="text-sm font-semibold text-navy mb-1">
                    Click to upload Letter
                  </Text>
                  <Text className="text-xs text-gray-400">PDF, DOCX max 10MB</Text>
                </TouchableOpacity>
              )}

              {/* Cover Note */}
              <TextInput
                className="border border-gray-200 rounded-xl p-3 text-sm text-navy mb-4"
                placeholder="Add a cover note (optional)..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={{ minHeight: 80 }}
                value={coverNote}
                onChangeText={setCoverNote}
              />

              {/* Confirm */}
              <TouchableOpacity
                className="flex-row gap-2 mb-5 items-start"
                onPress={() => setConfirmed(!confirmed)}>
                <View className={`w-5 h-5 rounded border mt-0.5 items-center justify-center ${
                  confirmed ? 'bg-navy border-navy' : 'border-gray-300'
                }`}>
                  {confirmed && <Text className="text-white text-xs">✓</Text>}
                </View>
                <Text className="flex-1 text-xs text-gray-500 leading-5">
                  I confirm that all uploaded documents are authentic and up to
                  date according to university guidelines.
                </Text>
              </TouchableOpacity>

              {/* Buttons */}
              <TouchableOpacity
                className="border border-gray-200 rounded-full py-3.5 items-center mb-2">
                <Text className="text-sm font-semibold text-navy">
                  Save as Draft
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-navy rounded-xl py-4 items-center mb-4"
                onPress={handleApply}
                disabled={isApplying}>
                {isApplying ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-base font-bold">
                    Submit Application ➤
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default JobDetailScreen;
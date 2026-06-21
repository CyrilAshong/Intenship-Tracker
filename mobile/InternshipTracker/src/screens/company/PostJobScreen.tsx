import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createJob } from '../../services/companyService';

const jobTypes = ['FULL_TIME', 'PART_TIME', 'REMOTE'];

const PostJobScreen = ({ navigation }: any) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [responsibilitiesInput, setResponsibilitiesInput] = useState('');
  const [academicRequirements, setAcademicRequirements] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('FULL_TIME');
  const [isPaid, setIsPaid] = useState(true);
  const [stipend, setStipend] = useState('');
  const [duration, setDuration] = useState('');
  const [vacancies, setVacancies] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Error', 'Please fill in the title and description.');
      return;
    }

    try {
      setIsLoading(true);
      const skillsRequired = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const responsibilities = responsibilitiesInput
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await createJob({
        title,
        description,
        skillsRequired,
        responsibilities: responsibilities.length > 0 ? responsibilities : undefined,
        academicRequirements: academicRequirements || undefined,
        imageUrl: imageUrl || undefined,
        location: location || undefined,
        type,
        isPaid,
        stipend: isPaid && stipend ? parseFloat(stipend) : undefined,
        duration: duration || undefined,
        vacancies: parseInt(vacancies) || 1,
      });

      Alert.alert('Success', 'Internship posted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      const message = error.response?.data?.message ?? 'Failed to post job.';
      Alert.alert('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} className="px-4">

        <View className="flex-row items-center pt-14 pb-4 gap-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-2xl text-navy">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-navy">Post New Internship</Text>
        </View>

        <View className="bg-white rounded-2xl p-5 shadow-sm gap-4">

          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Job Title
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="e.g. Software Engineering Intern"
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Description
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="Describe the role and responsibilities..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={{ minHeight: 100 }}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Required Skills (comma separated)
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="React.js, Node.js, TypeScript"
              placeholderTextColor="#9ca3af"
              value={skillsInput}
              onChangeText={setSkillsInput}
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Key Responsibilities (one per line)
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder={'Develop and maintain front-end components...\nCollaborate with UX/UI designers...\nWrite unit and integration tests...'}
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 90 }}
              value={responsibilitiesInput}
              onChangeText={setResponsibilitiesInput}
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Academic Requirements
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="e.g. Currently pursuing a Bachelor's degree in Computer Science..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={{ minHeight: 70 }}
              value={academicRequirements}
              onChangeText={setAcademicRequirements}
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Hero Image URL (optional)
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="https://images.unsplash.com/..."
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              value={imageUrl}
              onChangeText={setImageUrl}
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Location
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="e.g. Accra, Ghana (Hybrid)"
              placeholderTextColor="#9ca3af"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Job Type
            </Text>
            <View className="flex-row gap-2">
              {jobTypes.map((t) => (
                <TouchableOpacity
                  key={t}
                  className={`flex-1 py-2.5 rounded-xl items-center border ${
                    type === t
                      ? 'bg-navy border-navy'
                      : 'border-gray-200'
                  }`}
                  onPress={() => setType(t)}>
                  <Text
                    className={`text-xs font-semibold ${
                      type === t ? 'text-white' : 'text-navy'
                    }`}>
                    {t.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Duration
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="e.g. 8-12 Weeks"
              placeholderTextColor="#9ca3af"
              value={duration}
              onChangeText={setDuration}
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Number of Vacancies
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="1"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              value={vacancies}
              onChangeText={setVacancies}
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-navy mb-2">
              Compensation
            </Text>
            <View className="flex-row gap-2 mb-3">
              <TouchableOpacity
                className={`flex-1 py-2.5 rounded-xl items-center border ${
                  isPaid ? 'bg-navy border-navy' : 'border-gray-200'
                }`}
                onPress={() => setIsPaid(true)}>
                <Text
                  className={`text-xs font-semibold ${
                    isPaid ? 'text-white' : 'text-navy'
                  }`}>
                  Paid
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-2.5 rounded-xl items-center border ${
                  !isPaid ? 'bg-navy border-navy' : 'border-gray-200'
                }`}
                onPress={() => setIsPaid(false)}>
                <Text
                  className={`text-xs font-semibold ${
                    !isPaid ? 'text-white' : 'text-navy'
                  }`}>
                  Unpaid
                </Text>
              </TouchableOpacity>
            </View>
            {isPaid && (
              <TextInput
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
                placeholder="Monthly stipend (GH₵)"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                value={stipend}
                onChangeText={setStipend}
              />
            )}
          </View>

          <TouchableOpacity
            className="bg-navy rounded-xl py-4 items-center mt-2"
            onPress={handleSubmit}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">
                Post Internship
              </Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PostJobScreen;
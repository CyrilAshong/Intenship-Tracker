import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const EditProfileScreen = ({ navigation }: any) => {
  const { user, setAuth } = useAuth();
  const profile = user?.studentProfile;

  const [firstName, setFirstName] = useState(profile?.firstName ?? '');
  const [lastName, setLastName] = useState(profile?.lastName ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [university, setUniversity] = useState(profile?.university ?? '');
  const [courseOfStudy, setCourseOfStudy] = useState(
    (profile as any)?.courseOfStudy ?? '',
  );
  const [yearOfStudy, setYearOfStudy] = useState(
    profile?.yearOfStudy ? profile.yearOfStudy.toString() : '',
  );
  const [skillsInput, setSkillsInput] = useState(
    profile?.skills ? profile.skills.join(', ') : '',
  );
  const [biography, setBiography] = useState(profile?.biography ?? '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const skills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const response = await api.patch('/auth/profile', {
        firstName,
        lastName,
        phone: phone || undefined,
        university: university || undefined,
        courseOfStudy: courseOfStudy || undefined,
        yearOfStudy: yearOfStudy ? parseInt(yearOfStudy) : undefined,
        skills,
        biography: biography || undefined,
      });

      const updatedUser = response.data.data;
      const savedToken = await (await import('expo-secure-store')).getItemAsync('token');
      setAuth(updatedUser, savedToken ?? '');

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      const message = error.response?.data?.message ?? 'Failed to update profile.';
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

        {/* Header */}
        <View className="flex-row items-center gap-3 pt-14 pb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-2xl text-navy">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-navy">Edit Profile</Text>
        </View>

        <View className="bg-white rounded-2xl p-5 shadow-sm gap-4">

          {/* First Name */}
          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              First Name
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="Enter your first name"
              placeholderTextColor="#9ca3af"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          {/* Last Name */}
          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Last Name
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="Enter your last name"
              placeholderTextColor="#9ca3af"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Phone */}
          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Phone Number
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="+233 XX XXX XXXX"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* University */}
          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              University
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="e.g. University of Ghana"
              placeholderTextColor="#9ca3af"
              value={university}
              onChangeText={setUniversity}
            />
          </View>

          {/* Course of Study */}
          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Course of Study
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="e.g. BSc Computer Science"
              placeholderTextColor="#9ca3af"
              value={courseOfStudy}
              onChangeText={setCourseOfStudy}
            />
          </View>

          {/* Year of Study */}
          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Year of Study
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="e.g. 3"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              value={yearOfStudy}
              onChangeText={setYearOfStudy}
            />
          </View>

          {/* Skills */}
          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Skills (comma separated)
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="React, Node.js, Python, TypeScript"
              placeholderTextColor="#9ca3af"
              value={skillsInput}
              onChangeText={setSkillsInput}
            />
          </View>

          {/* Biography */}
          <View>
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Biography
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-navy"
              placeholder="Tell companies a bit about yourself..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 90 }}
              value={biography}
              onChangeText={setBiography}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-navy rounded-xl py-4 items-center mt-2"
            onPress={handleSave}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Save Changes
              </Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;
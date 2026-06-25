import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import { uploadImageToCloudinary } from '../../services/cloudinaryService';
import api from '../../services/api';

const StudentProfileScreen = ({ navigation }: any) => {
  const { user, setAuth, logout } = useAuth();
  const profile = user?.studentProfile as any;
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleImageUpload = async (type: 'avatar' | 'cover') => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow access to your photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'] as any,
        allowsEditing: true,
        aspect: type === 'avatar' ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (result.canceled) return;

      const imageUri = result.assets[0].uri;

      if (type === 'avatar') setUploadingAvatar(true);
      else setUploadingCover(true);

      const url = await uploadImageToCloudinary(
        imageUri,
        type === 'avatar' ? 'avatars' : 'covers',
      );

      const response = await api.patch('/auth/profile', {
        ...(type === 'avatar' ? { avatarUrl: url } : { coverUrl: url }),
      });

      const updatedUser = response.data.data;
      const token = await (await import('expo-secure-store')).getItemAsync('token');
      setAuth(updatedUser, token ?? '');

      Alert.alert('Success', 'Photo updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'Failed to upload image.');
    } finally {
      setUploadingAvatar(false);
      setUploadingCover(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>

        {/* Header */}
        <View className="flex-row justify-between items-center px-4 pt-14 pb-3 bg-white border-b border-gray-100">
          <Text className="text-lg font-bold text-navy">🎓 UniIntern</Text>
          <View className="w-9 h-9 rounded-full bg-navy items-center justify-center overflow-hidden">
            {profile?.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
              />
            ) : (
              <Text className="text-sm font-bold text-white">
                {profile?.firstName?.charAt(0) ?? 'S'}
              </Text>
            )}
          </View>
        </View>

        {/* Cover Photo */}
        <TouchableOpacity
          onPress={() => handleImageUpload('cover')}
          disabled={uploadingCover}
          activeOpacity={0.9}>
          {profile?.coverUrl ? (
            <View>
              <Image
                source={{ uri: profile.coverUrl }}
                style={{ width: '100%', height: 128 }}
                resizeMode="cover"
              />
              <View className="absolute bottom-2 right-2 bg-black/40 rounded-full px-2 py-1">
                <Text className="text-white text-xs">✎ Edit cover</Text>
              </View>
            </View>
          ) : (
            <View className="w-full h-32 bg-gray-200 items-center justify-center">
              {uploadingCover ? (
                <ActivityIndicator color="#1a2b4a" />
              ) : (
                <Text className="text-xs text-gray-400">📷 Tap to add cover photo</Text>
              )}
            </View>
          )}
        </TouchableOpacity>

        {/* Avatar + Name */}
        <View className="items-center -mt-12 px-4">
          <TouchableOpacity
            onPress={() => handleImageUpload('avatar')}
            disabled={uploadingAvatar}
            activeOpacity={0.9}>
            <View className="w-24 h-24 rounded-full bg-navy items-center justify-center border-4 border-white overflow-hidden">
              {uploadingAvatar ? (
                <ActivityIndicator color="#fff" />
              ) : profile?.avatarUrl ? (
                <Image
                  source={{ uri: profile.avatarUrl }}
                  style={{ width: 96, height: 96, borderRadius: 48 }}
                />
              ) : (
                <Text className="text-3xl font-bold text-white">
                  {profile?.firstName?.charAt(0) ?? 'S'}
                </Text>
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-navy rounded-full w-7 h-7 items-center justify-center border-2 border-white">
              <Text className="text-white text-xs">📷</Text>
            </View>
          </TouchableOpacity>

          <Text className="text-xl font-bold text-navy mt-3">
            {profile?.firstName} {profile?.lastName}
          </Text>
          <Text className="text-sm text-gray-500">
            {profile?.university ?? 'University not set'}
          </Text>
          <Text className="text-sm text-gray-400 mb-3">
            {profile?.courseOfStudy ?? 'Course not set'}
            {profile?.yearOfStudy ? ` (Year ${profile.yearOfStudy})` : ''}
          </Text>
          <TouchableOpacity
            className="bg-navy rounded-full px-6 py-2.5"
            onPress={() => navigation.navigate('EditProfile')}>
            <Text className="text-sm font-semibold text-white">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 mt-6 gap-4">

          {/* Academic Overview */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-bold text-navy">Academic Overview</Text>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                <Text className="text-xs text-gray-400">✎ Edit</Text>
              </TouchableOpacity>
            </View>
            <View className="gap-3">
              <View className="flex-row justify-between items-center py-2.5 border-b border-gray-50">
                <Text className="text-sm text-gray-400">Course of Study</Text>
                <Text className="text-sm font-semibold text-navy">
                  {profile?.courseOfStudy ?? '—'}
                </Text>
              </View>
              <View className="flex-row justify-between items-center py-2.5 border-b border-gray-50">
                <Text className="text-sm text-gray-400">University</Text>
                <Text className="text-sm font-semibold text-navy">
                  {profile?.university ?? '—'}
                </Text>
              </View>
              <View className="flex-row justify-between items-center py-2.5">
                <Text className="text-sm text-gray-400">Year of Study</Text>
                <Text className="text-sm font-semibold text-navy">
                  {profile?.yearOfStudy ? `Year ${profile.yearOfStudy}` : '—'}
                </Text>
              </View>
            </View>
            {profile?.verificationStatus === 'VERIFIED' && (
              <View className="bg-teal-light rounded-lg py-2 px-3 flex-row items-center gap-2 mt-3">
                <Text className="text-sm">✅</Text>
                <Text className="text-xs font-semibold text-teal-dark">
                  Verified by Registrar
                </Text>
              </View>
            )}
          </View>

          {/* Technical Skills */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-bold text-navy">Technical Skills</Text>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                <Text className="text-xs text-gray-400">✎ Edit</Text>
              </TouchableOpacity>
            </View>
            {profile?.skills && profile.skills.length > 0 ? (
              <View className="flex-row flex-wrap gap-2">
                {profile.skills.map((skill: string, index: number) => (
                  <View key={index} className="bg-gray-100 rounded-full px-3 py-1.5">
                    <Text className="text-xs font-medium text-navy">{skill}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <TouchableOpacity
                className="border border-dashed border-gray-200 rounded-xl py-3 items-center"
                onPress={() => navigation.navigate('EditProfile')}>
                <Text className="text-sm text-gray-400">+ Add your skills</Text>
              </TouchableOpacity>
            )}
            <View className="h-px bg-gray-100 my-4" />
            <Text className="text-xs font-bold text-gray-400 tracking-wide mb-2">
              LANGUAGES
            </Text>
            <View className="flex-row items-center gap-1.5">
              <View className="w-2 h-2 rounded-full bg-teal" />
              <Text className="text-xs text-gray-500">English (Native)</Text>
            </View>
          </View>

          {/* Biography */}
          {profile?.biography ? (
            <View className="bg-white rounded-2xl p-5 shadow-sm">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-base font-bold text-navy">About Me</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                  <Text className="text-xs text-gray-400">✎ Edit</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-gray-500 leading-5">
                {profile.biography}
              </Text>
            </View>
          ) : null}

          {/* Experience & Projects */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-base font-bold text-navy mb-3">
              Experience &amp; Projects
            </Text>
            <View className="border border-dashed border-gray-200 rounded-xl py-4 items-center">
              <Text className="text-sm text-gray-400">
                Coming soon — add projects &amp; experience
              </Text>
            </View>
          </View>

          {/* Internship Interests */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-base font-bold text-navy mb-3">
              Internship Interests
            </Text>
            <View className="border border-dashed border-gray-200 rounded-xl py-4 items-center">
              <Text className="text-sm text-gray-400">
                Coming soon — add your internship interests
              </Text>
            </View>
          </View>

          {/* Documents */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-base font-bold text-navy mb-3">Documents</Text>
            <TouchableOpacity
              className="flex-row justify-between items-center bg-gray-50 rounded-xl p-3 mb-2"
              onPress={() => navigation.navigate('UploadDocuments')}>
              <View className="flex-row items-center gap-3">
                <Text className="text-lg">📄</Text>
                <View>
                  <Text className="text-sm font-semibold text-navy">Curriculum Vitae</Text>
                  <Text className="text-xs text-gray-400">Manage your CV</Text>
                </View>
              </View>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row justify-between items-center bg-gray-50 rounded-xl p-3"
              onPress={() => navigation.navigate('UploadDocuments')}>
              <View className="flex-row items-center gap-3">
                <Text className="text-lg">✅</Text>
                <View>
                  <Text className="text-sm font-semibold text-navy">
                    University Endorsement Letter
                  </Text>
                  <Text className="text-xs text-gray-400">Manage your letter</Text>
                </View>
              </View>
              <Text className="text-gray-400">→</Text>
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <TouchableOpacity
            className="bg-white rounded-2xl py-4 items-center border border-red-100"
            onPress={logout}>
            <Text className="text-sm font-semibold text-red-500">Logout</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

export default StudentProfileScreen;
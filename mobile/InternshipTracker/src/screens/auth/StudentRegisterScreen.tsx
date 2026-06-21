import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { registerStudent, saveToken } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const StudentRegisterScreen = ({ navigation }: any) => {
  const { setAuth } = useAuth();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    if (!fullName || !email) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setStep(2);
  };

  const handleRegister = async () => {
    if (!password) {
      Alert.alert('Error', 'Please enter a password.');
      return;
    }
    try {
      setIsLoading(true);
      const parts = fullName.trim().split(' ');
      const firstName = parts[0] ?? '';
      const lastName = parts.slice(1).join(' ') ?? '';
      const result = await registerStudent(
        email.trim(),
        password,
        firstName,
        lastName,
      );
      await saveToken(result.token);
      setAuth(result.user, result.token);
    } catch (error: any) {
      const message = error.response?.data?.message ?? 'Registration failed.';
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        className="px-5">

        {/* Header */}
        <View className="pt-14 pb-6">
          <Text className="text-lg font-bold text-navy">🎓 UniIntern</Text>
        </View>

        {/* Card */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <Text className="text-2xl font-bold text-navy text-center mb-1">
            Student Registration
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-6 leading-5">
            Join thousands of students finding their dream internships.
          </Text>

          {/* Step Indicator */}
          <View className="flex-row items-center mb-6">
            <View className="items-center">
              <View className="w-8 h-8 rounded-full bg-navy items-center justify-center">
                <Text className="text-white text-sm font-semibold">1</Text>
              </View>
              <Text className="text-xs font-bold text-navy mt-1 tracking-wide">
                IDENTITY
              </Text>
            </View>
            <View className="flex-1 h-px bg-gray-200 mx-3 mb-4" />
            <View className="items-center">
              <View className={`w-8 h-8 rounded-full items-center justify-center ${
                step === 2 ? 'bg-navy' : 'bg-gray-100 border border-gray-200'
              }`}>
                <Text className={`text-sm font-semibold ${
                  step === 2 ? 'text-white' : 'text-gray-400'
                }`}>2</Text>
              </View>
              <Text className={`text-xs font-bold mt-1 tracking-wide ${
                step === 2 ? 'text-navy' : 'text-gray-400'
              }`}>
                ACCOUNT
              </Text>
            </View>
          </View>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <View className="mb-4">
                <Text className="text-sm font-semibold text-navy mb-1.5">
                  Full Name
                </Text>
                <View className="flex-row items-center border border-gray-200 rounded-xl px-3 py-2.5 gap-2">
                  <Text className="text-sm">👤</Text>
                  <TextInput
                    className="flex-1 text-sm text-navy"
                    placeholder="Enter your full name"
                    placeholderTextColor="#9ca3af"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-sm font-semibold text-navy mb-1.5">
                  University Email
                </Text>
                <View className="flex-row items-center border border-gray-200 rounded-xl px-3 py-2.5 gap-2">
                  <Text className="text-sm">✉️</Text>
                  <TextInput
                    className="flex-1 text-sm text-navy"
                    placeholder="yourname@university.edu"
                    placeholderTextColor="#9ca3af"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <TouchableOpacity
                className="bg-navy rounded-xl py-3.5 items-center"
                onPress={handleContinue}>
                <Text className="text-white font-semibold text-base">
                  Continue
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <View className="mb-6">
                <Text className="text-sm font-semibold text-navy mb-1.5">
                  Password
                </Text>
                <View className="flex-row items-center border border-gray-200 rounded-xl px-3 py-2.5 gap-2">
                  <Text className="text-sm">🔒</Text>
                  <TextInput
                    className="flex-1 text-sm text-navy"
                    placeholder="Create a strong password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              <TouchableOpacity
                className="bg-navy rounded-xl py-3.5 items-center mb-3"
                onPress={handleRegister}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold text-base">
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center py-2"
                onPress={() => setStep(1)}>
                <Text className="text-sm text-gray-400">← Back</Text>
              </TouchableOpacity>
            </>
          )}

          <View className="h-px bg-gray-100 my-4" />

          <TouchableOpacity
            onPress={() => navigation.navigate('StudentLogin')}>
            <Text className="text-sm text-gray-500 text-center">
              Already have an account?{' '}
              <Text className="text-navy font-bold">Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center gap-6 pt-5">
          <Text className="text-xs text-gray-400">🛡️ Secure SSL</Text>
          <Text className="text-xs text-gray-400">🏛️ Accredited Inst.</Text>
        </View>
        <Text className="text-xs text-gray-400 text-center pt-3">
          © 2024 UniIntern Application Tracking System. All rights reserved.
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default StudentRegisterScreen;
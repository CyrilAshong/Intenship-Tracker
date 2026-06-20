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
import { useAuth } from '../../context/AuthContext';
import { loginUser, resendOTP, saveToken } from '../../services/authService';

const StudentLoginScreen = ({ navigation }: any) => {
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      setIsLoading(true);
      const { user, token } = await loginUser(email.trim(), password);
      if (user.role !== 'STUDENT') {
        Alert.alert('Error', 'This account is not a student account.');
        return;
      }
      await saveToken(token);
      setAuth(user, token);
    } catch (error: any) {
      const message =
        error.response?.data?.message ?? 'Login failed. Please try again.';
      if (message.toLowerCase().includes('verify your email')) {
        const normalizedEmail = email.trim();
        try {
          await resendOTP(normalizedEmail);
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'OTPVerification',
                params: {
                  email: normalizedEmail,
                  role: 'STUDENT',
                },
              },
            ],
          });
        } catch (resendError: any) {
          const resendMessage =
            resendError.response?.data?.message ??
            'Could not send a verification code. Please try again.';
          Alert.alert('Verification Email Failed', resendMessage);
        }
        return;
      }
      Alert.alert('Login Failed', message);
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
        <View className="flex-row justify-between items-center pt-14 pb-6">
          <Text className="text-lg font-bold text-navy">🎓 UniIntern</Text>
          <View className="w-10 h-10 rounded-full bg-white items-center justify-center border border-gray-200">
            <Text className="text-lg">🌐</Text>
          </View>
        </View>

        {/* Title */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-navy mb-1">
            Student Login
          </Text>
          <Text className="text-sm text-gray-500">
            Sign in to manage your professional journey
          </Text>
        </View>

        {/* Card */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">

          {/* Email */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Email
            </Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl px-3 pb-2.5 gap-2">
              <Text className="text-sm">✉️</Text>
              <TextInput
                className="flex-1 text-navy"
                placeholder="e.g. smith.j@university.edu"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Password
            </Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl px-3 pb-2.5 gap-2">
              <Text className="text-sm">🔒</Text>
              <TextInput
                className="flex-1 text-navy"
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text className="text-sm">{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember + Forgot */}
          <View className="flex-row justify-between items-center mb-5">
            <View className="flex-row items-center gap-2">
              <View className="w-4 h-4 border border-gray-300 rounded" />
              <Text className="text-xs text-gray-500">Remember me</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-xs font-bold text-navy">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="bg-navy rounded-xl py-3.5 items-center mb-4"
            onPress={handleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Login to Portal
              </Text>
            )}
          </TouchableOpacity>

          <View className="h-px bg-gray-100 my-3" />

          <Text className="text-sm text-gray-500 text-center mb-3">
            Don't have an account yet?
          </Text>
          <TouchableOpacity
            className="border border-gray-200 rounded-xl py-3 items-center"
            onPress={() => navigation.navigate('StudentRegister')}>
            <Text className="text-sm font-semibold text-navy">
              Apply for Student Access
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center gap-6 pt-6">
          <Text className="text-xs text-gray-400">Privacy Policy</Text>
          <Text className="text-xs text-gray-400">Support</Text>
          <Text className="text-xs text-gray-400">SSO Login</Text>
        </View>

        {/* Back */}
        <TouchableOpacity
          className="items-center pt-4"
          onPress={() => navigation.goBack()}>
          <Text className="text-xs text-gray-400">← Back to role selection</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default StudentLoginScreen;

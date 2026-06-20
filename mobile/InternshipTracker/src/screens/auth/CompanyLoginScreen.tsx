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

const CompanyLoginScreen = ({ navigation }: any) => {
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
      if (user.role !== 'COMPANY') {
        Alert.alert('Error', 'This account is not a company account.');
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
                  role: 'COMPANY',
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

        {/* Card */}
        <View className="bg-white rounded-2xl mt-16 p-6 shadow-sm">

          {/* Logo */}
          <View className="items-center mb-4">
            <View className="w-14 h-14 rounded-2xl bg-navy items-center justify-center mb-4">
              <Text className="text-2xl">🎓</Text>
            </View>
            <Text className="text-2xl font-bold text-navy mb-1">
              Company Login
            </Text>
            <Text className="text-sm text-gray-500">
              Sign in to your corporate account.
            </Text>
          </View>

          <View className="h-px bg-gray-100 mb-5" />

          {/* Email */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Work Email
            </Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl px-3 py-2.5 gap-2">
              <Text className="text-sm">✉️</Text>
              <TextInput
                className="flex-1 text-sm text-navy"
                placeholder="name@company.com"
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
            <View className="flex-row justify-between items-center mb-1.5">
              <Text className="text-sm font-semibold text-navy">Password</Text>
              <TouchableOpacity>
                <Text className="text-xs font-bold text-navy">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center border border-gray-200 rounded-xl px-3 py-2.5 gap-2">
              <Text className="text-sm">🔒</Text>
              <TextInput
                className="flex-1 text-sm text-navy"
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

          {/* Login Button */}
          <TouchableOpacity
            className="bg-navy rounded-xl py-3.5 items-center mb-5 mt-2"
            onPress={handleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Login to Portal →
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-4">
            <View className="flex-1 h-px bg-gray-100" />
            <Text className="text-xs text-gray-400 px-3">New partner?</Text>
            <View className="flex-1 h-px bg-gray-100" />
          </View>

          {/* Register */}
          <TouchableOpacity
            className="border border-gray-200 rounded-xl py-3 items-center mb-4"
            onPress={() => navigation.navigate('CompanyRegister')}>
            <Text className="text-sm font-semibold text-navy">
              Register your Company
            </Text>
          </TouchableOpacity>

          {/* Student portal link */}
          <TouchableOpacity
            className="items-center"
            onPress={() => navigation.navigate('StudentLogin')}>
            <Text className="text-sm text-gray-500">
              Looking for the student portal?{' '}
              <Text className="text-teal font-bold">Click here</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="items-center pt-6">
          <Text className="text-xs text-gray-400 tracking-widest">
            UNIVERSITY VERIFIED PORTAL • © 2024
          </Text>
          <Text className="text-xs font-bold text-gray-400 tracking-widest">
            UNIINTERN
          </Text>
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

export default CompanyLoginScreen;

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
import { resendOTP, saveToken, verifyOTP } from '../../services/authService';
import { Role } from '../../types';

interface OTPVerificationParams {
  email: string;
  role: Role;
}

const OTPVerificationScreen = ({ navigation, route }: any) => {
  const { setAuth } = useAuth();
  const { email, role } = route.params as OTPVerificationParams;
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    const code = otp.trim();
    if (code.length !== 6) {
      Alert.alert('Invalid code', 'Please enter the 6-digit code from your email.');
      return;
    }

    try {
      setIsVerifying(true);
      const { user, token } = await verifyOTP(email, code);
      await saveToken(token);
      setAuth(user, token);
    } catch (error: any) {
      const message =
        error.response?.data?.message ?? 'Verification failed. Please try again.';
      Alert.alert('Verification Failed', message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      await resendOTP(email);
      Alert.alert('Code sent', 'A new verification code has been sent to your email.');
    } catch (error: any) {
      const message =
        error.response?.data?.message ?? 'Could not resend the verification code.';
      Alert.alert('Resend Failed', message);
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    navigation.navigate(role === 'STUDENT' ? 'StudentRegister' : 'CompanyRegister');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 40 }}
        className="px-5">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <View className="items-center mb-6">
            <View className="w-14 h-14 rounded-2xl bg-navy items-center justify-center mb-4">
              <Text className="text-white text-2xl font-bold">@</Text>
            </View>
            <Text className="text-2xl font-bold text-navy text-center mb-2">
              Verify your email
            </Text>
            <Text className="text-sm text-gray-500 text-center leading-5">
              Enter the 6-digit code we sent to {email}.
            </Text>
          </View>

          <View className="mb-5">
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Verification Code
            </Text>
            <View className="border border-gray-200 rounded-xl px-4 py-3">
              <TextInput
                className="text-2xl tracking-widest text-center text-navy font-bold"
                placeholder="000000"
                placeholderTextColor="#d1d5db"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={(value) => setOtp(value.replace(/\D/g, ''))}
              />
            </View>
          </View>

          <TouchableOpacity
            className="bg-navy rounded-xl py-3.5 items-center mb-3"
            onPress={handleVerify}
            disabled={isVerifying}>
            {isVerifying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Verify and Continue
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="border border-gray-200 rounded-xl py-3 items-center mb-3"
            onPress={handleResend}
            disabled={isResending}>
            {isResending ? (
              <ActivityIndicator color="#1a2b4a" />
            ) : (
              <Text className="text-sm font-semibold text-navy">
                Resend Code
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center py-2"
            onPress={handleChangeEmail}>
            <Text className="text-sm text-gray-400">Use a different email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default OTPVerificationScreen;

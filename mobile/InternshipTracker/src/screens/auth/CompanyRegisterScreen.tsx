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
import { registerCompany, saveToken } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Engineering',
  'Marketing',
  'Legal',
  'Consulting',
  'Other',
];

const CompanyRegisterScreen = ({ navigation }: any) => {
  const { setAuth } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [industry, setIndustry] = useState('');
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!companyName || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    try {
      setIsLoading(true);
      const result = await registerCompany(email.trim(), password, companyName);
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
        <View className="flex-row justify-between items-center pt-14 pb-6">
          <Text className="text-lg font-bold text-navy">🎓 UniIntern</Text>
          <View className="w-10 h-10 rounded-full bg-navy items-center justify-center">
            <Text className="text-lg">🏢</Text>
          </View>
        </View>

        {/* Card */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <Text className="text-2xl font-bold text-navy mb-1">
            Register your Company
          </Text>
          <Text className="text-sm text-gray-500 mb-6">
            Partner with us to find top university talent.
          </Text>

          {/* Company Name */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Company Name
            </Text>
            <View className="border border-gray-200 rounded-xl px-3 py-2.5">
              <TextInput
                className="text-sm text-navy"
                placeholder="e.g. Acme Corporation"
                placeholderTextColor="#9ca3af"
                value={companyName}
                onChangeText={setCompanyName}
              />
            </View>
          </View>

          {/* Contact Person */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Contact Person
            </Text>
            <View className="border border-gray-200 rounded-xl px-3 py-2.5">
              <TextInput
                className="text-sm text-navy"
                placeholder="Full Name"
                placeholderTextColor="#9ca3af"
                value={contactPerson}
                onChangeText={setContactPerson}
              />
            </View>
          </View>

          {/* Work Email */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Work Email
            </Text>
            <View className="border border-gray-200 rounded-xl px-3 py-2.5">
              <TextInput
                className="text-sm text-navy"
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
          <View className="mb-4">
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Password
            </Text>
            <View className="border border-gray-200 rounded-xl px-3 py-2.5">
              <TextInput
                className="text-sm text-navy"
                placeholder="Create a strong password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {/* Industry */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-navy mb-1.5">
              Industry
            </Text>
            <TouchableOpacity
              className="flex-row justify-between items-center border border-gray-200 rounded-xl px-3 py-2.5"
              onPress={() => setShowIndustryPicker(!showIndustryPicker)}>
              <Text className={`text-sm ${industry ? 'text-navy' : 'text-gray-400'}`}>
                {industry || 'Select Industry'}
              </Text>
              <Text className="text-gray-400">▾</Text>
            </TouchableOpacity>

            {showIndustryPicker && (
              <View className="border border-gray-200 rounded-xl mt-1 bg-white overflow-hidden">
                {industries.map((item) => (
                  <TouchableOpacity
                    key={item}
                    className="px-3 py-2.5 border-b border-gray-100"
                    onPress={() => {
                      setIndustry(item);
                      setShowIndustryPicker(false);
                    }}>
                    <Text className="text-sm text-navy">{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            className="bg-navy rounded-xl py-3.5 items-center mb-4"
            onPress={handleRegister}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Create Partner Account →
              </Text>
            )}
          </TouchableOpacity>

          <View className="h-px bg-gray-100 my-3" />

          <TouchableOpacity
            onPress={() => navigation.navigate('CompanyLogin')}>
            <Text className="text-sm text-gray-500 text-center">
              Already have a corporate account?{' '}
              <Text className="text-navy font-bold">Log in</Text>
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center gap-2 mt-3">
            <TouchableOpacity>
              <Text className="text-xs text-gray-400">Privacy Policy</Text>
            </TouchableOpacity>
            <Text className="text-xs text-gray-400">•</Text>
            <TouchableOpacity>
              <Text className="text-xs text-gray-400">Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Trust */}
        <View className="items-center pt-6">
          <Text className="text-sm font-semibold text-navy text-center">
            Trusted by the top 50 universities nationwide.
          </Text>
        </View>

        <View className="items-center pt-4">
          <Text className="text-xs text-gray-400">
            🏛️ Official University Career Network Partner
          </Text>
          <Text className="text-xs text-gray-400 mt-1">
            © 2024 UniIntern Systems. All professional rights reserved.
          </Text>
        </View>

        {/* Back */}
        <TouchableOpacity
          className="items-center pt-4"
          onPress={() => navigation.goBack()}>
          <Text className="text-xs text-gray-400">← Back</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CompanyRegisterScreen;
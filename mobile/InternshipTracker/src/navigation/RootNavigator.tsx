import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import CompanyProfileScreen from '../screens/student/CompanyProfileScreen';
import { useAuth } from '../context/AuthContext';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import ChooseRoleScreen from '../screens/auth/ChooseRoleScreen';
import StudentLoginScreen from '../screens/auth/StudentLoginScreen';
import StudentRegisterScreen from '../screens/auth/StudentRegisterScreen';
import CompanyLoginScreen from '../screens/auth/CompanyLoginScreen';
import CompanyRegisterScreen from '../screens/auth/CompanyRegisterScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';

import StudentTabNavigator from './StudentTabNavigator';
import JobDetailScreen from '../screens/student/JobDetailScreen';
import EditProfileScreen from '../screens/student/EditProfileScreen';
import UploadDocumentsScreen from '../screens/student/UploadDocumentsScreen';


import CompanyTabNavigator from './CompanyTabNavigator';
import ReviewApplicantsScreen from '../screens/company/ReviewApplicantsScreen';
import PostJobScreen from '../screens/company/PostJobScreen';   

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#1a2b4a" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="ChooseRole" component={ChooseRoleScreen} />
            <Stack.Screen name="StudentLogin" component={StudentLoginScreen} />
            <Stack.Screen name="StudentRegister" component={StudentRegisterScreen} />
            <Stack.Screen name="CompanyLogin" component={CompanyLoginScreen} />
            <Stack.Screen name="CompanyRegister" component={CompanyRegisterScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          </>
        ) : user.role === 'STUDENT' ? (
          <>
            <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
            <Stack.Screen name="JobDetail" component={JobDetailScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="UploadDocuments" component={UploadDocumentsScreen} />
            <Stack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="CompanyTabs" component={CompanyTabNavigator} />
            <Stack.Screen name="ReviewApplicants" component={ReviewApplicantsScreen} />
            <Stack.Screen name="PostJob" component={PostJobScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import ChooseRoleScreen from '../screens/auth/ChooseRoleScreen';
import StudentLoginScreen from '../screens/auth/StudentLoginScreen';
import StudentRegisterScreen from '../screens/auth/StudentRegisterScreen';
import CompanyLoginScreen from '../screens/auth/CompanyLoginScreen';
import CompanyRegisterScreen from '../screens/auth/CompanyRegisterScreen';

import StudentDashboard from '../screens/student/StudentDashboard';
import CompanyDashboard from '../screens/company/CompanyDashboard';

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
          </>
        ) : user.role === 'STUDENT' ? (
          <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
        ) : (
          <Stack.Screen name="CompanyDashboard" component={CompanyDashboard} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
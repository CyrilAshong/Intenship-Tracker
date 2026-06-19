import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80' }}
      className="flex-1"
      resizeMode="cover">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-navy/80 px-6 pt-20 pb-6 justify-between">

        {/* Logo */}
        <View className="items-center">
          <View className="w-20 h-20 rounded-2xl bg-white/20 items-center justify-center mb-3 border border-white/30">
            <Text className="text-4xl">🎓</Text>
          </View>
          <Text className="text-3xl font-bold text-white tracking-wide">
            UniIntern
          </Text>
        </View>

        {/* Hero */}
        <View className="items-center">
          <Text className="text-3xl font-bold text-white text-center leading-10 mb-4">
            Your Professional Journey Starts Here.
          </Text>
          <Text className="text-sm text-white/75 text-center leading-6">
            The exclusive gateway for university students to secure prestigious
            vacation internships and track their corporate career milestones.
          </Text>
        </View>

        {/* Buttons */}
        <View className="gap-3">
          <TouchableOpacity
            className="bg-white rounded-xl py-4 items-center"
            onPress={() => navigation.navigate('ChooseRole')}>
            <Text className="text-navy font-semibold text-base">
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white/15 rounded-xl py-4 items-center border border-white/30"
            onPress={() => navigation.navigate('ChooseRole')}>
            <Text className="text-white font-semibold text-base">Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around pt-4 border-t border-white/20">
          <View className="items-center">
            <Text className="text-base">🛡️</Text>
            <Text className="text-xs text-white/60 font-semibold tracking-wide mt-1">
              SECURE APPLY
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-base">🎓</Text>
            <Text className="text-xs text-white/60 font-semibold tracking-wide mt-1">
              STUDENT LED
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-base">📈</Text>
            <Text className="text-xs text-white/60 font-semibold tracking-wide mt-1">
              CAREER GROWTH
            </Text>
          </View>
        </View>

      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';

const UploadDocumentsScreen = ({ navigation }: any) => {
  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 pt-14 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-2xl text-navy">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-navy">My Documents</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

        {/* CV Section */}
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-bold text-navy">📄 Curriculum Vitae</Text>
            <TouchableOpacity className="bg-navy rounded-full px-4 py-2">
              <Text className="text-xs font-semibold text-white">+ Upload</Text>
            </TouchableOpacity>
          </View>
          <View className="border border-dashed border-gray-200 rounded-xl py-6 items-center">
            <Text className="text-sm text-gray-400">No CV uploaded yet</Text>
          </View>
        </View>

        {/* Letter Section */}
        <View className="bg-white rounded-2xl p-5 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-base font-bold text-navy">✉️ Endorsement Letter</Text>
            <TouchableOpacity className="bg-navy rounded-full px-4 py-2">
              <Text className="text-xs font-semibold text-white">+ Upload</Text>
            </TouchableOpacity>
          </View>
          <View className="border border-dashed border-gray-200 rounded-xl py-6 items-center">
            <Text className="text-sm text-gray-400">No letter uploaded yet</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default UploadDocumentsScreen;
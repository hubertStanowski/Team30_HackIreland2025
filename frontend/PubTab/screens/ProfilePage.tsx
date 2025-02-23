import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_COLOR, PURPLE, SERVER_URL } from "../constants.ts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const ProfilePage = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Placeholder for logout request
      await AsyncStorage.removeItem('token');
      navigation.replace('LoginPage');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <Ionicons name="person-circle" size={60} color="white" />
        <Text style={styles.username}>Username</Text>
      </View>

      {/* Change Password */}
      <TouchableOpacity style={styles.rowSegment} onPress={() => navigation.navigate('ChangePasswordPage')}>
        <Ionicons name="help-circle-outline" size={30} color="white" />
        <Text style={styles.segmentText}>Change Password</Text>
      </TouchableOpacity>

      {/* Tab History */}
      <TouchableOpacity style={styles.rowSegment} onPress={() => navigation.navigate('TabHistoryPage')}>
        <MaterialIcons name="history" size={30} color="white" />
        <Text style={styles.segmentText}>Tab History</Text>
      </TouchableOpacity>

      {/* Log Out */}
      <TouchableOpacity style={styles.rowSegment} onPress={handleLogout}>
        <MaterialIcons name="logout" size={30} color="white" />
        <Text style={styles.segmentText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  rowSegment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PURPLE,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '80%',
    marginVertical: 10,
  },
  segmentText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 15,
  },
});

export default ProfilePage;

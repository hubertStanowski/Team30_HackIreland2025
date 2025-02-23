import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { PRIMARY_COLOR, PURPLE, SERVER_URL } from "../constants.ts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const ProfilePage = () => {
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [isHistoryModalVisible, setHistoryModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      Alert.alert('Logged Out', 'You have been logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <Icon name="person-circle" size={60} color="white" />
        <Text style={styles.username}>Username</Text>
      </View>

      {/* Change Password */}
      <TouchableOpacity style={styles.rowSegment} onPress={() => setPasswordModalVisible(true)}>
        <Icon name="help-circle-outline" size={30} color="white" />
        <Text style={styles.segmentText}>Change Password</Text>
      </TouchableOpacity>

      {/* Tab History */}
      <TouchableOpacity style={styles.rowSegment} onPress={() => setHistoryModalVisible(true)}>
        <MaterialIcon name="history" size={30} color="white" />
        <Text style={styles.segmentText}>Tab History</Text>
      </TouchableOpacity>

      {/* Log Out */}
      <TouchableOpacity style={styles.rowSegment} onPress={handleLogout}>
        <MaterialIcon name="logout" size={30} color="white" />
        <Text style={styles.segmentText}>Log Out</Text>
      </TouchableOpacity>

      {/* Change Password Modal */}
      <Modal visible={isPasswordModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
            <Icon name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <TextInput
            placeholder="Old Password"
            secureTextEntry
            style={styles.input}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TextInput
            placeholder="New Password"
            secureTextEntry
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Tab History Modal */}
      <Modal visible={isHistoryModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setHistoryModalVisible(false)}>
            <Icon name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.segmentText}>Tab History will be displayed here</Text>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 10,
    width: 250,
    borderRadius: 5,
  },
  confirmButton: {
    backgroundColor: PURPLE,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfilePage;

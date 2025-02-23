import React, { useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { PRIMARY_COLOR, PURPLE, SERVER_URL } from '../constants.ts';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import LoginScreen from './LoginScreen.tsx';

const ProfilePage = () => {
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [isHistoryModalVisible, setHistoryModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [tabHistory, setTabHistory] = useState([]);

  const handleLogout = async () => {
    try {
      await fetch(`${SERVER_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      LoginScreen();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      await fetch(`${SERVER_URL}/auth/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });
      Alert.alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleTabHistory = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/pubs/history/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setTabHistory(data.history || []);
    } catch (error) {
      console.error('Error getting tab history:', error);
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
      <TouchableOpacity style={styles.rowSegment} onPress={() => {
        setHistoryModalVisible(true);
        handleTabHistory();
      }}>
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
          <TouchableOpacity style={styles.confirmButton} onPress={handlePasswordChange}>
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
          <Text style={styles.segmentText}>Tab History</Text>
          <ScrollView style={styles.historyContainer}>
            {tabHistory.length > 0 ? (
              tabHistory.map((item, index) => (
                <Text key={index} style={styles.historyText}>{item}</Text>
              ))
            ) : (
              <Text style={styles.historyText}>No history available.</Text>
            )}
          </ScrollView>
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
  historyContainer: {
    marginTop: 10,
    maxHeight: 300,
  },
  historyText: {
    color: 'white',
    fontSize: 16,
    marginVertical: 5,
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

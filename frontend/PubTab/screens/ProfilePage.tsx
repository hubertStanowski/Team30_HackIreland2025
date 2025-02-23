import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Alert, Modal, TextInput, ScrollView, TouchableOpacity} from 'react-native';
import { PRIMARY_COLOR, PURPLE, SERVER_URL } from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ProfilePage = () => {
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${SERVER_URL}/auth/user/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUsername(data.username);
          setEmail(data.email);
        } else {
          Alert.alert('Error', data.error || 'An error occurred');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${SERVER_URL}/auth/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      navigation.navigate('LoginScreen');
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

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Icon name="person-circle" size={60} color="white" />
        <Text style={styles.username}>{username}</Text>
      </View>
      <Text style={styles.username}>{email}</Text>

      <Button icon="help-circle-outline" mode="contained" onPress={() => setPasswordModalVisible(true)}>
        Change Password
      </Button>

      <Divider style={{ marginTop: 15, marginBottom: 15 }} />

      <Button icon="history" mode="contained" onPress={() => navigation.navigate('TabHistoryPage')}>
        Tab History
      </Button>

      <Divider style={{ marginTop: 15, marginBottom: 15 }} />

      <Button icon="logout" mode="contained" onPress={handleLogout}>
        Log Out
      </Button>

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
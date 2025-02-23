import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PRIMARY_COLOR, ACCENT_COLOR_2, ACCENT_COLOR_1 } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://pubtab.eu.pythonanywhere.com/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('token', data.token);
        navigation.navigate('Main');
        // Alert.alert('Login Successful', 'You have successfully logged in');
      } else {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          Alert.alert('Login Failed', errorData.error || 'An error occurred during login');
        } else {
          const errorText = await response.text();
          Alert.alert('Login Failed', errorText || 'An error occurred during login');
        }
      }
    } catch (error) {
      Alert.alert('Login Failed', (error as Error).message || 'App error');
      //console.error('Login error', error);
    }
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header (Icon + Title) */}
          <View style={styles.header}>
            <Ionicons name="beer-outline" size={40} color={ACCENT_COLOR_2} />
            <Text style={styles.title}>PubTab</Text>
          </View>

          <Text style={styles.secondtitle}>Log in</Text>

          <TextInput
            label="Username"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Login
          </Button>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: ACCENT_COLOR_2,
    marginLeft: 10, // Space between icon and text
  },
  secondtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '100%', // Ensure full width
    marginBottom: 15,
  },
  button: {
    width: '100%', // Ensure button is properly centered
    marginTop: 10,
  },
  link: {
    marginTop: 15,
    color: 'gold',
    textAlign: 'center',
  },
});

export default LoginScreen;
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import {PRIMARY_COLOR, PURPLE, SERVER_URL} from "../constants.ts";
import AsyncStorage from '@react-native-async-storage/async-storage';


const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      // Token exists
      console.log('Token:', token);
      return token;
    } else {
      // Token does not exist
      console.log('No token found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

const openTab = async () => {
  try {
    const token = await getToken();
    // Alert.alert('Token:', token || 'No token found');
    if (!token) {
      console.error('No token available');
      return;
    }
    const response = await fetch(`${SERVER_URL}/tabs/open/`, {
      method: 'POST',
      headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      table: 1, // Replace with actual table ID
      total: 10, // Replace with actual total amount
      limit: 10, // Replace with actual limit if any
      }),
    });
    const data = await response.json();
    Alert.alert('Tab opened', `Response: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error('Error opening tab:', error);
  }
};

const HomePage = () => {
  const [initialized, setInitialized] = useState(false);
  return (
    <View style={styles.container}>
      {initialized ? (
      <Text style={[styles.text, { fontSize: 60 }]}>Welcome to HomePage</Text>
      ) : (
       <View style={{ backgroundColor: PURPLE, paddingVertical: 20, paddingHorizontal: 60, borderRadius: 50 }}>
        <Button
        title="Open Tab"
        onPress={() => openTab()}
        color="#FFFFFF"
        />
        </View> 
      )}
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
  text: {
    fontSize: 45,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HomePage;
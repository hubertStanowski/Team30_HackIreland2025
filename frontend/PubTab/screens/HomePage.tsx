import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { PRIMARY_COLOR, PURPLE, SERVER_URL } from "../constants.ts";
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      console.log('Token:', token);
      return token;
    } else {
      console.log('No token found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// const getTab = async () => {
//   try {
//     const token = await AsyncStorage.getItem('tab');
//     if (token !== null) {
//       console.log('Tab:', token);
//       return token;
//     } else {
//       console.log('No tab found');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error retrieving tab:', error);
//     return null;
//   }
// };



interface HomePageProps {
  reset: boolean;
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdate: (value: number) => void;
  setTabInitialized:  (value: boolean) => void;
  selectedPub: number;
  setSelectedPub: React.Dispatch<React.SetStateAction<number>>;
}

const HomePage: React.FC<HomePageProps> = ({ reset, setReset, setUpdate, setTabInitialized, selectedPub, setSelectedPub }) => {
  const openTab = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error('No token available');
        return;
      }
      // Adjust payload: only send table and limit.
      const response = await fetch(`${SERVER_URL}/tabs/open/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table: 1,  // Replace with the actual table ID
          limit: 10, // Replace with the actual limit if needed
        }),
      });
      
      const data = await response.json();
      if (data && data.id) {
        await AsyncStorage.setItem('tab', data.id.toString());
      }
  
      setInitialized(true);
      setTabInitialized(true);
      setReset(false);
      setUpdate(Math.random());
     
      if (response.ok) {
        Alert.alert('Tab Opened1', `Response: ${JSON.stringify(data)}`);
      } else {
        Alert.alert('Error', data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error opening tab:', error);
      Alert.alert('Error', 'Could not open tab. Please try again later.');
    }
  };

  useEffect(() => { 
    if (reset) {
      setInitialized(false);
      setTabInitialized(false)
    }
  }, [reset]);

  const [initialized, setInitialized] = useState(false);
  return (
    <View style={styles.container}>
      {initialized ? (
        <Text style={[styles.text, { fontSize: 70 }]}>Welcome to HomePage</Text>
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
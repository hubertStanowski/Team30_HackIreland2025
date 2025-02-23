import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Appbar, Text, Divider } from 'react-native-paper';
import { SERVER_URL } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabHistoryPage = ({ navigation }: { navigation: any }) => {
  const [tabHistory, setTabHistory] = useState([]);

  useEffect(() => {
    const fetchTabHistory = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${SERVER_URL}/tabs/history/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        const contentType = response.headers.get('Content-Type');
        console.log('Content-Type:', contentType);

        if (!response.ok) {
          throw new Error("Failed to fetch tab history");
        }

        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setTabHistory(data.tabs || []);
        } else {
          const text = await response.text();
          console.error('Unexpected response body:', text);
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching tab history:', error);
      }
    };

    fetchTabHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Tab History" />
      </Appbar.Header>
      <ScrollView style={styles.historyContainer}>
        {tabHistory.length > 0 ? (
          tabHistory.map((item, index) => (
            <View key={index} style={styles.tabItem}>
              <Text style={styles.historyText}>{item.pub}</Text>
              <Text style={styles.historyText}>Table {item.table}</Text>
              <Text style={styles.historyText}>Total: €{item.total}</Text>
              <Text style={styles.historyText}>Limit: {item.limit}</Text>
              <Text style={styles.historyText}>{item.paid ? 'Paid correctly' : 'There was an error in the payment'}</Text>
              <Text style={styles.historyText}>Tab created the {new Date(item.created).toLocaleString()}</Text>
              <Divider />
            </View>
          ))
        ) : (
          <Text style={styles.historyText}>No history available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  historyContainer: {
    padding: 20,
  },
  tabItem: {
    marginBottom: 20,
  },
  historyText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default TabHistoryPage;
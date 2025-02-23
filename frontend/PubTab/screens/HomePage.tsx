import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Modal, FlatList, TouchableOpacity } from 'react-native';
import { PRIMARY_COLOR, PURPLE, SERVER_URL, ACCENT_COLOR_2 } from "../constants.ts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Divider} from "react-native-paper";

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};
interface HomePageProps {
  reset: boolean;
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdate: (value: number) => void;
  setTabInitialized: (value: boolean) => void;
  selectedPub: number;
  setSelectedPub: React.Dispatch<React.SetStateAction<number>>;
  pubName: string;
}

const HomePage: React.FC<HomePageProps> = ({ reset, setReset, setUpdate, setTabInitialized, selectedPub, setSelectedPub, pubName }) => {
  const [initialized, setInitialized] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const openTab = async (tableId: number) => {
    try {
      const token = await getToken();
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
          table: tableId,
          limit: 10,
        }),
      });

      const data = await response.json();
      if (data && data.id) {
        await AsyncStorage.setItem('tab', data.id.toString());
      }

      setSelectedTable(tableId);
      setInitialized(true);
      setTabInitialized(true);
      setReset(false);
      setUpdate(Math.random());

      if (response.ok) {
        Alert.alert('Tab Opened', `Table ${tableId} selected`);
      } else {
        Alert.alert('Error', data.error || 'An error occurred');
      }

      setModalVisible(false); // Close modal after selection
    } catch (error) {
      console.error('Error opening tab:', error);
      Alert.alert('Error', 'Could not open tab. Please try again later.');
    }
  };

const fetchTables = async () => {
  if (!selectedPub) {
    console.error("No pub selected");
    return;
  }

  try {
    console.log(`Fetching tables for pub: ${selectedPub}`);
    const response = await fetch(`${SERVER_URL}/pubs/${selectedPub}`);
    const data = await response.json();

    console.log("Raw API Response:", JSON.stringify(data, null, 2)); // ✅ Log full response


    if (!Array.isArray(data)) {
      console.error("Invalid response structure: Expected an array, got", data);
      return;
    }


    const availableTables = data.filter((table: any) => !table.busy);
    setTables(availableTables);
  } catch (error) {
    console.error("Error fetching tables:", error);
  }
};

  useEffect(() => {
    if (modalVisible) {
      fetchTables();
    }
  }, [modalVisible]);

  useEffect(() => {
    if (reset) {
      setInitialized(false);
      setTabInitialized(false);
      setSelectedTable(null);
    }
  }, [reset]);

  return (
    <View style={styles.container}>
      {initialized && selectedTable !== null ? (
        <View>
            <Text style={styles.pubText}>Welcome {pubName ? `to ${pubName}` : ''}</Text>
          <Divider style={{ marginTop: 15, marginBottom: 15 }} />
          <Text style={styles.tableText}>Table {selectedTable}</Text>
          <Divider style={{ marginTop: 15, marginBottom: 15 }} />
          <Text style={styles.subtitle}>Your tab is now opened, close it when you are ready to leave.</Text>
        </View>
      ) : (
        <View style={styles.openTabButton}>
          <Button title="Open Tab" onPress={() => setModalVisible(true)} color="#FFFFFF" />
        </View>
      )}

      {/* Table Selection Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Table</Text>
            {tables.length === 0 ? (
              <Text style={styles.noTablesText}>No available tables</Text>
            ) : (
              <FlatList
                data={tables}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.tableItem} onPress={() => openTab(item.id)}>
                    <Text style={styles.tableItemText}>Table {item.id}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  openTabButton: {
    backgroundColor: PURPLE,
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 50,
  },
  pubText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ACCENT_COLOR_2,
    textAlign: 'center',
    marginBottom: 10,
  },
  tableText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#FFFFFF",
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tableItem: {
    padding: 15,
    backgroundColor: PURPLE,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  tableItemText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  noTablesText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: 'center',
    marginTop: 10,
  }
});

export default HomePage;
import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking, ScrollView, Alert, Button } from 'react-native';
import {ACCENT_COLOR_1, ACCENT_COLOR_2, PRIMARY_COLOR, PURPLE, SERVER_URL} from "../constants.ts";
import { useEffect } from 'react';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Product {
  name: string;
  description: string;
  price: string;
  drink_type: string;
  image: string | null;
}

const getTab = async () => {
  try {
    const token = await AsyncStorage.getItem('tab');
    if (token !== null) {
      console.log('Tab:', token);
      return token;
    } else {
      console.log('No tab found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving tab:', error);
    return null;
  }
};

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


const addToTab = async (product: Product) => {
  try {
    const token = await getToken();
      if (!token) {
        console.error('No token available');
        return;
      }
    const tab = await getTab();
    if (tab !== null) {
      const response = await fetch(`${SERVER_URL}/tabs/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ tab_id: tab, drink: product.name, quantity: 1 }),
      });
      const data = await response.json();
      Alert.alert('Add to Tab', `Response: ${JSON.stringify(data)}`);
    } else {
      Alert.alert('Add to Tab', 'No tab found');
    }
  } catch (error) {
    console.error('Error adding item to tab:', error);
  }
}

const MenuPage = () => {
  const [itemList, setItemList] = useState<Product[]>([]);

  useEffect(() => {
    const fetchPubs = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/pubs/items/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pub_id: 1 }),
        });
        const data = await response.json();
        Alert.alert('Menu Items', `Response: ${JSON.stringify(data)}`);
        setItemList(data.products);
      } catch (error) {
        console.error('Error fetching pub list:', error);
      }
    };

    fetchPubs();
  }, []);


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {itemList.map((product, index) => (
          <Card key={index} style={styles.item}>
        <Card.Title titleStyle={styles.itemTitleText} title={product.name} />
        <Card.Content>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.itemText}>Name: {product.name}</Text>
            <Text style={styles.itemText}>Description: {product.description}</Text>
            <Text style={styles.itemText}>Price: {product.price}</Text>
            <Text style={styles.itemText}>Drink Type: {product.drink_type}</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            title="+"
            onPress={() => addToTab(product)}
          />
        </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </View>
  );

};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
  },
  item: {
    marginVertical: 5,
    width: '95%',
    backgroundColor: ACCENT_COLOR_1,
    borderRadius: 15,
  },
  itemText: {
    color: ACCENT_COLOR_2,
    fontSize: 16,
    fontFamily: 'Sf Pro Display',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },

  itemTitleText: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 0, // Reduce the margin bottom to decrease padding
    color: ACCENT_COLOR_2,
    fontFamily: 'Playfair Display',
  },
});

export default MenuPage;
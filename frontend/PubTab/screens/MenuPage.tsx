import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { Card, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCENT_COLOR_1, ACCENT_COLOR_2, PRIMARY_COLOR, SERVER_URL } from '../constants';

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  drink_type: string;
  image: string | null;
}

const getTab = async () => {
  try {
    return await AsyncStorage.getItem('tab');
  } catch (error) {
    console.error('Error retrieving tab:', error);
    return null;
  }
};

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

const addToTab = async (product: Product) => {
  try {
    const token = await getToken();
    if (!token) return;
    const tab = await getTab();
    if (!tab) {
      Alert.alert('Add to Tab', 'No tab found');
      return;
    }

    const response = await fetch(`${SERVER_URL}/tabs/add/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({ tab_id: tab, drink: product.id, quantity: 1 }),
    });
    const data = await response.json();
    Alert.alert('Add to Tab', `Response: ${JSON.stringify(data)}`);
  } catch (error) {
    console.error('Error adding item to tab:', error);
  }
};

const groupByDrinkType = (products: Product[]) => {
  return products.reduce((acc, product) => {
    if (!acc[product.drink_type]) {
      acc[product.drink_type] = [];
    }
    acc[product.drink_type].push(product);
    return acc;
  }, {} as Record<string, Product[]>);
};

const MenuPage = () => {
  const [groupedItems, setGroupedItems] = useState<Record<string, Product[]>>({});
  const [visibleDetails, setVisibleDetails] = useState<Record<number, boolean>>({});

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
        setGroupedItems(groupByDrinkType(data.products));
      } catch (error) {
        console.error('Error fetching pub list:', error);
      }
    };
    fetchPubs();
  }, []);

  const toggleDetails = (productId: number) => {
    setVisibleDetails((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {Object.entries(groupedItems).map(([drinkType, products]) => (
          <View key={drinkType}>
            <Text style={styles.sectionTitle}>{drinkType}</Text>
            {products.map((product) => (
              <TouchableOpacity key={product.id} onPress={() => toggleDetails(product.id)}>
                <Card style={styles.card}>
                  {product.image && (
                    <Card.Cover source={{ uri: product.image }} style={styles.image} />
                  )}
                  <Card.Title title={product.name} titleStyle={styles.itemTitleText} />
                  {visibleDetails[product.id] && (
                    <Card.Content>
                      <Text style={styles.itemText}>{product.description}</Text>
                    </Card.Content>
                  )}
                  <Card.Actions>
                    <Text style={styles.priceText}>€ {product.price}</Text>
                    <Button icon="plus" mode="contained" onPress={() => addToTab(product)}> Add to Tab </Button>
                  </Card.Actions>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ACCENT_COLOR_2,
    marginVertical: 10,
  },
  card: {
    marginVertical: 10,
    backgroundColor: ACCENT_COLOR_1,
    borderRadius: 15,
    padding: 10,
  },
  image: {
    height: 150,
    borderRadius: 10,
  },
  itemText: {
    color: ACCENT_COLOR_2,
    fontSize: 16,
    marginVertical: 2,
  },
  itemTitleText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: ACCENT_COLOR_2,
  },
  priceText: {
    color: ACCENT_COLOR_2,
    fontSize: 16,
    marginRight: 10,
  },
});

export default MenuPage;
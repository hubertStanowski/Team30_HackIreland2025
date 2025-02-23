import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import Checkout from '../components/Checkout';
import { ACCENT_COLOR_1, ACCENT_COLOR_2 } from '../constants';
import { Card } from 'react-native-paper';
import {PRIMARY_COLOR, SERVER_URL} from "../constants.ts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEffect } from 'react';


const publishableKey = 'pk_test_51Qv2pgDyctP2HSWdxnotQWaHiPjgXLjLqKZME5NNvDxkwFxG8tgwzfortBQpQvPsE4kE4PVET3LjDebiREskHIm0009xCJB6Eo';
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
interface Product {
  drink: string;
  price: string;
  quantity: number;
  sub_total: number;
}


const CheckoutPage = () => {

  const getItems = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error('No token available');
        return;
      }
      const tab = await getTab();
      if (!tab) {
        console.error('No tab available');
        return;
      }
      // Adjust payload: only send table and limit.
      const response = await fetch(`${SERVER_URL}/tabs/items/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tab_id: tab
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setProducts(data.items)
        Alert.alert('Items', `Response: ${JSON.stringify(data)}`);
      } else {
        Alert.alert('Error2', data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error opening tab:', error);
      Alert.alert('Error2', 'Could not open tab. Please try again later.');
    }
  };
  useEffect(() => {
    getItems();
  }, []);
  const [products, setProducts] = useState<Product[]>([]);

  const totalAmount = products.reduce((sum, product) => sum + product.quantity * parseFloat(product.price), 0).toFixed(2);
  const [isStarred, setIsStarred] = useState(false);

  return (
    <StripeProvider publishableKey={publishableKey}>
      <View style={styles.container}>
        <View style={styles.productList}>
          {products.map((product, index) => (
            <Card key={index} style={styles.product}>
              <Card.Title title={`${product.quantity} x ${product.drink}`} titleStyle={styles.productTitleText} />
                <Card.Content style={[styles.cardContent, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <Text style={styles.productText}>{`${parseFloat(product.price) * product.quantity}€`}</Text>
                <Ionicons 
                  name={isStarred ? "star" : "star-outline"} 
                  size={30} 
                  color={ACCENT_COLOR_2} 
                  onPress={() => setIsStarred(!isStarred)} 
                />
                </Card.Content>

            </Card>
          ))}
        </View>
        <View style={styles.checkoutButton}>
          <Checkout amount={parseFloat(totalAmount)}/>
        </View>
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR
  },
  productList: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    alignItems: 'center',
  },
  checkoutButton: {
    marginBottom: 15,
  },
  product: {
    marginVertical: 5,
    width: '90%',
    backgroundColor: ACCENT_COLOR_1,
    borderRadius: 15,
  },
  productText: {
    color: "#FAF3E0",
    fontSize: 16,
    fontFamily: 'Sf Pro Display',
  },
  productTitleText: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 0, // Reduce the margin bottom to decrease padding
    color: ACCENT_COLOR_2,
    fontFamily: 'Playfair Display',
  },
  cardContent: {
    paddingTop: 0, // Reduce the padding top to decrease padding
  },
});

export default CheckoutPage;
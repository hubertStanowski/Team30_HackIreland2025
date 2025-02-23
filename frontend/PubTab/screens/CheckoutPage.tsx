import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import Checkout from '../components/Checkout';
import { ACCENT_COLOR_1, ACCENT_COLOR_2, PRIMARY_COLOR, SERVER_URL } from '../constants';
import { Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const publishableKey = 'pk_test_51Qv2pgDyctP2HSWdxnotQWaHiPjgXLjLqKZME5NNvDxkwFxG8tgwzfortBQpQvPsE4kE4PVET3LjDebiREskHIm0009xCJB6Eo';

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

const getTab = async () => {
  try {
    return await AsyncStorage.getItem('tab');
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
  isFavorite?: boolean;
}

const CheckoutPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getItems = async () => {
      try {
        const token = await getToken();
        const tab = await getTab();
        if (!token || !tab) return;

        const response = await fetch(`${SERVER_URL}/tabs/items/`, {
          method: 'POST',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tab_id: tab }),
        });

        const data = await response.json();
        if (response.ok) {
          setProducts(data.items.map(item => ({ ...item, isFavorite: false })));
        } else {
          Alert.alert('Error', data.error || 'An error occurred');
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    getItems();
  }, []);

  const toggleFavorite = (index: number) => {
    setProducts(prevProducts =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, isFavorite: !product.isFavorite } : product
      )
    );
  };

  const totalAmount = products.reduce((sum, product) => sum + product.quantity * parseFloat(product.price), 0).toFixed(2);

  return (
    <StripeProvider publishableKey={publishableKey}>
      <View style={styles.container}>
        <View style={styles.productList}>
          {products.map((product, index) => (
            <Card key={index} style={styles.product}>
              <Card.Title title={`${product.quantity} x ${product.drink}`} titleStyle={styles.productTitleText} />
              <Card.Content style={styles.cardContent}>
                <Text style={styles.productText}>{`${parseFloat(product.price) * product.quantity}€`}</Text>
              </Card.Content>
              <Card.Actions>
                <Button
                  icon={product.isFavorite ? "star" : "star-outline"}
                  onPress={() => toggleFavorite(index)}
                  color={ACCENT_COLOR_2}
                >
                  {product.isFavorite ? "Remove favorite" : "Add favorite"}
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
        <View style={styles.checkoutButton}>
          <Checkout amount={parseFloat(totalAmount)} />
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
    color: ACCENT_COLOR_2,
    fontFamily: 'Playfair Display',
  },
  cardContent: {
    paddingTop: 0,
  },
});

export default CheckoutPage;

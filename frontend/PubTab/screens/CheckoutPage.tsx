import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import Checkout from '../components/Checkout';
import { PRIMARY_COLOR, ACCENT_COLOR_1, ACCENT_COLOR_2 } from '../constants';

const publishableKey = 'pk_test_51Qv2pgDyctP2HSWdxnotQWaHiPjgXLjLqKZME5NNvDxkwFxG8tgwzfortBQpQvPsE4kE4PVET3LjDebiREskHIm0009xCJB6Eo';

const CheckoutPage = () => {
  const products = [
    [1, 'Guinness', 5.99],
    [2, 'Guinness', 5.99],
    [3, 'Guinness', 5.99],
    [4, 'Guinness', 5.99],
    [5, 'Guinness', 5.99],
  ];

  return (
    <StripeProvider publishableKey={publishableKey}>
      <View style={styles.container}>
        <View style={styles.productList}>
          {products.map((product, index) => (
            <View key={index} style={styles.product}>
              <Text style={styles.productText}>{product[0]}x {product[1]} - ${product[2]}</Text>
            </View>
          ))}
        </View>
        <View style={styles.checkoutButton}>
          <Checkout amount={10.99}/>
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
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: ACCENT_COLOR_2,
    width: '90%',
    backgroundColor: ACCENT_COLOR_1,
  },
  productText: {
    color: ACCENT_COLOR_2,
    fontSize: 18, 
  }
});

export default CheckoutPage;
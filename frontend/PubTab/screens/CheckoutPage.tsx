import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import Checkout from '../components/Checkout';
import { ACCENT_COLOR_1, ACCENT_COLOR_2 } from '../constants';
import { Card } from 'react-native-paper';
import {PRIMARY_COLOR} from "../constants.ts";

const publishableKey = 'pk_test_51Qv2pgDyctP2HSWdxnotQWaHiPjgXLjLqKZME5NNvDxkwFxG8tgwzfortBQpQvPsE4kE4PVET3LjDebiREskHIm0009xCJB6Eo';

const CheckoutPage = () => {
  const products = [
    { name: 'Guinness', count: 2, price: 5.99 },
    { name: 'Guinness', count: 2, price: 5.99 },
    { name: 'Guinness', count: 2, price: 5.99 },
    { name: 'Guinness', count: 2, price: 5.99 },
    { name: 'Guinness', count: 2, price: 5.99 },
  ];
  const totalAmount = Math.round(products.reduce((sum, product) => sum + product.count * product.price, 0));

  return (
    <StripeProvider publishableKey={publishableKey}>
      <View style={styles.container}>
        <View style={styles.productList}>
          {products.map((product, index) => (
            <Card key={index} style={styles.product}>
              <Card.Title title={`${product.count} x ${product.name}`} titleStyle={styles.productTitleText} />
              <Card.Content style={styles.cardContent}>
                <Text style={styles.productText}>{`${product.price * product.count}€`}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
        <View style={styles.checkoutButton}>
          <Checkout amount={totalAmount}/>
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
    backgroundColor: PRIMARY_COLOR,
  },
  checkoutButton: {
    marginBottom: 15,
  },
  product: {
    marginVertical: 5,
    width: '90%',
    backgroundColor: "#19211B",
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
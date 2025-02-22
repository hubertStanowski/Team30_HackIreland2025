import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import Checkout from '../components/Checkout';
import {PRIMARY_COLOR} from "../constants.ts";

const publishableKey = 'pk_test_51Qv2pgDyctP2HSWdxnotQWaHiPjgXLjLqKZME5NNvDxkwFxG8tgwzfortBQpQvPsE4kE4PVET3LjDebiREskHIm0009xCJB6Eo';

const CheckoutPage = () => {
  return (
    <StripeProvider publishableKey={publishableKey}>
      <View style={styles.container}>
        <View style={styles.checkoutButton}>
          <Checkout />
        </View>
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
  },
  checkoutButton: {
    marginTop: 14,
    marginBottom: 15,
  },
});

export default CheckoutPage;
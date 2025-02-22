import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import CheckoutScreen from './CheckoutScreen';

const publishableKey = 'pk_test_51Qv2pgDyctP2HSWdxnotQWaHiPjgXLjLqKZME5NNvDxkwFxG8tgwzfortBQpQvPsE4kE4PVET3LjDebiREskHIm0009xCJB6Eo';

const Checkout = () => {
  return (
    <StripeProvider publishableKey={publishableKey}>
      <View style={styles.container}>
        <View style={styles.checkoutButton}>
          <CheckoutScreen />
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
  },
  checkoutButton: {
    marginTop: 14,
    marginBottom: 15,
  },
});

export default Checkout;
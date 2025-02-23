import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { Button, View } from 'react-native';
import { SERVER_URL, ACCENT_COLOR_1, ACCENT_COLOR_2, PURPLE } from '../constants';

interface CheckoutProps {
  amount: number;
}

export default function Checkout({ amount }: CheckoutProps): React.JSX.Element {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${SERVER_URL}/tabs/payment/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'eur',
      }),
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent.client_secret,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await initializePaymentSheet();
    };
    initialize();
  }, []);

  return (
    <View style={{ backgroundColor: PURPLE, padding: 10, borderRadius: 50 }}>
      <Button
      title={`Checkout ${amount}€`}
      onPress={openPaymentSheet}
      color={"#FFFFFF"}
      />
    </View>
  );
}

import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { Button, View, Text } from 'react-native';

const API_URL = 'https://pubtab.eu.pythonanywhere.com/tabs/payment/'; // Replace with your actual API URL

export default function Checkout(): React.JSX.Element {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      amount: 100,
      currency: 'usd',
      }),
    });
    const { paymentIntent, ephemeralKey, customer,  } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();

    await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent.client_secret,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      }
    });
  }


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
    <View>
      <Button
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </View>
  );
}



import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { Button, View } from 'react-native';
import { SERVER_URL, ACCENT_COLOR_1, ACCENT_COLOR_2, PURPLE } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CheckoutProps {
  amount: number;
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
      const response = await fetch(`${SERVER_URL}/tabs/close/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tab_id: tab,
        }),
      });

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

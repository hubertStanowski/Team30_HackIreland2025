import React from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { View, StyleSheet } from 'react-native';
import CheckoutScreen from './components/CheckoutScreen';

function App(): React.JSX.Element {

  const publishableKey = "pk_test_51Qv2pgDyctP2HSWdxnotQWaHiPjgXLjLqKZME5NNvDxkwFxG8tgwzfortBQpQvPsE4kE4PVET3LjDebiREskHIm0009xCJB6Eo"

  return (
    <StripeProvider publishableKey={publishableKey}>
      <View style={styles.container}>
        <CheckoutScreen />
      </View>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

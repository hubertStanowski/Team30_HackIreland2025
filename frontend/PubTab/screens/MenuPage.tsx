import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {PRIMARY_COLOR} from "../constants.ts";

const MenuPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Menu Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default MenuPage;
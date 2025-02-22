import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavBar from './NavBar';
import TopBar from './TopBar';
import { PRIMARY_COLOR, ACCENT_COLOR_1, ACCENT_COLOR_2 } from '../constants';
const HomePage = () => {
  return (
    <View style={styles.container}>
      <TopBar />
      <Text style={styles.title}>Welcome to HomePage</Text>
      <NavBar />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HomePage;
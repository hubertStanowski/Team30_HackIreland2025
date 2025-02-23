import React from 'react';
import { View, StyleSheet } from 'react-native';
import TopBar from './TopBar';
import NavBar from './NavBar';
import { PRIMARY_COLOR } from '../constants';

const Main = () => {
  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        <NavBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  content: {
    flex: 1,
  },
});

export default Main;
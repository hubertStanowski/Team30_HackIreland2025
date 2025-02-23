import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {PRIMARY_COLOR} from "../constants.ts";

const ProfilePage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Profile Page</Text>
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

export default ProfilePage;
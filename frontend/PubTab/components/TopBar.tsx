import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { PRIMARY_COLOR, ACCENT_COLOR_2 } from '../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TopBar: React.FC = () => {
  return (
    <Appbar.Header style={{ backgroundColor: PRIMARY_COLOR }}>
      <View style={styles.flexContainer} />
      <View style={styles.centerContainer}>
        <Ionicons name="beer-outline" size={30} color={ACCENT_COLOR_2} />
        <Appbar.Content title="PubTab" color={ACCENT_COLOR_2} titleStyle={styles.titleStyle} style={styles.contentStyle} />
      </View>
      <View style={styles.flexContainer} />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
  titleStyle: {
    fontFamily: 'Playfair Display',
    marginLeft: 10, // Space between icon and text
  },
  contentStyle: {
    flex: 0,
  },
});

export default TopBar;
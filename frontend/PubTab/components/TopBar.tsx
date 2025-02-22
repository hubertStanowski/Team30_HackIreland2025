import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PRIMARY_COLOR, ACCENT_COLOR_1, ACCENT_COLOR_2 } from '../constants';

const TopBar: React.FC = () => {
  const iconSize = 70;
  return (
    <View style={styles.topBar}>
      <View style={styles.topItem}>
        <Ionicons name="beer" size={iconSize} color={ACCENT_COLOR_2} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items to the left
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderTopWidth: 1, // Add top border
    borderTopColor: '#ccc', // Color of the top border
    marginTop: 50, // Increase top margin
  },
  topItem: {
    alignItems: 'center',
    marginLeft: 20,
  },
});

export default TopBar;

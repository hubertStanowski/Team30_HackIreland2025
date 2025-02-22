import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NavBar: React.FC = () => {
  const iconSize = 45;
  return (
    <View style={styles.navBar}>
      <View style={styles.navItemWrapper}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={iconSize} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.navItemWrapper}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search-outline" size={iconSize} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.navItemWrapper}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="menu-outline" size={iconSize} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.navItemWrapper}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="albums-outline" size={iconSize} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.navItemWrapper}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={iconSize} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 20, 
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginBottom: 10, 
  },
  navItemWrapper: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
  },
  navItem: {
    alignItems: 'center',
  },
});

export default NavBar;

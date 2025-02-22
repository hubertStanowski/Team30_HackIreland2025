import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import HomePage from '../components/HomePage';
import { PRIMARY_COLOR, ACCENT_COLOR_2 } from '../constants';
import CheckoutScreen from "../components/CheckoutScreen.tsx";

const NavBar = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'checkout', title: 'Checkout', focusedIcon: 'cart', unfocusedIcon: 'cart-outline' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomePage,
    checkout: CheckoutScreen,
    profile: HomePage,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={false} // Set to true for animation effects
      barStyle={{ backgroundColor: PRIMARY_COLOR }} // Use primary color for the bar background
      activeColor={ACCENT_COLOR_2} // Use secondary color for active icons
      inactiveColor="gray" // Use gray for inactive icons
      sceneAnimationEnabled={true}
    />
  );
};

export default NavBar;
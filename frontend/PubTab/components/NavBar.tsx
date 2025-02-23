import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import HomePage from '../screens/HomePage';
import CheckoutPage from "../screens/CheckoutPage";
import { PRIMARY_COLOR, ACCENT_COLOR_2 } from '../constants';
import ExplorePage from '../screens/ExplorePage';
import MenuPage from '../screens/MenuPage';
import ProfilePage from '../screens/ProfilePage';

const NavBar = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'explore', title: 'Explore', focusedIcon: 'magnify', unfocusedIcon: 'magnify' },
    { key: 'menu', title: 'Menu', focusedIcon: 'food', unfocusedIcon: 'food-outline' },
    { key: 'checkout', title: 'Tab', focusedIcon: 'cart', unfocusedIcon: 'cart-outline' },
    { key: 'profile', title: 'Profile', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'home':
        return <HomePage />;
      case 'explore':
        return <ExplorePage />;
      case 'menu':
        return <MenuPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      shifting={false}
      barStyle={{ backgroundColor: PRIMARY_COLOR }}
      activeColor={ACCENT_COLOR_2}
      inactiveColor="gray"
      sceneContainerStyle={{ backgroundColor: PRIMARY_COLOR }}
    />
  );
};

export default NavBar;
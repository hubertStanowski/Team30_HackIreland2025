import React from 'react';
import { Appbar } from 'react-native-paper';
import { PRIMARY_COLOR, ACCENT_COLOR_2 } from '../constants';

const TopBar: React.FC = () => {
  return (
    <Appbar.Header style={{ backgroundColor: PRIMARY_COLOR }}>
      <Appbar.Action icon="beer" color={ACCENT_COLOR_2} onPress={() => {}} />
      <Appbar.Content title="PubTab" color={ACCENT_COLOR_2} />
    </Appbar.Header>
  );
};

export default TopBar;
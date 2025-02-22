import { DefaultTheme } from 'react-native-paper';

export const SERVER_URL = "https://pubtab.eu.pythonanywhere.com";

const DEEP_CHARCOAL_BLACK = '#1A1A1A';
const TEMPLE_BAR_RED = '#AA1C1C';
const VINTAGE_GOLD = '#D4AF37';

export const PRIMARY_COLOR = DEEP_CHARCOAL_BLACK;
export const ACCENT_COLOR_1 = TEMPLE_BAR_RED;
export const ACCENT_COLOR_2 = VINTAGE_GOLD;

export const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: PRIMARY_COLOR,
    accent: ACCENT_COLOR_2,
    background: PRIMARY_COLOR,
    surface: PRIMARY_COLOR,
    text: '#FFFFFF', // Set default text color to white
    placeholder: ACCENT_COLOR_2,
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: ACCENT_COLOR_1,
  },
};

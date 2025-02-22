import React from 'react';
import { PaperProvider } from 'react-native-paper';
import NavBar from './screens/NavBar';
import TopBar from "./screens/TopBar.tsx";
import {customTheme} from "./constants.ts";

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={customTheme}>
        <TopBar />
        <NavBar />
    </PaperProvider>
  );
}

export default App;
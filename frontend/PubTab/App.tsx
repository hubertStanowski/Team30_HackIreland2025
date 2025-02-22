import React from 'react';
import { PaperProvider } from 'react-native-paper';
import NavBar from './components/NavBar.tsx';
import TopBar from "./components/TopBar.tsx";
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
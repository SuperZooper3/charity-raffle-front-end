import './App.css';
import { DAppProvider, Rinkeby } from '@usedapp/core';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Box } from '@mui/material';

function App() {
  return (
    <DAppProvider config={{
      networks: [Rinkeby],
      notifications: {
        expirationPeriod: 1000,
        checkInterval: 1000,
      }
    }}>
      <div className="App">
        <Box sx={{ border: 1, borderWidth: 0.1, borderColor: "gray" , borderRadius: 5, backgroundColor:'white', padding: 5 }}>
          <Header /> 
          <Main />
        </Box>
      </div>
    </DAppProvider>
    
  );
}

export default App;

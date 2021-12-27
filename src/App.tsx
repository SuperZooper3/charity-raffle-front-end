import './App.css';
import { DAppProvider, Rinkeby} from '@usedapp/core';
import { Header } from './components/Header';
import { Main } from './components/Main';

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
        <Header /> 
        <Main />
      </div>
    </DAppProvider>
    
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from '../src/contexts/gameContext'
import GameElements from './pages/GameElements';
import Layout from './components/Layout';

function App() {
  return (
    <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout/>}>
              <Route index element={<GameElements/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </GameProvider>
  );
}

export default App;

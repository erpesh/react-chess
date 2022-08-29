import React from 'react';
import './App.css';
import GamePage from "./pages/GamePage";
import {Route, Routes} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChoosePage from "./pages/ChoosePage";
import {SocketProvider} from "./context/SocketContext";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/choose" element={<ChoosePage/>}/>
          <Route path="/game/:id" element={<GamePage/>}/>
        </Routes>
      </SocketProvider>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import TitleBar from './components/TitleBar';
import Header from './components/Header';
import ToolBar from './components/ToolBar';
import Board from './components/Board';

const App = () => {
  const [mode, activeMode] = useState('create');
  return (
    <div className="App">
      <TitleBar />
      <Header />
      <ToolBar mode={mode} activeMode={activeMode} />
      <Board mode={mode} />
    </div>
  );
};

export default App;

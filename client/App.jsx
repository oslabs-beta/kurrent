import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './containers/Login.jsx';
import Main from './containers/Main.jsx'

const App = () => {
  return (
    <main>
      <Routes>
        <Route path='dashboard' element={<Main />}/>
        <Route path='/' element={<Login />}/>
      </Routes>
    </main>
  )
}

export default App;

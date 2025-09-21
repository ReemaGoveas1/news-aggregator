import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/HomePage';
import Login from './pages/Login';
import Preferences from './pages/Preferences';

function App() {
  const user = localStorage.getItem('user');
  return (<Router> <Routes> <Route path="/login" element={<Login />} />
    <Route path="/preferences" element={user ? <Preferences /> : <Navigate to="/login" />} />
    <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} /> {/* Fallback */}
    <Route path="*" element={<Navigate to="/" />} /> </Routes> </Router>);
}
export default App;
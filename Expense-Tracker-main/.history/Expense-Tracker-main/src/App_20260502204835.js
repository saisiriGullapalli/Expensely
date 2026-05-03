import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/global.css';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';

// Replace this with your real Firebase auth state
// e.g. const [user] = useAuthState(auth);
function App() {
  const [user, setUser] = useState(null); // null = logged out

  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);

  if (!user) {
    return (
      <BrowserRouter>
        <Login onLogin={handleLogin} />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/add" element={<AddExpense />} />
        <Route path="/edit/:id" element={<AddExpense />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
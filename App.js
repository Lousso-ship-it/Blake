import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Workstation from './pages/Workstation';
import Datalake from './pages/Datalake';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Planner from './pages/Planner';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workstation" element={<Workstation />} />
            <Route path="/datalake" element={<Datalake />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/planner" element={<Planner />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 
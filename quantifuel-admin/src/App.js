import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import FuelPumpManagement from './components/FuelPumpManagement';
import OperatorManagement from './components/OperatorManagement';
import Transactions from './components/Transactions';

import logo from './assets/img/icon-logo-transparent.png';
import branding from './assets/img/splash_branding.png';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <img src={logo} alt="Quantifuel Logo" style={{ height: '50px' }} />
          <img
            src={branding}
            alt="Quantifuel Branding"
            style={{ height: '45px' }}
          />
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/transactions">Transactions</Link>
            </li>
            <li>
              <Link to="/fuel-pumps">Fuel Pump Management</Link>
            </li>
            <li>
              <Link to="/operators">Operator Management</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/fuel-pumps" element={<FuelPumpManagement />} />
          <Route path="/operators" element={<OperatorManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

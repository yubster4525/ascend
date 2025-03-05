import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import HabitTracker from './pages/HabitTracker';
import BodyMetrics from './pages/BodyMetrics';
import JournalPage from './pages/JournalPage';
import GoalsPage from './pages/GoalsPage';
import Navbar from './components/Navbar';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/habits" element={<HabitTracker />} />
            <Route path="/body-metrics" element={<BodyMetrics />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/goals" element={<GoalsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
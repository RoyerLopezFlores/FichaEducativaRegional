import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FichaEducativa } from './components/FichaEducativa';

function App() {
  return (
    <Router>
      <div className="app-layout" style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/ficha-educativa" replace />} />
          <Route path="/ficha-educativa" element={<FichaEducativa />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

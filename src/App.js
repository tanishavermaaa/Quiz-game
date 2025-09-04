// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Quiz from './components/Quiz';
import Results from './components/Results';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="app-header">
          <h1>Quiz Challenge</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Quiz />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
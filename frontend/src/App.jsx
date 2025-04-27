import Login from "./components/Login";
import React, { useState, useEffect } from 'react';
import './App.css';
import NewsList from './components/NewsQuiz/NewsList';
import NewsPage from './components/NewsQuiz/NewsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router';

function App() {
  return (
    <div>
      <Router>
        <Routes> {/* Use <Routes> to wrap your <Route> components */}
          <Route path="/" element={<Login />} />
          <Route path="/newsquiz" element={<NewsPage />} />
        </Routes>
      </Router>
    </div>  
  );
}

export default App; 
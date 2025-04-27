import Login from "./components/Login";
import React, { useState, useEffect } from 'react';
import './App.css';
import NewsList from './components/NewsQuiz/NewsList';
import NewsPage from './components/NewsQuiz/NewsPage';
import Leaderboard from './components/Leaderboard/Leaderboard'
import { BrowserRouter as Router, Routes, Route } from 'react-router';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/newsquiz" element={<NewsPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </Router>
    </div>  
  );
}


export default App;

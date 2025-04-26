import Login from "./components/Login"
import React, { useState, useEffect } from 'react';
import './App.css';
import NewsList from './components/NewsQuiz/NewsList';
import NewsPage from './components/NewsQuiz/NewsPage';

function App() {

  return (
    <div>
      <NewsPage />
    </div>
  );
}

export default App;
import Login from "./components/Login"
import React, { useState, useEffect } from 'react';
import './App.css';
import NewsList from './components/NewsList';
import Quiz from './components/Quiz';
import NewsPage from "./components/NewsPage"

function App() {

  return (
    <div>
      <h1>Login Page</h1>
      <Login />
    </div>
  );
}

export default App;
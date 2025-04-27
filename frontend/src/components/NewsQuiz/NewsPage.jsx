import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './NewsPage.css';
import NewsList from './NewsList';
import Quiz from './Quiz';

function NewsPage() {
  const [news, setNews] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false); // New state to control quiz visibility
  const numArticles = 3;

  const navigate = useNavigate();

  // Fetch article info
  async function fetchArticle(i) {
    try {
      const response = await fetch(`http://localhost:3000/article?index=${i}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      setNews(prevNews => {
        const newNews = [...prevNews];
        newNews[i] = data;
        return newNews;
      });      
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  }

  // Fetch quiz question
  async function fetchQuiz(i) {
    try {
      const response = await fetch(`http://localhost:3000/quiz?index=${i}`);
      const data = await response.json();
      setQuiz(prevQuiz => {
        const newQuiz = [...prevQuiz];
        newQuiz[i] = data;
        return newQuiz;
      });
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  }

  useEffect(() => {
    for (let i = 0; i < numArticles; i++) {
      fetchArticle(i);
      fetchQuiz(i);
    }
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }    
  };

  const handleContinueClick = () => {
    setShowQuiz(true); // Show the quiz when button is clicked
  };

  const handletoLeaderboard = () => {
    // Replace this with your actual navigation logic (e.g., using React Router)
    navigate('/Leaderboard');
};
  const handleLogout = () => {
    // Replace this with your actual navigation logic (e.g., using React Router)
    navigate('/');
};

  return (
    <div className="Newspage">
          <button className="back-to-leaderboard-button" onClick={handletoLeaderboard}>
            Leaderboard
          </button>
          <button className="logout" onClick={handleLogout}>
            Log out
          </button>
      <header className="Newspage-header">
        <h1>News Quiz</h1>
        <NewsList news={news} />
        
        {!showQuiz ? (
          <>
            <h2>Feel like you're ready?</h2>
            <button onClick={handleContinueClick}>Continue to quiz!</button>
          </>
        ) : (
          Array.isArray(quiz) && quiz.map((q, index) => (
            q ? (
            <Quiz
              key={index}
              question={q.question}
              options={q.options}
              correctAnswer={q.correctAnswer}
              onAnswer={handleAnswer}
            />
            ) : null
          ))
        )}
        
        {showQuiz && <p>Score: {score}</p>} {/* Only show score after quiz starts */}
      </header>
    </div>
  );
}

export default NewsPage;
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

  const handleAnswer = async (isCorrect) => {
    if (!isCorrect) return;
    setScore(prev => prev + 1);

    const username = localStorage.getItem('username');
    if (!username) {
      console.error('No username in localStorage!');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/increment-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          delta: 1
        })
      });
      if (!res.ok) {
        console.error('Server error incrementing score:', await res.text());
      }

      const { newStreak } = await res.json();

    // ② update localStorage usersData
    const usersData = JSON.parse(localStorage.getItem('usersData')) || [];
    const updated = usersData.map(u =>
      u.username === username
        ? { ...u, streak: newStreak }
        : u
    );
    localStorage.setItem('usersData', JSON.stringify(updated));
    
    } catch (err) {
      console.error('Network error incrementing score:', err);
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
          <div className="QuizList"> {/* <--- Wrap all quizzes here */}
            {Array.isArray(quiz) && quiz.map((q, index) => (
              q ? (
                <Quiz
                  key={index}
                  question={q.question}
                  options={q.options}
                  correctAnswer={q.correctAnswer}
                  onAnswer={handleAnswer}
                />
              ) : null
            ))}
          </div>
        )}
        
        {showQuiz && <p>Score: {score}</p>} {/* Only show score after quiz starts */}
      </header>
    </div>
  );
}

export default NewsPage;
import React, { useState, useEffect } from 'react';
import './NewsPage.css';
import NewsList from './NewsList';
import Quiz from './Quiz';

function NewsPage() {
  const [news, setNews] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false); // New state to control quiz visibility
  const numArticles = 3;

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
      setQuiz(data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  }

  useEffect(() => {
    for (let i = 0; i < numArticles; i++) {
      fetchArticle(i);
    }
    fetchQuiz(0);
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }    
  };

  const handleContinueClick = () => {
    setShowQuiz(true); // Show the quiz when button is clicked
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>News Quiz</h1>
        <NewsList news={news} />
        
        {!showQuiz ? ( // Only show this section if quiz is not visible
          <>
            <h2>Feel like you're ready?</h2>
            <button onClick={handleContinueClick}>Continue to quiz!</button>
          </>
        ) : (
          quiz && ( // Only show quiz if it's loaded and showQuiz is true
            <Quiz
              question={quiz.question}
              options={quiz.options}
              correctAnswer={quiz.correctAnswer}
              onAnswer={handleAnswer}
            />
          )
        )}
        
        {showQuiz && <p>Score: {score}</p>} {/* Only show score after quiz starts */}
      </header>
    </div>
  );
}

export default NewsPage;
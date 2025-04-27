import React, { useState, useEffect } from 'react';
import './NewsPage.css';
import NewsList from './NewsList';
import Quiz from './Quiz';

function NewsPage() {
  const [news, setNews] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false); // New state to control quiz visibility
  const [index, setIndex] = useState(0); // Current article index

  // Fetch article info
  async function fetchArticle(i) {
    try {
      const response = await fetch(`http://localhost:3000/article?i=${i}`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      setNews(prevNews => [...prevNews, data]);
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  }

  // Fetch quiz question
  async function fetchQuiz(i) {
    try {
      const response = await fetch(`http://localhost:3000/quiz?i=${i}`);
      const data = await response.json();
      setQuiz(data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  }

  useEffect(() => {
    fetchArticle(index);
    fetchQuiz(index);
  }, [index]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
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
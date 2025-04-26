import React, { useState, useEffect } from 'react';
import './NewsPage.css';
import NewsList from './NewsList';
import Quiz from './Quiz';

function NewsPage() {
  const [news, setNews] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [score, setScore] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false); // New state to control quiz visibility

  useEffect(() => {
    // Placeholder news data
    const placeholderNews = [
      {
        title: 'News 1',
        description: 'Description 1',
        url: 'http://example.com/news1',
      },
      {
        title: 'News 2',
        description: 'Description 2',
        url: 'http://example.com/news2',
      },
    ];
    setNews(placeholderNews);

    // Generate a quiz based on the news
    const quizData = {
      question: 'What is the title of the first news?',
      options: ['News 1', 'News 2', 'News 3', 'News 4'],
      correctAnswer: 'News 1',
    };
    setQuiz(quizData);
  }, []);

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
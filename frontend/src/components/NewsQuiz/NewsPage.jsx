import React, { useState, useEffect } from 'react';
import './NewsPage.css';
import NewsList from './NewsList';
import Quiz from './Quiz';

function NewsPage() {
  const [news, setNews] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [score, setScore] = useState(0);

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

  return (

    <div className="App">
      <header className="App-header">
        <h1>News Quiz</h1>
        <NewsList news={news} />
        <h2>Feel like you're ready?</h2>
        <button>Continue to quiz!</button>
        <div>
    </div>
        {quiz && (
          <Quiz
            question={quiz.question}
            options={quiz.options}
            correctAnswer={quiz.correctAnswer}
            onAnswer={handleAnswer}
          />
        )}
        <p>Score: {score}</p>
      </header>
    </div>
  );
}

export default NewsPage;
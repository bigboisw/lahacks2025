import React from 'react';
import './Quiz.css';

const Quiz = ({ question, options, correctAnswer, onAnswer }) => {
  const [selectedOption, setSelectedOption] = React.useState(null);

  const handleAnswer = (option) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    onAnswer(option === correctAnswer);
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-question">{question}</h2>
      <div className="options-container">
        {options?.map((option, index) => (
          <div 
            key={index}
            className={[
              'option',
              selectedOption === index ? 'selected' : '',
              selectedOption !== null ? 'locked' : ''
            ].join(' ')}
            onClick={() => handleAnswer(index)}
          >
            <span className="option-letter">
              {String.fromCharCode(65 + index)} {/* A, B, C, D */}
            </span>
            <span className="option-text">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
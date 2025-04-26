import React from 'react';

const Quiz = ({ question, options, correctAnswer, onAnswer }) => {
  const handleAnswer = (answer) => {
    onAnswer(answer === correctAnswer);
  };

  return (
    <div>
      <h2>{question}</h2>
      <ul>
        {options.map((option, index) => (
          <li key={index} onClick={() => handleAnswer(option)}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quiz;
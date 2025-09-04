
import React from 'react';

const Question = ({ question, selectedAnswer, onAnswerSelect }) => {
  // Add safety check to prevent undefined errors
  if (!question) {
    return <div className="question-loading">Loading question...</div>;
  }

  return (
    <div className="question-container">
      <h3 className="question-text">{question.question}</h3>
      <div className="options-container">
        {question.options.map((option, index) => (
          <div 
            key={index} 
            className={`option ${selectedAnswer === option ? 'selected' : ''}`}
            onClick={() => onAnswerSelect(option)}
          >
            <div className="option-radio"></div>
            <div className="option-content">
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
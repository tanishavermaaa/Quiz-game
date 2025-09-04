// src/components/Results.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Results.css';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, totalQuestions, questions, userAnswers } = location.state || {};

//   // In Results.js, add:
// useEffect(() => {
//   const highScore = localStorage.getItem('quizHighScore');
//   if (!highScore || score > highScore) {
//     localStorage.setItem('quizHighScore', score);
//   }
// }, [score]);

// Display high score in results
<p>High Score: {localStorage.getItem('quizHighScore') || score}</p>
  
  // Handle direct access to results page
  if (!location.state) {
    return (
      <div className="results-container">
        <h2>No quiz results found</h2>
        <button onClick={() => navigate('/quiz')}>Start New Quiz</button>
      </div>
    );
  }

  const handleRestart = () => {
    navigate('/quiz');
  };

  return (
    <div className="results-container">
      <h2>Quiz Results</h2>
      
      <div className="score-summary">
        <h3>You scored {score} out of {totalQuestions}</h3>
        <p>{Math.round((score / totalQuestions) * 100)}%</p>
      </div>
      
      <div className="answers-review">
        <h3>Review your answers:</h3>
        {questions.map((question, index) => {
          const isCorrect = userAnswers[index] === question.correctAnswer;
          
          return (
            <div key={question.id} className={`answer-item ${isCorrect ? 'correct' : 'incorrect'}`}>
              <h4>Question {index + 1}: {question.question}</h4>
              <p>Your answer: {userAnswers[index] || 'Not answered'}</p>
              {!isCorrect && <p>Correct answer: {question.correctAnswer}</p>}
            </div>
          );
        })}
      </div>
      
      <button className="restart-button" onClick={handleRestart}>
        Restart Quiz
      </button>
    </div>
  );
};

export default Results;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Question from './Question';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import localQuestionsData from '../data/questions.json';
import '../styles/Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use local questions immediately for faster loading
        setQuestions(localQuestionsData);
        setUserAnswers(Array(localQuestionsData.length).fill(null));
        
        // Then try to fetch from API in the background
        try {
          console.log('Attempting to fetch questions from API...');
          const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
          
          if (!response.ok) {
            console.log('API not available, using local questions');
            return; // Continue with local questions
          }
          
          const data = await response.json();
          
          if (data.response_code === 0 && data.results && data.results.length > 0) {
            console.log('API success, updating with API questions');
            const formattedQuestions = data.results.map((question, index) => ({
              id: index + 1,
              question: decodeHTML(question.question),
              correctAnswer: decodeHTML(question.correct_answer),
              options: shuffleArray([
                decodeHTML(question.correct_answer),
                ...question.incorrect_answers.map(ans => decodeHTML(ans))
              ]),
              difficulty: question.difficulty
            }));
            
            setQuestions(formattedQuestions);
            setUserAnswers(Array(formattedQuestions.length).fill(null));
          }
        } catch (apiError) {
          console.log('API fetch failed, continuing with local questions:', apiError.message);
          // Silently continue with local questions
        }
        
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Failed to load questions. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Rest of your component remains the same...
  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleAnswerSelect = (answer) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newUserAnswers);
    
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate('/results', { 
        state: { 
          score, 
          totalQuestions: questions.length,
          questions, 
          userAnswers 
        } 
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleTimeUp = () => {
    handleNext();
  };

  if (isLoading) {
    return <div className="loading">Loading questions...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (questions.length === 0) {
    return <div className="error">No questions available.</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <ProgressBar 
        current={currentQuestionIndex + 1} 
        total={questions.length} 
      />
      
      <div className="quiz-header">
        <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
        {currentQuestion && (
          <Timer 
            duration={30} 
            onTimeUp={handleTimeUp} 
            key={currentQuestionIndex}
          />
        )}
      </div>
      
      {currentQuestion ? (
        <Question 
          question={currentQuestion} 
          selectedAnswer={userAnswers[currentQuestionIndex]}
          onAnswerSelect={handleAnswerSelect}
        />
      ) : (
        <div className="loading">Loading question...</div>
      )}
      
      <div className="navigation-buttons">
        <button 
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || !currentQuestion}
        >
          ← Previous
        </button>
        
        <button 
          onClick={handleNext}
          disabled={!userAnswers[currentQuestionIndex] || !currentQuestion}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz →' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
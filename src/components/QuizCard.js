import React, { useState, useEffect } from 'react';

const Quiz = () => {
  // State to store questions, user answers, and the final score
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Fetching quiz questions when the component mounts
  useEffect(() => {
    // Simulate fetching quiz data (you can replace this with an actual API request)
    const fetchQuestions = async () => {
      const data = await fetch('') // Replace with your actual endpoint
        .then(res => res.json())
        .then(data => data.questions); // Assuming the response structure has a 'questions' array
      setQuestions(data);
    };
    
    fetchQuestions();
  }, []);

  // Handle user answer selection
  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer
    });
  };

  // Start the quiz
  const startQuiz = () => {
    setQuizStarted(true);
  };

  // Submit the quiz and calculate score
  const submitQuiz = () => {
    let calculatedScore = 0;
    
    questions.forEach((question) => {
      if (userAnswers[question.id] === question.correct_answer) {
        calculatedScore++;
      }
    });
    
    setScore(calculatedScore);
    setQuizCompleted(true);
  };

  return (
    <div>
      {!quizStarted ? (
        <div>
          <h1>Test Your Knowledge!</h1>
          <button onClick={startQuiz}>Start Quiz</button>
        </div>
      ) : quizCompleted ? (
        <div>
          <h2>Quiz Completed!</h2>
          <p>Your Score: {score} / {questions.length}</p>
        </div>
      ) : (
        <div>
          <h1>Quiz</h1>
          {questions.map((question) => (
            <div key={question.id}>
              <p>{question.question_text}</p>
              <div>
                {question.answers.map((answer, index) => (
                  <div key={index}>
                    <label>
                      <input
                        type="radio"
                        name={question.id}
                        value={answer}
                        checked={userAnswers[question.id] === answer}
                        onChange={() => handleAnswerChange(question.id, answer)}
                      />
                      {answer}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button onClick={submitQuiz}>Submit Quiz</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;

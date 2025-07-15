import React, { useState } from 'react';
import axios from 'axios';
import './QuizBuilder.css';
import config from '../../../../../config/config';

export default function QuizBuilder() {
  const [meta, setMeta] = useState({
    title: '',
    description: '',
    coverImage: '',
    timeLimit: 10
  });

  const [questions, setQuestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const addQuestion = () => {
    const newQuestion = {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };
    setQuestions([...questions, newQuestion]);
    setActiveIndex(questions.length);
  };

  const updateQuestion = (field, value) => {
    const updated = [...questions];
    updated[activeIndex][field] = value;
    setQuestions(updated);
  };

  const updateOption = (optIndex, value) => {
    const updated = [...questions];
    updated[activeIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const removeOption = (optIndex) => {
    const updated = [...questions];
    updated[activeIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  const deleteQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
    setActiveIndex(null);
  };

  const handlePublish = async () => {
    try {
      const payload = {
        ...meta,
        questions,
        timeLimit: parseInt(meta.timeLimit)
      };

      const res = await axios.post(`${config.backendUrl}/api/quiz/create`, payload);
      alert('✅ Quiz published successfully!');
      setMeta({ title: '', description: '', coverImage: '', timeLimit: 10 });
      setQuestions([]);
      setActiveIndex(null);
    } catch (err) {
      alert('❌ Failed to publish quiz.');
    }
  };

  return (
    <div className="quiz-builder">
      <div className="left-panel">
        <button onClick={addQuestion}>➕ Add Question</button>
        <ul>
          {questions.map((q, i) => (
            <li key={i} className={i === activeIndex ? 'active' : ''} onClick={() => setActiveIndex(i)}>
              <span>Q{i + 1}</span> {q.questionText.slice(0, 30) || 'Untitled'}
            </li>
          ))}
        </ul>
        <button className="publish-btn" onClick={handlePublish}>🚀 Publish</button>
      </div>

      <div className="main-panel">
        <h2>Create New Quiz</h2>

        <input
          type="text"
          placeholder="Quiz Title"
          value={meta.title}
          onChange={e => setMeta({ ...meta, title: e.target.value })}
        />

        <textarea
          placeholder="Quiz Description"
          value={meta.description}
          onChange={e => setMeta({ ...meta, description: e.target.value })}
        />

        <input
          type="text"
          placeholder="Cover Image URL"
          value={meta.coverImage}
          onChange={e => setMeta({ ...meta, coverImage: e.target.value })}
        />

        <input
          type="number"
          placeholder="Time Limit (in minutes)"
          value={meta.timeLimit}
          onChange={e => setMeta({ ...meta, timeLimit: e.target.value })}
        />

        {activeIndex !== null && questions[activeIndex] && (
          <>
            <div className="header">
              <h3>Question {activeIndex + 1}</h3>
            </div>

            <input
              className="question-input"
              type="text"
              placeholder="Enter your question"
              value={questions[activeIndex].questionText}
              onChange={(e) => updateQuestion('questionText', e.target.value)}
            />

            <div className="options-list">
              {questions[activeIndex].options.map((opt, i) => (
                <div className="option-item" key={i}>
                  <input
                    type="radio"
                    name={`correct-${activeIndex}`}
                    checked={questions[activeIndex].correctAnswer === i}
                    onChange={() => updateQuestion('correctAnswer', i)}
                  />
                  <input
                    type="text"
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                  />
                  <button onClick={() => removeOption(i)}>🗑</button>
                </div>
              ))}
              <button onClick={() => updateOption(questions[activeIndex].options.length, '')}>
                + Add Option
              </button>
            </div>

            <textarea
              placeholder="Explanation (optional)"
              value={questions[activeIndex].explanation}
              onChange={(e) => updateQuestion('explanation', e.target.value)}
            />

            <button className="delete-btn" onClick={() => deleteQuestion(activeIndex)}>
              ❌ Delete Question
            </button>
          </>
        )}
      </div>
    </div>
  );
}

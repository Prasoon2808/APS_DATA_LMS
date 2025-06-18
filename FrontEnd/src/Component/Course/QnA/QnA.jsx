import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './QnA.css';
import config from '../../../config/config';

export default function QnAForum({ courseId, chapterId, userId }) {
  const [questions, setQuestions] = useState([]);
  const [newQ, setNewQ] = useState('');
  const [answers, setAnswers] = useState({});
  const [replies, setReplies] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [answerFormFor, setAnswerFormFor] = useState(null);
  const [replyFormFor, setReplyFormFor] = useState(null);

  useEffect(() => {
    fetchQnA();
  }, [courseId, chapterId]);

  const fetchQnA = async () => {
    const res = await axios.get(`${config.backendUrl}/api/qna/${courseId}/${chapterId}`);
    setQuestions(Array.isArray(res.data) ? res.data : []);
  };

  const formatTime = (dateStr) => new Date(dateStr).toLocaleString();

  const handleAsk = async () => {
    if (!newQ.trim()) return;
    await axios.post(`${config.backendUrl}/api/qna`, {
      courseId, chapterId, userId, question: newQ
    });
    setNewQ('');
    fetchQnA();
  };

  const handleAnswer = async (qid) => {
    const text = answers[qid]?.trim();
    if (!text) return;
    await axios.post(`${config.backendUrl}/api/qna/answer`, {
      questionId: qid, userId, answer: text
    });
    setAnswers(prev => ({ ...prev, [qid]: '' }));
    setAnswerFormFor(null);
    fetchQnA();
  };

  const handleReply = async (qid, aid) => {
    const text = replies[aid]?.trim();
    if (!text) return;
    await axios.post(`${config.backendUrl}/api/qna/reply`, {
      questionId: qid, answerId: aid, userId, reply: text
    });
    setReplies(prev => ({ ...prev, [aid]: '' }));
    setReplyFormFor(null);
    fetchQnA();
  };

  const handleLikeQuestion = async (qid, e) => {
    e.stopPropagation();
    await axios.post(`${config.backendUrl}/api/qna/like-question`, { questionId: qid, userId });
    fetchQnA();
  };

  const handleLikeAnswer = async (qid, aid) => {
    await axios.post(`${config.backendUrl}/api/qna/like-answer`, { questionId: qid, answerId: aid, userId });
    fetchQnA();
  };

  return (
    <div className="qna-box">
      <h3>Ask a Question</h3>
      <textarea
        value={newQ}
        onChange={(e) => setNewQ(e.target.value)}
        placeholder="Type your question..."
      />
      <button onClick={handleAsk}>Post Question</button>

      <div className="questions-list">
        {questions.map(q => {
          const isOpen = expandedId === q._id;
          return (
            <div key={q._id} className="q-block" onClick={() => setExpandedId(isOpen ? null : q._id)}>
              <p className="q-text">Q: {q.question}</p>
              <small>Posted by: {q.userId?.name || 'Anonymous'} · {formatTime(q.createdAt)}</small>
              <div className="q-meta">
                <span>{q.answers.length} answers</span>
                <button onClick={(e) => {handleLikeQuestion(q._id, e); e.stopPropagation();}}>❤️ {q.likes?.length || 0}</button>
              </div>

              {isOpen && (
                <div className="expanded-section">
                  <div className="answers">
                    {q.answers.map((a, i) => (
                      <div className="a-block" key={a._id}>
                        <p className="a-text">Ans: {a.answer}</p>
                        <small>by {a.userId?.name || 'Anonymous'} · {formatTime(a.createdAt)}</small>
                        <div className="a-meta">
                          <button onClick={(e) => {handleLikeAnswer(q._id, a._id); e.stopPropagation();}}>❤️ {a.likes?.length || 0}</button>
                          <button onClick={(e) => { e.stopPropagation(); setReplyFormFor(replyFormFor === a._id ? null : a._id); }}>
                            Reply
                          </button>
                        </div>

                        <div className="replies">
                          {a.replies?.map((r, idx) => (
                            <p key={idx} className="reply-line">↳ {r.reply} <small>({r.userId?.name || 'Anon'} · {formatTime(r.createdAt)})</small></p>
                          ))}
                          {replyFormFor === a._id && (
                            <>
                              <textarea
                                placeholder="Write a reply..."
                                value={replies[a._id] || ''}
                                onChange={(e) => setReplies(prev => ({ ...prev, [a._id]: e.target.value }))}
                                onClick={(e) => {e.stopPropagation();}}
                              />
                              <button onClick={(e) => {handleReply(q._id, a._id); e.stopPropagation();}}>Post Reply</button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="answer-control">
                    <button onClick={(e) => { e.stopPropagation(); setAnswerFormFor(answerFormFor === q._id ? null : q._id); }}>
                      Answer
                    </button>
                    {answerFormFor === q._id && (
                      <>
                        <textarea
                          placeholder="Write your answer..."
                          value={answers[q._id] || ''}
                          onChange={(e) => setAnswers(prev => ({ ...prev, [q._id]: e.target.value }))}
                          onClick={(e) => {e.stopPropagation();}}
                        />
                        <button onClick={(e) => {handleAnswer(q._id); e.stopPropagation();}}>Submit Answer</button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

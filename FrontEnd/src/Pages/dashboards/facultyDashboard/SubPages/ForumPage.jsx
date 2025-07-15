import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Forum.css';
import config from '../../../../config/config';
import { useAuth } from '../../../../context/AuthContext';
import { assets } from '../../../../assets/assets';

const avatarMap = {
  '1.jpg': assets.avatar1,
  '2.jpg': assets.avatar2,
  '3.jpg': assets.avatar3,
  '4.jpg': assets.avatar4,
  '5.jpg': assets.avatar5,
};

export default function ForumPage() {
  const { user } = useAuth();
  const userId = user?._id;
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [category, setCategory] = useState('general');
  const [responses, setResponses] = useState({});
  const [replies, setReplies] = useState({});
  const [replyFormFor, setReplyFormFor] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const res = await axios.get(`${config.backendUrl}/api/forum`);
    setPosts(Array.isArray(res.data) ? res.data : []);
  };

  const formatTime = (d) => new Date(d).toLocaleString();

  const handleNewPost = async () => {
    if (!newPost.trim()) return;
    await axios.post(`${config.backendUrl}/api/forum`, { userId, question: newPost, category });
    setNewPost('');
    fetchPosts();
  };

  const handleResponse = async (postId) => {
    const text = responses[postId]?.trim();
    if (!text) return;
    const postType = posts.find(p => p._id === postId)?.category;
    const endpoint = postType === 'doubt' ? 'answer' : 'comment';
    await axios.post(`${config.backendUrl}/api/forum/${endpoint}`, {
      questionId: postId, userId, answer: text, comment: text
    });
    setResponses(prev => ({ ...prev, [postId]: '' }));
    fetchPosts();
  };

  const handleReply = async (postId, answerId) => {
    const text = replies[answerId]?.trim();
    if (!text) return;
    await axios.post(`${config.backendUrl}/api/forum/reply`, {
      questionId: postId, answerId, userId, reply: text
    });
    setReplies(prev => ({ ...prev, [answerId]: '' }));
    setReplyFormFor(null);
    fetchPosts();
  };

  const handleLike = async (postId, e) => {
    e.stopPropagation();
    await axios.post(`${config.backendUrl}/api/forum/like-question`, { questionId: postId, userId });
    fetchPosts();
  };

  return (
    <div className="forum-page">
      <header className="forum-header">
        <h1>💬 EDU[LAB] Community Forum</h1>
        <p>Ideas. Doubts. Feedback. All in one feed.</p>
      </header>

      <main className="forum-container">
        <section className="forum-new-post">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Start a post..."
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="general">General</option>
            <option value="doubt">Doubt</option>
            <option value="idea">Idea</option>
            <option value="feedback">Feedback</option>
          </select>
          <button onClick={handleNewPost}>Post</button>
        </section>

        <section className="forum-list">
          {posts.map(post => {
            const isOpen = expandedId === post._id;
            return (
              <div
                key={post._id}
                className="forum-post"
                onClick={() => setExpandedId(isOpen ? null : post._id)}
              >
                <div className="forum-post-header">
                  <img
                    className="forum-avatar"
                    src={avatarMap[post.userId?.avatar || '1.jpg']}
                    alt="avatar"
                  />
                  <div>
                    <h4>{post.userId?.name || 'Anonymous'}</h4>
                    <small>{formatTime(post.createdAt)} · #{post.category}</small>
                  </div>
                </div>

                <p className="forum-question">{post.question}</p>

                <div className="forum-post-meta">
                  <button onClick={(e) => handleLike(post._id, e)}>
                    {post.likes?.includes(userId) ? '💖' : '🤍'} {post.likes?.length || 0}
                  </button>
                  <span>{post.answers?.length || 0} {post.category === 'doubt' ? 'answers' : 'comments'}</span>
                </div>

                {isOpen && (
                  <div className="forum-expanded">
                    {(post.answers || []).map((a) => (
                      <div className="forum-answer" key={a._id}>
                        <div className="forum-post-header">
                          <img
                            className="forum-avatar"
                            src={avatarMap[a.userId?.avatar || '1.jpg']}
                            alt="avatar"
                          />
                          <div>
                            <p className="forum-answer-text">{a.answer}</p>
                            <small>— {a.userId?.name || 'Anon'} · {formatTime(a.createdAt)}</small>
                          </div>
                        </div>

                        <div className="forum-answer-meta">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setReplyFormFor(replyFormFor === a._id ? null : a._id);
                            }}
                          >
                            Reply
                          </button>
                        </div>

                        <div className="forum-replies">
                          {(a.replies || []).map((r, idx) => (
                            <p key={idx} className="forum-reply-line">
                              ↳ {r.reply} <small>({r.userId?.name || 'Anon'} · {formatTime(r.createdAt)})</small>
                            </p>
                          ))}

                          {replyFormFor === a._id && (
                            <>
                              <textarea
                                value={replies[a._id] || ''}
                                onChange={(e) => setReplies(prev => ({ ...prev, [a._id]: e.target.value }))}
                                placeholder="Write a reply..."
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReply(post._id, a._id);
                                }}
                              >
                                Post Reply
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="forum-answer-control">
                      <textarea
                        placeholder={post.category === 'doubt' ? 'Write your answer...' : 'Write a comment...'}
                        value={responses[post._id] || ''}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setResponses(prev => ({ ...prev, [post._id]: e.target.value }))}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResponse(post._id);
                        }}
                      >
                        {post.category === 'doubt' ? 'Submit Answer' : 'Comment'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

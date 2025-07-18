import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Forum.css';
import config from '../../../../config/config';
import { useAuth } from '../../../../context/AuthContext';
import { assets } from '../../../../assets/assets';
import PageTitle from '../../../../PageTitle';

const avatarMap = {
  '1.jpg': assets.avatar1,
  '2.jpg': assets.avatar2,
  '3.jpg': assets.avatar3,
  '4.jpg': assets.avatar4,
  '5.jpg': assets.avatar5,
  '6.png': assets.avatar6,
  '7.png': assets.avatar7,
  '8.png': assets.avatar8,
  '9.png': assets.avatar9,
  '10.png': assets.avatar10,
};

export default function ForumPage() {
  const { user, loading } = useAuth();

  const userId = user?._id;
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [category, setCategory] = useState('general');
  const [responses, setResponses] = useState({});
  const [replies, setReplies] = useState({});
  const [replyFormFor, setReplyFormFor] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [feedFilter, setFeedFilter] = useState('all'); // 'all', 'my', 'saved', 'job'
  
  const totalPosts = posts.length;
  const totalLikesAll = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
  const userPosts = posts.filter(p => p.userId?._id === userId);
  const userLikes = userPosts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
  
  // Avoid division by zero
  const popularityScore = totalPosts > 0 && totalLikesAll > 0
  ? ((userPosts.length * userLikes) / (totalPosts * totalLikesAll)) * 100
  : 0;
  
  if (loading) return null;


  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchPosts = async () => {
    const res = await axios.get(`${config.backendUrl}/api/forum`);
    setPosts(Array.isArray(res.data) ? res.data : []);
  };

  const formatTime = (d) => new Date(d).toLocaleString();

  const handleNewPost = async () => {
    if (!newPost.trim() && !file) return;

    let fileUrl = '';
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      setUploading(true);
      try {
        const uploadRes = await axios.post(`${config.backendUrl}/api/forum/upload`, formData);
        fileUrl = uploadRes.data.url;
      } catch (err) {
        console.error("Upload failed", err);
        alert("File upload failed");
      } finally {
        setUploading(false);
      }
    }

    await axios.post(`${config.backendUrl}/api/forum`, {
      userId,
      question: newPost,
      category,
      mediaUrl: fileUrl,
    });

    setNewPost('');
    setFile(null);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };


  return (
    <div className="forum-page">
      <PageTitle title="Community" />

      <main className="forum-container">
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ flex: 0.8 }}>
            <div className="forum-leftbar">
              <div className="forum-profile-card">
                <img src={avatarMap[user?.avatar || '1.jpg']} alt="avatar" className="forum-profile-avatar" />
                <h3>{user?.name || 'Anonymous'}</h3>
                <p className="forum-profile-subtitle">{user?.role}</p>
                <p className="forum-profile-org">{user?.institution}</p>
              </div>

              <div className="forum-profile-stats">
                <div className="forum-profile-stat">
                  <span>Total Posts</span>
                  <strong>{userPosts.length}</strong>
                </div>
                <div className="forum-profile-stat">
                  <span>Post impressions</span>
                  <strong>{userLikes}</strong>
                </div>
                <div className="forum-profile-stat">
                  <span>Influence</span>
                  <strong>{popularityScore.toFixed(0)}%</strong>
                </div>

              </div>
              <div className="forum-feed-filter-box">
                <div
                  className={`forum-feed-filter-item ${feedFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setFeedFilter('all')}
                >
                  <img src='https://storage.googleapis.com/edu-lab/27.png' alt="all" className="forum-icon-m" />
                  All Posts
                </div>
                <div
                  className={`forum-feed-filter-item ${feedFilter === 'my' ? 'active' : ''}`}
                  onClick={() => setFeedFilter('my')}
                >
                  <img src='https://storage.googleapis.com/edu-lab/28.png' alt="my" className="forum-icon-m" />
                  My Posts
                </div>
                <div
                  className={`forum-feed-filter-item ${feedFilter === 'saved' ? 'active' : ''}`}
                >
                  <img src='https://storage.googleapis.com/edu-lab/29.png' alt="saved" className="forum-icon-lm" />
                  Saved Posts
                </div>
                <div
                  className={`forum-feed-filter-item ${feedFilter === 'job' ? 'active' : ''}`}
                >
                  <img src='https://storage.googleapis.com/edu-lab/30.png' alt="job" className="forum-icon-lm" />
                  Job Posts
                </div>
              </div>

            </div>
          </div>
          <div style={{ flex: 1.9 }}>
            <section className="forum-new-post">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                <div className="forum-type-select">
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="general">General</option>
                    <option value="doubt">Doubt</option>
                    <option value="idea">Idea</option>
                  </select>
                </div>
                <button className="forum-post-submit" onClick={handleNewPost} disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Post'}
                </button>
              </div>
              <div className="forum-new-post-input">
                <img
                  src={avatarMap[user?.avatar || '1.jpg']}
                  alt="avatar"
                  className="forum-avatar"
                />
                <textarea
                  
                  placeholder="Start a post"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  
                />
              </div>

              {file && (
                <div className="forum-preview-block">
                  {file.type.startsWith('image/') ? (
                    <img src={previewUrl} alt="preview" className="forum-preview-media" />
                  ) : file.type.startsWith('video/') ? (
                    <video
                      src={previewUrl}
                      controls
                      className="forum-preview-media"
                      muted
                    />
                  ) : (
                    <div className="forum-doc-preview">
                      <img src="/assets/icons/doc-icon.png" alt="doc" className="forum-icon-sm" />
                      <span>{file.name}</span>
                    </div>
                  )}
                </div>
              )}

              <input type="file" id="uploadVideo" accept="video/*" hidden onChange={(e) => handleFileChange(e)}/>
              <input type="file" id="uploadPhoto" accept="image/*" hidden onChange={(e) => handleFileChange(e)} />
              <input type="file" id="uploadDoc" hidden onChange={(e) => handleFileChange(e)} />

              <div className="forum-upload-actions">
                <button onClick={() => document.getElementById('uploadVideo').click()}>
                  <img src={assets.videoIcon} alt="video" className="forum-icon" />
                  <span>Video</span>
                </button>
                <button onClick={() => document.getElementById('uploadPhoto').click()}>
                  <img src={assets.imageIcon} alt="photo" className="forum-icon" />
                  <span>Photo</span>
                </button>
                <button onClick={() => document.getElementById('uploadDoc').click()}>
                  <img src={assets.docIcon} alt="doc" className="forum-icon" />
                  <span>Document</span>
                </button>
              </div>


            </section>

            <section className="forum-list">
              {posts
              .filter(post => {
                if (feedFilter === 'my') return post.userId?._id === userId;
                if (feedFilter === 'saved') return false; // placeholder
                if (feedFilter === 'job') return false;   // placeholder
                return true; // all feeds
              })
              .filter(post =>
                post.question?.toLowerCase().includes(searchText.toLowerCase())
              )
              .map(post => {

                const isOpen = expandedId === post._id;
                return (
                  <div key={post._id} className="forum-post" onClick={() => setExpandedId(isOpen ? null : post._id)}>
                    <div className="forum-post-header">
                      <img className="forum-avatar" src={avatarMap[post.userId?.avatar || '1.jpg']} alt="avatar" />
                      <div className="forum-user-meta">
                        <h4>{post.userId?.name || 'Anonymous'}</h4>
                        <small>{formatTime(post.createdAt)} · #{post.category}</small>
                      </div>
                    </div>

                    <div className="forum-post-body">{post.question}</div>

                    {post.mediaUrl && (
                      <div className="forum-post-media">
                        {post.mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                          <img src={post.mediaUrl} alt="media" />
                        ) : post.mediaUrl.match(/\.(mp4|webm)$/i) ? (
                          <video controls><source src={post.mediaUrl} /></video>
                        ) : (
                          <a href={post.mediaUrl} target="_blank" rel="noreferrer">📄 View Document</a>
                        )}
                      </div>
                    )}

                    <div className="forum-post-meta">
                      <button>
                        {post.likes?.includes(userId) ? <img src={assets.likeIcon} alt="like" className="forum-icon-sm" /> : <img src={assets.likeFilledIcon} alt="like" className="forum-icon-sm" /> } {post.likes?.length || 0}
                      </button>
                      <span>{post.answers?.length || 0} {post.category === 'doubt' ? 'answers' : 'comments'}</span>
                    </div>

                    <div className="forum-post-actions">
                      <button onClick={(e) => handleLike(post._id, e)}>
                        <img
                          src={post.likes?.includes(userId)
                            ? assets.likeIcon
                            : assets.likeFilledIcon}
                          alt="like"
                          className="forum-icon-sm"
                        />
                        <span>Like</span>
                      </button>
                      <button>
                        <img src={assets.commentIcon} alt="comment" className="forum-icon-sm" />
                        <span>Comment</span>
                      </button>
                      <button>
                        <img src={assets.reshareIcon} alt="repost" className="forum-icon-sm" />
                        <span>Repost</span>
                      </button>
                      <button>
                        <img src={assets.sendIcon} alt="send" className="forum-icon-sm" />
                        <span>Send</span>
                      </button>
                    </div>


                    {isOpen && (
                      <div className="forum-expanded">
                        {(post.answers || []).map((a) => (
                          <div className="forum-answer" key={a._id}>
                            <div className="forum-post-header">
                              <img className="forum-avatar" src={avatarMap[a.userId?.avatar || '1.jpg']} alt="avatar" />
                              <div>
                                <p className="forum-answer-text">{a.answer}</p>
                                <small>— {a.userId?.name || 'Anon'} · {formatTime(a.createdAt)}</small>
                              </div>
                            </div>
                            <div className="forum-answer-meta">
                              <button onClick={(e) => {
                                e.stopPropagation();
                                setReplyFormFor(replyFormFor === a._id ? null : a._id);
                              }}>Reply</button>
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
                                  <button onClick={(e) => {
                                    e.stopPropagation();
                                    handleReply(post._id, a._id);
                                  }}>
                                    Post Reply
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="forum-answer-control">
                          <input
                            type="text"
                            placeholder={post.category === 'doubt' ? 'Write your answer...' : 'Write a comment...'}
                            value={responses[post._id] || ''}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setResponses(prev => ({ ...prev, [post._id]: e.target.value }))}
                          />
                          <button onClick={(e) => {
                            e.stopPropagation();
                            handleResponse(post._id);
                          }}>
                            {post.category === 'doubt' ? 'Submit Answer' : 'Comment'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          </div>

          {/* Right Sidebar */}
          <div style={{ flex: 1 }}>
            <div className="forum-sidebar">
              <input
                type="text"
                placeholder="Search posts..."
                className="forum-search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <div className="forum-trending">
                <h3>🔥 Trending Posts</h3>
                {[...posts]
                  .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
                  .slice(0, 5)
                  .map((post, i) => (
                    <div key={post._id} className="forum-trending-item">
                      <div className="forum-trending-rank">#{i + 1}</div>
                      <div className="forum-trending-content">
                        <p className="trending-question">
                          {(post.question || '').slice(0, 70)}{post.question.length > 70 ? '...' : ''}
                        </p>
                        <small>
                          {formatTime(post.createdAt)} · {post.likes?.length || 0} likes · #{post.category}
                        </small>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

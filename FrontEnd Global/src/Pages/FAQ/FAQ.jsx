import React, { useState, useEffect } from 'react';
import './FAQ.css';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import MiniNavbar from '../../Component/Navbar/MiniNavbar';
import { assets } from '../../assets/assets';
import config from '../../config/config';
import { toast } from 'react-toastify';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [questionInput, setQuestionInput] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const fetchFaqs = async () => {
    try {
      const res = await fetch(`${config.backendUrl}/api/faq/all`);
      const data = await res.json();
      setFaqs(data);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAddFAQ = async () => {
    if (!questionInput.trim()) return alert('Enter a question');
    try {
      await fetch(`${config.backendUrl}/api/faq/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionInput, answer: 'Pending answer' }),
      });
      setQuestionInput('');
      fetchFaqs(); // refresh list
    } catch (err) {
      toast.error('Error saving FAQ');
    }
  };

  const mid = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, mid);
  const rightFaqs = faqs.slice(mid);

  return (
    <>
      <NavbarWhite />
      <MiniNavbar />
      <div className="faq-container">
        <h1>Frequently Asked Questions</h1>
        <p>Still curious about <span>EDU[LAB]</span>? Fire your questions into our <span>“Drop Your Questions”</span> box below or browse the <span>FAQs</span> for the inside scoop!</p>

        <section className="faq-list">
          <input
            type="text"
            placeholder="Drop your question here"
            className="faq-search"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          <img
            src={assets.crossIcon}
            alt="Add"
            className='addBtn'
            onClick={handleAddFAQ}
          />

          <div className="question-container">
            <div className="q-c-left">
              {leftFaqs.map((item, i) => (
                <div key={item._id} className="faq-item">
                  <div className="faq-question" onClick={() => toggleIndex(i)}>
                    {item.question}
                    <span>{activeIndex === i ? '−' : '+'}</span>
                  </div>
                  {activeIndex === i && <div className="faq-answer">{item.answer}</div>}
                </div>
              ))}
            </div>
            <div className="q-c-right">
              {rightFaqs.map((item, i) => {
                const idx = i + mid;
                return (
                  <div key={item._id} className="faq-item">
                    <div className="faq-question" onClick={() => toggleIndex(idx)}>
                      {item.question}
                      <span>{activeIndex === idx ? '−' : '+'}</span>
                    </div>
                    {activeIndex === idx && <div className="faq-answer">{item.answer}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FAQ;

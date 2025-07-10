import React, { useEffect, useState } from 'react';
import './Blogs.css';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import MiniNavbar from '../../Component/Navbar/MiniNavbar';
import PageTitle from '../../PageTitle';
import config from '../../config/config';

const Blogs = () => {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${config.backendUrl}/api/blogs/all`);
        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBlog(sorted[0]); // Only latest blog
      } catch (err) {
        console.error('Error fetching Blogs:', err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <>
      <PageTitle title='Blogs' />
      <NavbarWhite />
      <MiniNavbar />
      <div className="blogs-container">
        <h1>{blog?.name || 'Latest Blog'}</h1>
        <p>
          By:
          <span> {blog?.subheading}</span>
        </p>

        <section className="blogs-list">
          {blog ? (
            <div className="blogs-slides">
              {blog.sections.map((section, index) => (
                <div className="slide" key={index}>
                  <div className="slide-content">
                    <div className="slide-text">
                      <h2>{section.title}</h2>
                      <p>{section.description}</p>
                    </div>
                    <div className="slide-image">
                      <img src={section.image} alt={section.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="placeholder-box">No blog found.</div>
          )}
        </section>
      </div>
    </>
  );
};

export default Blogs;

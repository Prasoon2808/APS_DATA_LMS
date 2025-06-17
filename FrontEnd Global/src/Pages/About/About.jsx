import React, { useEffect, useRef } from 'react';
import './About.css';
import NavbarWhite from '../../Component/Navbar/NavbarWhite';
import MiniNavbar from '../../Component/Navbar/MiniNavbar';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { assets } from '../../assets/assets';

// AnimatedBox Component
const AnimatedBox = ({ className = "",children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, scale: 1, transition: { duration: 1.2 } });
    } else {
      controls.start({ opacity: 0, scale: 0.9, transition: { duration: 0.8 } });
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      className={`box ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={controls}
    >
        {children}
    </motion.div>
  );
};

const About = () => {
  const wrapperRef = useRef(null);

  

  return (
    <>
      <NavbarWhite />
      <MiniNavbar />
      <div className="section-wrapper" ref={wrapperRef}>
        {/* Section 1 */}
        <section className="section section1">
          <h2>Introducing Our Purpose in Focus</h2>
          <p>To democratize design education—completely free, self-paced, open-source, built by Indians for Indians (and the world).</p>
          <div className="box-container">
            <div className="left">
              <div className="upper">
                <AnimatedBox >
                    <div className="box1">
                        <h1>Our Mission</h1>
                        <h3>Develop & Empower Parametric Minds</h3>
                        <p>Free education for every student—no questions asked.</p>
                    </div>
                </AnimatedBox>
              </div>
              <div className="lower">
                <div className="lower-left">
                  <AnimatedBox>
                    <div className="box2">
                        <h1>10+</h1>
                        <h3>Years of Pedagogy</h3>
                        <p>SmartLabs’ decade-long heritage of curated workshops, lectures & parametric workflows.</p>
                    </div>
                  </AnimatedBox>
                </div>
                <div className="lower-right">
                  <AnimatedBox >
                    <div className="box3">
                      <img src={assets.about1} alt="" />
                    </div>
                  </AnimatedBox>
                </div>
              </div>
            </div>
            <div className="right">
              <div className="upper">
                <div className="upper-left">
                  <AnimatedBox>
                    <div className="box4">
                        <h1>2000+</h1>
                        <h3>Students Trained</h3>
                        <p>81 cities, 20 countries & a global community of creative thinkers.</p>
                    </div>
                  </AnimatedBox>
                </div>
                <div className="upper-right">
                  <div className="u-r-up">
                    <AnimatedBox>
                      <div className="box5">
                        <h1>100+</h1>
                        <h3>Workshops Delivered</h3>
                      </div>
                    </AnimatedBox>
                  </div>
                  <div className="u-r-low">
                    <AnimatedBox>
                      <div className="box6">
                        <img src={assets.about2} alt="" />
                      </div>
                    </AnimatedBox>
                  </div>
                </div>
              </div>
              <div className="lower">
                <AnimatedBox>
                    <div className="box7">
                        <h1>FREE</h1>
                        <h3>No Hidden Fees</h3>
                        <p>We’ve burned our paid-workshop model so you can learn barrier-free.</p>
                    </div>
                </AnimatedBox>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        {/* <section className="section section2">
          <h2>Section Header</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, illo.</p>
          <div className="box-container">
            <div className="right">
              <div className="upper">
                <div className="upper-left">
                  <AnimatedBox />
                </div>
                <div className="upper-right">
                  <div className="u-r-up">
                    <AnimatedBox />
                  </div>
                  <div className="u-r-low">
                    <AnimatedBox />
                  </div>
                </div>
              </div>
              <div className="lower">
                <AnimatedBox />
              </div>
            </div>
            <div className="left">
              <div className="upper">
                <AnimatedBox />
              </div>
              <div className="lower">
                <div className="lower-left">
                  <div className="l-l-up">
                    <div className="l-l-u-left">
                      <AnimatedBox />
                    </div>
                    <div className="l-l-u-right">
                      <AnimatedBox />
                    </div>
                  </div>
                  <div className="l-l-low">
                    <AnimatedBox />
                  </div>
                </div>
                <div className="lower-right">
                  <div className="l-r-up">
                    <div className="l-r-u-left">
                      <AnimatedBox/>
                    </div>
                    <div className="l-r-u-right">
                      <AnimatedBox/>
                    </div>
                  </div>
                  <div className="l-r-low">
                    <div className="l-r-l-left">
                      <AnimatedBox/>
                    </div>
                    <div className="l-r-l-right">
                      <AnimatedBox/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </>
  );
};

export default About;

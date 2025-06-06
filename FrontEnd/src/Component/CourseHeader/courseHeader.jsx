import React from 'react'
import { assets } from '../../assets/assets'
import './courseHeader.css'

const courseHeader = () => {
  return (
    <div className='courseHeader'>
      <h1 className='heading'>My Courses</h1>
      <section className="skillTag">
        <div className="skillTag_container">
          <div className="skillTag_item">
            <div className="left">
              <img src={assets.streakIcon} alt="" />
              <div className="Content">
                <h2>Weekly Goal</h2>
                <p>Lorem ipsum dolor sit, amet consectetur</p>
              </div>
            </div>
            <img src={assets.editIcon} alt="" />
          </div>
        </div>
        <div className="skillTag_container Search">
          <div className="skillTag_item">
            <div className="left">
      
              <div className="Content">
                <h2>Search</h2>
              </div>
            </div>
            <img src={assets.searchIcon} alt="" />
          </div>
        </div>
        
      </section>
    </div>
  )
}

export default courseHeader
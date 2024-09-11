import SlideShow from "../components/SlideShow";
import '../css/SlideShow.css'
import MiddleSlide from "../components/MiddleSlide"
import '../css/MiddleSlide.css'
import React from 'react';

const Home = () => {
  return (
    <>
      <SlideShow />
      <h5 style={{ textAlign: 'right' }}>미리보기</h5>
      <MiddleSlide />
    </>
  )
}

export default Home;
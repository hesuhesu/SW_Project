import SlideShow from "../components/Home/SlideShow";
import MiddleSlide from "../components/Home/MiddleSlide"
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
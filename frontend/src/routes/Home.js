import React from 'react';
import styled from 'styled-components';
import SlideShow from "../components/Home/SlideShow";
import MiddleSlide from "../components/Home/MiddleSlide"

const Home = () => {
  return (
    <HomeContainer>
      <SlideShow />
      <h5 style={{ textAlign: 'right' }}>미리보기</h5>
      <MiddleSlide />
    </HomeContainer>
  )
}

export default Home;

const HomeContainer = styled.div`
  height: 100vh;
`;
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/MiddleSlide.css';

const HOST = process.env.REACT_APP_HOST;
const PORT = process.env.REACT_APP_PORT;

function SlideShow() {
  const [data, setData] = useState([]);
  const slideTrackRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${HOST}:${PORT}/board/all_board_list`)
      .then((response) => {
        setData(response.data.list);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const slideTrack = slideTrackRef.current;
    const slidesCount = data.length;
    const slideWidth = 300; // 슬라이드의 너비
    let position = 0; // 초기 위치

    const startAnimation = () => {
      setInterval(() => {
        if (position <= -slideWidth * slidesCount) {
          slideTrack.style.transition = 'none';
          position = 0; // 위치를 처음으로 되돌림
          slideTrack.style.transform = `translateX(${position}px)`;
          // 강제로 리플로우 발생 후에 애니메이션 재개
          requestAnimationFrame(() => {
            slideTrack.style.transition = 'transform 1s linear';
            position -= slideWidth; // 슬라이드를 한 칸 왼쪽으로 이동
            slideTrack.style.transform = `translateX(${position}px)`;
          });
        } else {
          position -= slideWidth; // 슬라이드를 한 칸 왼쪽으로 이동
          slideTrack.style.transition = 'transform 1s linear';
          slideTrack.style.transform = `translateX(${position}px)`;
        }
      }, 3000); // 3초마다 슬라이드 전환
    };

    if (slidesCount > 0) {
      startAnimation();
    }
  }, [data]);

  // 무한 슬라이드를 위해 슬라이드를 두 번 복제
  const slides = [...data, ...data]; 

  return (
    <div className="slider">
      <div className="slide-track" ref={slideTrackRef}>
        {slides.map((item, index) => (
          <div className="slide" key={index}>
            <div className="train-card">
              <Link to={`/board_detail/${item._id}`}>
                <h3>{item.title}</h3>
                <p>{item.content.slice(0, 50)}...</p>
                <span>{item.writer}</span> <span>{item.createdAt}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SlideShow;

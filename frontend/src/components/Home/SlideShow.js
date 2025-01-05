import React, { useState, useEffect } from 'react';
import img1 from "./../../assets/img1.png";
import img2 from "./../../assets/img2.jpg";
import img3 from "./../../assets/img3.jpg";
import '../../css/SlideShow.scss'

const SlideShow = () => {
  const [current, setCurrent] = useState(0);
  const images = [img1, img2, img3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prevCurrent) => (prevCurrent + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
  }, [images.length]);

  const ButtonClick = (index) => {
    setCurrent(index);
  };

  return (
    <div className="slideShow">
      <div className="slides">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`slide-${index}`}
            style={{ display: index === current ? 'block' : 'none' }}
          />
        ))}
      </div>
      <div className="buttons">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => ButtonClick(index)}
            className={index === current ? 'active' : ''}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default SlideShow;
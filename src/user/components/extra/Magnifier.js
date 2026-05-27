

import React, { useState } from 'react';

const Magnifier = ({ imageSrc }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setCursorPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div
      className="product-image-zoom"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img src={imageSrc} alt="Product" />
      {isZoomed && (
        <div
          className="zoom-overlay"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
          }}
        ></div>
      )}
    </div>
  );
};

export default Magnifier;

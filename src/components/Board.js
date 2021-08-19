import React, { useState, useEffect } from 'react';

const Board = () => {
  const [img, setImg] = useState('');
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/photos/${Math.floor(Math.random() * 50) + 1}`)
      .then((res) => res.json())
      .then((json) => setImg(json));
  }, []);
  return (
    <div className="board">
      <img src={img.url} alt="랜덤 이미지"></img>
    </div>
  );
};

export default Board;

import React, { useState, useEffect, useRef } from 'react';
import Label from './Label';

function Board(mode) {
  const canvasEl = useRef();
  const [imgUrl, setImgUrl] = useState('');
  const [imgSize, setImgSize] = useState({
    imgWidth: 0,
    imgHeight: 0,
  });
  const [drag, setDrag] = useState(false);
  const [move, setMove] = useState([0, 0]);
  const [labels, setLabels] = useState([]);

  let label_index = 0;

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/photos/${Math.floor(Math.random() * 50) + 1}`)
      .then((res) => res.json())
      .then((json) => setImgUrl(json.url));
  }, []);

  const handleMouseUp = (e) => {
    if (!drag) {
      return;
    }

    const { x, y, x2, y2 } = labels[label_index];

    const updateLabel = {
      x: Math.min(x, x2),
      y: Math.min(y, y2),
      x2: Math.max(x, x2),
      y2: Math.max(y, y2),
    };

    const copyLabels = [...labels];
    copyLabels[label_index] = updateLabel;
    setLabels(copyLabels);

    setDrag(false);
  };

  const handleOnImgLoad = (e) => {
    setImgSize({ imgWidth: e.target.width, imgHeight: e.target.height });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) {
      return;
    }

    const { imgWidth, imgHeight } = imgSize;

    // getBoundingClientRect() : DOM 엘리먼트의 위치를 구한다.
    const rect = canvasEl.current.getBoundingClientRect();

    // 마우스의 위치 구하기
    const mX = (e.clientX - rect.left) / imgWidth;
    const mY = (e.clientY - rect.top) / imgHeight;

    const label = {
      x: Math.min(1, Math.max(0, mX)),
      y: Math.min(1, Math.max(0, mY)),
      x2: Math.min(1, Math.max(0, mX)),
      y2: Math.min(1, Math.max(0, mY)),
    };

    setLabels([label, ...labels]);
    setDrag(true);
    setMove([1, 1]);
  };

  const handleMouseMove = (e) => {
    if (!drag) {
      return;
    }

    const { x, y, x2, y2 } = labels[label_index];
    const { imgWidth, imgHeight } = imgSize;

    const rect = canvasEl.current.getBoundingClientRect();
    const mX = (e.clientX - rect.left) / imgWidth;
    const mY = (e.clientY - rect.top) / imgHeight;

    let newX;
    let newY;
    let newX2;
    let newY2;

    if (move[0] === 0) {
      newX = mX;
      newX2 = x2;
    } else {
      newX = x;
      newX2 = mX;
    }

    if (move[1] === 0) {
      newY = mY;
      newY2 = y2;
    } else {
      newY = y;
      newY2 = mY;
    }

    const updateLabel = {
      x: Math.min(1, Math.max(0, newX)),
      y: Math.min(1, Math.max(0, newY)),
      x2: Math.min(1, Math.max(0, newX2)),
      y2: Math.min(1, Math.max(0, newY2)),
    };

    const copyLabels = [...labels];
    copyLabels[label_index] = updateLabel;
    setLabels(copyLabels);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseUp, handleMouseMove]);

  return (
    <div className="board">
      <img
        ref={canvasEl}
        onMouseDown={handleMouseDown}
        alt="img"
        src={imgUrl}
        draggable={false}
        onLoad={handleOnImgLoad}
        onDragStart={(e) => {
          e.preventDefault();
        }}
      />
      {labels.map((label, i) => (
        <Label key={i} index={i} data={label} imgSize={imgSize} />
      ))}
    </div>
  );
}

export default Board;

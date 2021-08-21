import React, { useState, useEffect, useRef } from 'react';
import Label from './Label';

function Board({ mode }) {
  const canvasEl = useRef();
  const [imgUrl, setImgUrl] = useState('');
  const [imgSize, setImgSize] = useState({
    imgWidth: 0,
    imgHeight: 0,
  });
  const [drag, setDrag] = useState(false);
  const [targetIndex, setTargetIndex] = useState(null);
  const [move, setMove] = useState([0, 0]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    // 이미지 가져오기
    fetch(`https://jsonplaceholder.typicode.com/photos/${Math.floor(Math.random() * 50) + 1}`)
      .then((res) => res.json())
      .then((json) => setImgUrl(json.url));
  }, []);

  const handleMouseUp = (e) => {
    if (!drag) {
      return;
    }

    let index = targetIndex || 0;
    const { x, y, x2, y2 } = labels[index];

    const updateLabel = {
      x: Math.min(x, x2),
      y: Math.min(y, y2),
      x2: Math.max(x, x2),
      y2: Math.max(y, y2),
    };

    const copyLabels = [...labels];
    copyLabels[index] = updateLabel;
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

    if (mode === 'create') {
      setTargetIndex(null);
      const label = {
        x: Math.min(1, Math.max(0, mX)),
        y: Math.min(1, Math.max(0, mY)),
        x2: Math.min(1, Math.max(0, mX)),
        y2: Math.min(1, Math.max(0, mY)),
      };
      setLabels([label, ...labels]);
      setDrag(true);
      setMove([1, 1]);
    }
    if (mode === 'select') {
      let isTarget = identifyLabel(mX, mY);
      console.log(isTarget);
      if (isTarget) {
        setDrag(true);
        setMove([mX, mY]);
      } else {
        setDrag(false);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!drag) {
      return;
    }
    let index = targetIndex || 0;
    const { x, y, x2, y2 } = labels[index];

    const { imgWidth, imgHeight } = imgSize;

    const rect = canvasEl.current.getBoundingClientRect();
    const mX = (e.clientX - rect.left) / imgWidth;
    const mY = (e.clientY - rect.top) / imgHeight;

    let newX;
    let newY;
    let newX2;
    let newY2;

    if (mode === 'select') {
      newX = x + mX - move[0];
      newY = y + mY - move[1];
      newX2 = x2 + mX - move[0];
      newY2 = y2 + mY - move[1];
      setMove([mX, mY]);
    }

    if (mode === 'create') {
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
    }

    const updateLabel = {
      x: Math.min(1, Math.max(0, newX)),
      y: Math.min(1, Math.max(0, newY)),
      x2: Math.min(1, Math.max(0, newX2)),
      y2: Math.min(1, Math.max(0, newY2)),
    };

    const copyLabels = [...labels];
    copyLabels[index] = updateLabel;
    setLabels(copyLabels);
  };

  const identifyLabel = (x, y) => {
    // 선택한 라벨 식별하기
    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];

      if (x >= label.x && x <= label.x2 && y >= label.y && y <= label.y2) {
        setTargetIndex(i);
        return true;
      }
    }
    return false;
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
    <div className="board" onMouseDown={handleMouseDown}>
      <img
        className="board_img"
        ref={canvasEl}
        alt="img"
        src={imgUrl}
        draggable={false}
        onLoad={handleOnImgLoad}
        onDragStart={(e) => {
          e.preventDefault();
        }}
      />
      {mode === 'create'
        ? labels.map((label, i) => <Label key={i} index={i} data={label} imgSize={imgSize} />)
        : labels.map((label, i) =>
            i === targetIndex ? <Label key={i} index={i} data={label} imgSize={imgSize} selected={true} /> : <Label key={i} index={i} data={label} imgSize={imgSize} selected={false} />
          )}
    </div>
  );
}

export default Board;

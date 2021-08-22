import React, { useState, useEffect, useRef, useCallback } from 'react';
import Label from './Label';
import LabelCorner from './LabelCorner';

function Board({ mode }) {
  const canvasEl = useRef();
  const [imgUrl, setImgUrl] = useState(''); // 이미지 Url
  const [imgSize, setImgSize] = useState({
    imgWidth: 0,
    imgHeight: 0,
  }); // 가져온 이미지 사이즈
  const [drag, setDrag] = useState(false); // 드래그 활성화 Boolean 값
  const [targetIndex, setTargetIndex] = useState(''); // 타겟으로 삼고 있는 인덱스
  const [selectedIndex, setSelectedIndex] = useState([]); // 선택된 라벨들의 인덱스 값
  const [move, setMove] = useState([0, 0]); // 라벨을 기준으로 한 마우스 좌표 값
  const [labels, setLabels] = useState([]); // 생성된 라벨들

  useEffect(() => {
    // 이미지 가져오기
    fetch(`https://jsonplaceholder.typicode.com/photos/${Math.floor(Math.random() * 50) + 1}`)
      .then((res) => res.json())
      .then((json) => setImgUrl(json.url));
  }, []);

  const handleMouseUp = useCallback(
    (e) => {
      if (!drag) {
        return;
      }

      let index = targetIndex === 0 || targetIndex ? targetIndex : labels.length - 1;
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
      setTargetIndex('');
    },
    [drag, labels, targetIndex]
  );

  const handleOnImgLoad = (e) => {
    setImgSize({ imgWidth: e.target.width, imgHeight: e.target.height });
  };

  const handleCanvasDragStart = (e) => {
    if (e.button !== 0 || mode !== 'create') {
      return;
    }

    const { imgWidth, imgHeight } = imgSize;

    // getBoundingClientRect() : DOM 엘리먼트의 위치를 구한다.
    const rect = canvasEl.current.getBoundingClientRect();

    // 마우스의 위치 구하기
    // clientX : 브라우저를 기준으로 한 마우스의 포인터
    const mX = (e.clientX - rect.left) / imgWidth;
    const mY = (e.clientY - rect.top) / imgHeight;

    const label = {
      x: Math.min(1, Math.max(0, mX)),
      y: Math.min(1, Math.max(0, mY)),
      x2: Math.min(1, Math.max(0, mX)),
      y2: Math.min(1, Math.max(0, mY)),
    };

    setLabels([...labels, label]);
    setDrag(true); // 드래그 활성화
    setMove([1, 1]);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!drag) {
        return;
      }

      let index = targetIndex === 0 || targetIndex ? targetIndex : labels.length - 1;

      const { x, y, x2, y2 } = labels[index];

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
      } else if (move[0] === 1) {
        newX = x;
        newX2 = mX;
      } else {
        newX = x + mX - move[0];
        newX2 = x2 + mX - move[0];
      }

      if (move[1] === 0) {
        newY = mY;
        newY2 = y2;
      } else if (move[1] === 1) {
        newY = y;
        newY2 = mY;
      } else {
        newY = y + mY - move[1];
        newY2 = y2 + mY - move[1];
        setMove([mX, mY]);
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
    },
    [drag, imgSize, labels, move, targetIndex]
  );

  const handleCornerDrag = (e, index) => {
    if (e.button !== 0 || mode !== 'select') {
      return;
    }

    const id = e.target.id;
    const move = [0, 0];
    if (id.startsWith('0')) {
      move[0] = 0;
    } else {
      move[0] = 1;
    }
    if (id.endsWith('0')) {
      move[1] = 0;
    } else {
      move[1] = 1;
    }
    setMove(move);
    setDrag(true);
    setTargetIndex(index);
  };

  const handleLabelDrag = (e, index) => {
    if (e.button !== 0 || mode !== 'select') {
      return;
    }

    // 라벨 다중 선택 기능 : index가 추가 되어있지 않다면 selectedIndex에 추가한다.
    selectedIndex.includes(index) || setSelectedIndex([...selectedIndex, index]);

    const { imgWidth, imgHeight } = imgSize;

    const rect = canvasEl.current.getBoundingClientRect();

    const mX = (e.clientX - rect.left) / imgWidth;
    const mY = (e.clientY - rect.top) / imgHeight;

    setMove([mX, mY]);
    setDrag(true);
    setTargetIndex(index);
  };

  const onDoubleClickLabel = (e, index) => {
    if (e.button !== 0 || mode !== 'select') {
      return;
    }
    // 라벨 선택 취소 기능 : index가 추가 되어 있다면, 삭제한다.
    selectedIndex.includes(index) && setSelectedIndex(selectedIndex.filter((item) => index !== item));
  };

  const handleKeyDown = useCallback(
    (e) => {
      // 라벨 삭제 기능

      if (mode === 'select' && (e.keyCode === 8 || e.keyCode === 46)) {
        let filterLabels = labels.filter((label, i) => !selectedIndex.includes(i));
        setLabels(filterLabels);
        setSelectedIndex([]);
      }
    },
    [labels, selectedIndex]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="board" onMouseDown={handleCanvasDragStart} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <img
        ref={canvasEl}
        alt="img"
        src={imgUrl}
        draggable={false}
        onLoad={handleOnImgLoad}
        onDragStart={(e) => {
          e.preventDefault();
        }}
      />
      {mode === 'create' && labels.map((label, i) => <Label key={i} index={i} data={label} imgSize={imgSize} />)}

      {mode === 'select' &&
        labels.map((label, i) =>
          selectedIndex.includes(i) ? (
            <div key={i}>
              <Label index={i} data={label} imgSize={imgSize} handleLabelDrag={handleLabelDrag} onDoubleClickLabel={onDoubleClickLabel} />
              <LabelCorner index={i} data={label} imgSize={imgSize} handleCornerDrag={handleCornerDrag} />
            </div>
          ) : (
            <Label key={i} index={i} data={label} imgSize={imgSize} handleLabelDrag={handleLabelDrag} />
          )
        )}
    </div>
  );
}

export default Board;

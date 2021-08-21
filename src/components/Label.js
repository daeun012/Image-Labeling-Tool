import React from 'react';

function Label({ index, data, imgSize, handleLabelDrag, onDoubleClickLabel }) {
  const { x, y, x2, y2 } = data;
  const { imgWidth, imgHeight } = imgSize;

  const dimensions = {
    left: x > x2 ? Math.round(x2 * imgWidth) : Math.round(x * imgWidth),
    top: y > y2 ? Math.round(y2 * imgHeight) : Math.round(y * imgHeight),
    width: Math.abs(Math.round((x2 - x) * imgWidth)),
    height: Math.abs(Math.round((y2 - y) * imgHeight)),
  };

  const onLabelGrabbed = (e) => {
    handleLabelDrag(e, index);
  };
  const handleUnSelected = (e) => {
    onDoubleClickLabel(e, index);
  };

  return handleLabelDrag ? <div className="label" style={dimensions} onMouseDown={onLabelGrabbed} onDoubleClick={handleUnSelected}></div> : <div className="label" style={dimensions}></div>;
}

export default Label;

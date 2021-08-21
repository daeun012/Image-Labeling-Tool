import React from 'react';

function LabelCorner({ index, data, imgSize, handleCornerDrag }) {
  const { x, y, x2, y2 } = data;
  const { imgWidth, imgHeight } = imgSize;

  const dimensions = {
    left: x > x2 ? Math.round(x2 * imgWidth) : Math.round(x * imgWidth),
    top: y > y2 ? Math.round(y2 * imgHeight) : Math.round(y * imgHeight),
    width: Math.abs(Math.round((x2 - x) * imgWidth)),
    height: Math.abs(Math.round((y2 - y) * imgHeight)),
  };

  const onCornerGrabbed = (e) => {
    handleCornerDrag(e, index);
  };

  return (
    <div className="labelCorner" style={dimensions}>
      <div id="00" onMouseDown={onCornerGrabbed} className="topLeft" />
      <div id="10" onMouseDown={onCornerGrabbed} className="topRight" />
      <div id="11" onMouseDown={onCornerGrabbed} className="bottomRight" />
      <div id="01" onMouseDown={onCornerGrabbed} className="bottomLeft" />
    </div>
  );
}

export default LabelCorner;

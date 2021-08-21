const Label = ({ data, imgSize, selected }) => {
  const { x, y, x2, y2 } = data;

  const { imgWidth, imgHeight } = imgSize;

  const dimensions = {
    left: x > x2 ? Math.round(x2 * imgWidth) : Math.round(x * imgWidth),
    top: y > y2 ? Math.round(y2 * imgHeight) : Math.round(y * imgHeight),
    width: Math.abs(Math.round((x2 - x) * imgWidth)),
    height: Math.abs(Math.round((y2 - y) * imgHeight)),
  };

  return selected ? (
    <div className="label" style={dimensions}>
      <div className="topLeft" />
      <div className="topRight" />
      <div className="bottomRight" />
      <div className="bottomLeft" />
    </div>
  ) : (
    <div className="label" style={dimensions}></div>
  );
};

export default Label;

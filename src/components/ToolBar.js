function ToolBar({ mode, activeMode }) {
  return (
    <div className="toolBar">
      {mode === 'select' ? (
        <div>
          <div className="selectButton buttonActive" onClick={() => activeMode('select')}></div>
          <div className="createButton" onClick={() => activeMode('create')}></div>
        </div>
      ) : (
        <div>
          <div className="selectButton" onClick={() => activeMode('select')}></div>
          <div className="createButton buttonActive" onClick={() => activeMode('create')}></div>
        </div>
      )}
    </div>
  );
}

export default ToolBar;

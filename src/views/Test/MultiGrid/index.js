import React from 'react';
import {MultiGrid} from 'react-virtualized';

const STYLE = {
  margin: '20px',
  border: '1px solid #ddd',
};

const STYLE_BOTTOM_LEFT_GRID = {
  borderRight: '2px solid #aaa',
  backgroundColor: '#f7f7f7',
};

const STYLE_TOP_LEFT_GRID = {
  borderBottom: '2px solid #aaa',
  borderRight: '2px solid #aaa',
  fontWeight: 'bold',
};

const STYLE_TOP_RIGHT_GRID = {
  borderBottom: '2px solid #aaa',
  fontWeight: 'bold',
};

const cellRenderer = ({ columnIndex, key, rowIndex, style }) => {
  return <div key={key} style={style}>{columnIndex}:{rowIndex}</div>;
};

const MGrid = () => {
  return (
    <MultiGrid
      cellRenderer={cellRenderer}
      columnWidth={75}
      columnCount={50}
      fixedColumnCount={0}
      fixedRowCount={1}
      height={600}
      rowHeight={40}
      rowCount={100}
      width={800}
      style={STYLE}
      styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
      styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
      styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
    />
  );
};

export default MGrid;

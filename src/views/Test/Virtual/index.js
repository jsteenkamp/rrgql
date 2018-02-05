import React from 'react';
import {AutoSizer, Grid} from 'react-virtualized';
import _times from 'lodash/fp/times';
import Panel, {PanelGroup} from 'Components/Panel';

// Grid data as an array of arrays
const list = [];
// Generate some rows
_times(
  count =>
    list.push([
      `Brian Vaughn ${count}`,
      'Software Engineer',
      'San Jose',
      'CA',
      95125,
    ]),
  300,
);

const cellRenderer = ({columnIndex, key, rowIndex, style}) => {
  return (
    <div key={key} style={style}>
      {list[rowIndex][columnIndex]}
    </div>
  );
};

const VirtualGrid = () => (
  <Panel>
    <PanelGroup direction={'column'}>
      <Panel height={'20%'} />
      <Panel>
        <AutoSizer>
          {({width, height}) => {
            return (
              <Grid
                cellRenderer={cellRenderer}
                columnCount={list[0].length}
                columnWidth={150}
                height={height}
                rowCount={list.length}
                rowHeight={30}
                width={width}
              />
            );
          }}
        </AutoSizer>
      </Panel>
      <Panel height={'20%'} />
    </PanelGroup>
  </Panel>
);

export default VirtualGrid;

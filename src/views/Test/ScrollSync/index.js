import React, {PureComponent} from 'react';
import styled from 'styled-components';
import {AutoSizer, Grid, ScrollSync} from 'react-virtualized';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';

const ContentBox = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  overflow: auto;
  background: white;
`;

const GridColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  & .header-grid {
    width: 100%;
    overflow: hidden !important;
  }
  & .body-grid {
    width: 100%;
  }
`;

export default class GridExample extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      columnCount: 50,
      height: 300,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 30,
      rowCount: 1000,
    };
  }

  columnWidth = ({index}) => {
    return index % 2 ? 75 : 150;
  };


  renderHeaderCell = ({columnIndex, key, style}) => {
    return (
      <div key={key} style={style}>
        {`C${columnIndex}`}
      </div>
    );
  };

  renderBodyCell = ({columnIndex, key, rowIndex, style}) => {
    return (
      <div key={key} style={style}>
        {`R${rowIndex}, C${columnIndex}`}
      </div>
    );
  };


  render() {
    const {
      columnCount,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      rowCount,
    } = this.state;

    return (
      <AutoSizer>
        {({width, height}) => {
          const gridHeight = height - rowHeight;
          return (
            <ScrollSync>
              {({
                clientHeight,
                clientWidth,
                onScroll,
                scrollHeight,
                scrollLeft,
                scrollTop,
                scrollWidth,
              }) => {
                return (
                  <GridColumn>
                    <div>
                      <div
                        style={{
                          height: rowHeight,
                          width: width - scrollbarSize(),
                        }}>
                        <Grid
                          className={'header-grid'}
                          columnWidth={this.columnWidth}
                          columnCount={columnCount}
                          height={rowHeight}
                          overscanColumnCount={overscanColumnCount}
                          cellRenderer={this.renderHeaderCell}
                          rowHeight={rowHeight}
                          rowCount={1}
                          scrollLeft={scrollLeft}
                          width={width - scrollbarSize()}
                        />
                      </div>
                      <div
                        style={{
                          height: gridHeight,
                          width,
                        }}>
                        <Grid
                          className={'body-grid'}
                          columnWidth={this.columnWidth}
                          columnCount={columnCount}
                          height={gridHeight}
                          onScroll={onScroll}
                          overscanColumnCount={overscanColumnCount}
                          overscanRowCount={overscanRowCount}
                          cellRenderer={this.renderBodyCell}
                          rowHeight={rowHeight}
                          rowCount={rowCount}
                          width={width}
                        />
                      </div>
                    </div>
                  </GridColumn>
                );
              }}
            </ScrollSync>
          );
        }}
      </AutoSizer>
    );
  }
}

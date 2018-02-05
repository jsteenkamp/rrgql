import React from 'react';
import PropTypes from 'prop-types';
import styled, {withTheme} from 'styled-components';
import {AutoSizer, Grid, ScrollSync} from 'react-virtualized';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import _find from 'lodash/find';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import {setInitialSort, toggleSortColumn, sortItems} from './sort';
import saveToCSV from './csv';
import DataContextMenu from './components/DataContextMenu';
import HeaderContextMenu from './components/HeaderContextMenu';
import TableContextMenu from './components/TableContextMenu';
import Icon from '../Icon';
import config from './config';
import {gridMapper, cellValue} from './mapper';
//import {clearTooltip} from '../Tooltip';
import Card from './components/Card';

const Label = styled.div`
  width: calc(100% - ${config.draggerWidth}px);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0;
  font-weight: normal;
`;

const Sort = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-left: 5px;
`;

const SortColumnHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${config.headerHeight}px;
  padding: 0 5px;
`;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
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

const MessageBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-around;
  align-items: center;
`;

const NoContent = () => <MessageBox><div>No data</div></MessageBox>;

class GridTable extends React.Component {
  state = {
    sort: [],
    dataColumns: [],
    wrapText: false,
    contextMenuPosition: null,
  };

  items = [];
  appliedMapper = null;
  initialWidths = [];
  headerElem = null;
  gridElem = null;
  scrollToColumn = -1;
  scrollToRow = -1;
  columnCount = 0;
  selectedItemIdx = -1;
  contextMenuType = 'dataGrid';

  refreshGrids = () => {
    // recomputeGridSize() also forces render via forceUpdate()
    if (!_isNil(this.headerElem)) this.headerElem.recomputeGridSize();
    if (!_isNil(this.headerElem)) this.gridElem.recomputeGridSize();
  };

  onSortClick = ({sort, column}) => {
    if (sort) {
      const sort = toggleSortColumn({
        sort: this.state.sort,
        column,
      });
      this.setState(() => ({sort}));
      this.refreshGrids();
    }
  };

  hideContextMenu = () => this.setState(() => ({contextMenuPosition: null}));

  showContextMenu = event => {
    event.stopPropagation();
    event.preventDefault();
    // firefox bug - offset ensures mouse inside overlay otherwise registers click outside
    const offset = 1;
    const contextMenuPosition = {
      top: event.clientY - offset,
      left: event.clientX - offset,
    };
    this.setState(() => ({contextMenuPosition}));
  };

  showDataContextMenu = ({event, selectedDataRow}) => {
    this.contextMenuType = 'dataGrid';
    this.selectedDataRow = selectedDataRow;
    this.showContextMenu(event);
  };

  showHeaderContextMenu = event => {
    this.contextMenuType = 'headerGrid';
    this.showContextMenu(event);
  };

  renderHeaderCell = ({columnIndex, key, style, dataColumns = this.state.dataColumns}) => {
    const {label, show, column, sort} = dataColumns[columnIndex];
    let cellData = null;

    if (!_isNil(sort)) {
      let currentSort = null;
      this.state.sort.map((sortItem, index) => {
        if (sortItem.column === column) {
          currentSort = {index: index + 1, direction: sortItem.direction};
        }
      });

      if (currentSort) {
        const {index, direction} = currentSort;
        const type = direction === 'asc' ? 'arrow-upward' : 'arrow-downward';
        cellData = (
          <SortColumnHeader onClick={() => this.onSortClick({sort, column})}>
            <Label>{label}</Label>
            <Sort>
              <div><Icon type={type} size={14} /></div>
              <div className="order">{index}</div>
            </Sort>
          </SortColumnHeader>
        );
      } else {
        cellData = (
          <SortColumnHeader onClick={() => this.onSortClick({sort, column})}>
            <Label>{label}</Label>
          </SortColumnHeader>
        );
      }
    }
    return show ? <div key={key} style={style}>{cellData}</div> : null;
  };

  cellColor = ({item}) => {
    const {
      defaultColor,
      currentColor,
      selectedColor,
      updatedColor,
      errorColor,
    } = this.props.theme.grid;
    const {currentItem, selectedItems, updatedItems, errorItems} = this.props;
    const findItem = collection => _find(collection, i => i === item);
    if (item === currentItem) return currentColor;
    if (findItem(errorItems)) return errorColor;
    if (findItem(updatedItems)) return updatedColor;
    if (findItem(selectedItems)) return selectedColor;
    return defaultColor;
  };

  selectItem = ({item}) => {
    if (_isFunction(this.props.selectItem)) {
      this.props.selectItem({item});
    }
  };

  selectOnlyItem = ({item}) => {
    if (_isFunction(this.props.selectItem)) {
      this.props.selectOnlyItem({item});
    }
  };

  isSelected = ({item}) => _find(this.props.selectedItems, i => i === item) !== undefined;

  cellClick = ({item, columnIndex, rowIndex}) => {
    // track selected item since responsive cards mean item row/column indexes change on select due to resizing
    this.selectedItemIdx = this.columnCount * rowIndex + columnIndex;
    this.props.clickItem({item, previewPanel: this.appliedMapper.previewPanel});
  };

  menuClick = menuItem => {
    switch (menuItem) {
      case 'selectAll':
        this.props.selectAllItems();
        break;

      case 'unselectAll':
        this.props.unselectAllItems();
        break;

      default:
      // console.log(menuItem);
    }
  };

  renderBodyCell = ({
    columnIndex,
    key,
    rowIndex,
    style,
    items = this.items,
    dataColumns = this.state.dataColumns,
    columnCount = this.columnCount,
    isScrolling,
  }) => {
    if (isScrolling) this.hideContextMenu();
    const idx = columnCount * rowIndex + columnIndex;
    // do not render undefined item, possible since grid indexes may be larger than items
    if (idx >= items.length) return null;
    const item = items[idx];
    // really only interested in c0 - c9
    if (item) {
      const cardItem = {
        color: this.cellColor({item}),
        selected: this.isSelected({item}),
        tooltip: '',
      };
      dataColumns.map(cell => {
        const {column, data, tooltip} = cell;
        switch (column) {
          case 'c1':
            cardItem.tooltip = _isFunction(tooltip) ? tooltip({item}) : '';
            cardItem[column] = cellValue({data, item});
            break;

          default:
            cardItem[column] = cellValue({data, item});
        }
      });

      const {id, selectedItems} = this.props;
      return (
        <div key={key} style={style}>
          <Card
            id={id}
            item={item}
            selectedItems={selectedItems}
            cardItem={cardItem}
            select={() => this.selectItem({item})}
            selectOnlyItem={() => this.selectOnlyItem({item})}
            cellClick={() => this.cellClick({item, rowIndex, columnIndex})}
            showContextMenu={this.showDataContextMenu}
            rowIndex={rowIndex}
            columnIndex={columnIndex}
          />
        </div>
      );
    } else {
      return null;
    }
  };

  // context menu selection
  onSelect = action => {
    switch (action) {
      case 'reset-sort':
        this.sort = [];
        const sort = setInitialSort({columns: this.state.dataColumns});
        this.setState(() => ({sort}));
        this.refreshGrids();
        break;

      case 'save-csv':
        const items = sortItems({
          sort: this.state.sort,
          items: this.props.items,
          columns: this.state.dataColumns,
        });
        saveToCSV({
          columns: this.state.dataColumns,
          items,
        });
        break;

      case 'select-all':
        this.props.selectAllItems();
        break;

      case 'unselect-all':
        this.props.unselectAllItems();
        break;

      default:
      //console.log('onSelect', action);
    }
    // close context menu
    this.setState(() => ({contextMenuPosition: null}));
  };

  onSelectedColumns = ({dataColumns}) => {
    this.setState(() => ({dataColumns}));
    this.refreshGrids();
  };

  getColumnWidth = ({index}) => {
    const {show, sort, width} = this.state.dataColumns[index];
    return show && !_isNil(sort) ? width : 0;
  };

  resetScroll = () => {
    //clearTooltip();
    this.scrollToRow = -1;
    this.scrollToColumn = -1;
  };

  init = ({items, mapper, getMapper}) => {
    // require valid items for measurements and sorting
    if (items.length) {
      const {appliedMapper, dataColumns} = gridMapper({
        mapper,
        currentColumns: this.state.dataColumns,
      });
      // pass appliedMapper back up for use in container (filters, item.id)
      getMapper({appliedMapper, dataColumns});
      this.appliedMapper = appliedMapper;
      const sort = setInitialSort({columns: dataColumns});
      // retain initial widths for column reset
      this.initialWidths = dataColumns.map(column => column.width);
      this.setState(() => ({dataColumns, sort}));
      this.refreshGrids();
    }
  };

  componentDidMount() {
    const {items, mapper, getMapper} = this.props;
    this.init({items, mapper, getMapper});
  }

  componentWillReceiveProps(nextProps) {
    const {items, mapper, getMapper} = nextProps;
    if (items !== this.props.items) {
      this.init({items, mapper, getMapper});
    }
  }

  render() {
    if (!this.props.items.length) return <NoContent />;

    const {dataColumns, sort} = this.state;

    this.items = sortItems({
      items: this.props.items,
      sort,
      columns: dataColumns,
    });
    const {headerHeight, cardWidth, cardHeight, cardMargin} = config;

    const wrappedMenu = this.contextMenuType === 'dataGrid'
      ? <DataContextMenu
          selection={this.selectedDataRow}
          menu={this.appliedMapper.contextMenu}
          onSelect={this.onSelect}
          closeMenu={() => this.setState(() => ({contextMenuPosition: null}))}
        />
      : <HeaderContextMenu
          dataColumns={this.state.dataColumns}
          wrapText={this.state.wrapText}
          onSelect={this.onSelect}
          onSelectedColumns={this.onSelectedColumns}
        />;

    return (
      <AutoSizer>
        {({width, height}) => {
          this.columnCount = Math.floor(width / cardWidth) || 1;
          const gridHeight = this.props.showHeader ? height - headerHeight : height;
          const rowHeight = cardHeight + 2 * cardMargin;
          const rowCount = Math.ceil(this.items.length / this.columnCount);
          const hasScrollBar = rowCount * rowHeight > height;
          const columnWidth = Math.trunc(
            (hasScrollBar ? width - scrollbarSize() : width) / this.columnCount
          );
          const {borderColor, backgroundColor, cardTextColor} = this.props.theme.grid;
          // need to recalc scroll position if grid has been resized
          if (this.props.currentItem) {
            this.scrollToColumn = this.selectedItemIdx % this.columnCount;
            this.scrollToRow = parseInt(this.selectedItemIdx / this.columnCount, 10);
          }
          return (
            <TableContextMenu
              menu={wrappedMenu}
              position={this.state.contextMenuPosition}
              onClose={() => this.setState(() => ({contextMenuPosition: null}))}>
              <ScrollSync>
                {({onScroll, scrollLeft}) => {
                  return (
                    <Container>
                      {this.props.showHeader &&
                        <div
                          style={{
                            height: `${config.headerHeight}px`,
                            width: `${width}px`,
                            borderTop: `1px solid ${borderColor}`,
                            borderBottom: `1px solid ${borderColor}`,
                            background: this.props.theme.grid.headerColor,
                            color: this.props.theme.grid.headerTextColor,
                          }}>
                          <HeaderContextMenu
                            onSelect={this.onSelect}
                            onSelectedColumns={this.onSelectedColumns}
                            dataColumns={dataColumns}
                            wrapText={this.state.wrapText}>
                            <Grid
                              className={'header-grid'}
                              width={width - scrollbarSize()}
                              height={config.rowHeight}
                              scrollLeft={scrollLeft}
                              columnWidth={this.getColumnWidth}
                              columnCount={dataColumns.length}
                              rowHeight={config.rowHeight}
                              rowCount={1}
                              cellRenderer={this.renderHeaderCell}
                            />
                          </HeaderContextMenu>
                        </div>}
                      <div
                        style={{
                          height: `${gridHeight}px`,
                          width: `${width}px`,
                          background: backgroundColor,
                          color: cardTextColor,
                        }}>
                        <Grid
                          ref={ref => (this.gridElem = ref)}
                          className={'body-grid'}
                          width={width}
                          height={gridHeight}
                          onScroll={onScroll}
                          onSectionRendered={this.resetScroll}
                          columnCount={this.columnCount}
                          columnWidth={columnWidth}
                          rowCount={rowCount}
                          rowHeight={rowHeight}
                          overscanRowCount={2}
                          cellRenderer={this.renderBodyCell}
                          autoContainerWidth={true}
                          scrollToColumn={this.scrollToColumn}
                          scrollToRow={this.scrollToRow}
                          noContentRenderer={NoContent}
                          selectedItems={this.props.selectedItems}
                        />
                      </div>
                    </Container>
                  );
                }}
              </ScrollSync>
            </TableContextMenu>
          );
        }}
      </AutoSizer>
    );
  }
}

GridTable.propTypes = {
  id: PropTypes.string,
  mapper: PropTypes.object,
  getMapper: PropTypes.func,
  items: PropTypes.array,
  clickItem: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  selectItem: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  selectOnlyItem: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  selectAllItems: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  unselectAllItems: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  currentItem: PropTypes.object,
  selectedItems: PropTypes.array,
  updatedItems: PropTypes.array,
  errorItems: PropTypes.array,
  theme: PropTypes.object,
  showHeader: PropTypes.bool,
};

GridTable.defaultProps = {
  items: [],
  mapper: {},
  getMapper: () => {},
  showHeader: true,
};

export default withTheme(GridTable);

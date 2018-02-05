import React from 'react';
import PropTypes from 'prop-types';
import styled, {withTheme} from 'styled-components';
import {AutoSizer, Grid, ScrollSync} from 'react-virtualized';
import scrollbarSize from 'dom-helpers/util/scrollbarSize';
import _find from 'lodash/find';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';
import _mapKeys from 'lodash/mapKeys';
import {setInitialSort, toggleSortColumn, sortItems} from './sort';
import saveToCSV from './csv';
import SelectIcon from '../SelectIcon';
import DataContextMenu from './components/DataContextMenu';
import HeaderContextMenu from './components/HeaderContextMenu';
import TableContextMenu from './components/TableContextMenu';
import Dragger from './components/Dragger';
import Icon from '../Icon';
import config from './config';
import {tableMapper, cellValue} from './mapper';
//import {clearTooltip} from '../Tooltip';
import Cell from './components/Cell';

//   background: ${props => (props.color ? props.color : '#f4f4f4')};
const ColorBar = styled.div`
  width: ${config.colorBarWidth}px;
  height: 100%;
  border: 1px solid ${props => props.theme.table.borderColor};
  border-top: none;
`;

const IconCell = styled.div`
  width: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-right: 1px solid ${props => props.theme.table.borderColor};
  border-bottom: 1px solid ${props => props.theme.table.borderColor};
`;

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

const ColumnNameHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${config.headerHeight}px;
  padding: 0 5px;
  background: ${props => (props.hasLabel ? props.theme.table.columnHeaderActiveColor : 'transparent')};
  border-right: ${props => (props.hasRightBorder ? `1px solid ${props.theme.table.columnHeaderBorderColor}` : 'none')};
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
    scrollbarSize: scrollbarSize(),
    contextMenuPosition: null,
  };

  items = [];
  appliedMapper = null;
  initialWidths = [];
  columnHeaderCells = [];
  columnHeaderElem = null;
  headerElem = null;
  gridElem = null;
  measureWrapElem = null;
  scrollToColumn = -1;
  scrollToRow = -1;
  contextMenuType = 'dataGrid';
  selectedDataRow = null;

  refreshGrids = () => {
    // recomputeGridSize() also forces render via forceUpdate()
    if (!_isNil(this.columnHeaderElem)) this.columnHeaderElem.recomputeGridSize();
    if (!_isNil(this.headerElem)) this.headerElem.recomputeGridSize();
    if (!_isNil(this.gridElem)) this.gridElem.recomputeGridSize();
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

  createColumnHeaderCells = ({dataColumns, columnHeader}) => {
    this.columnHeaderCells.length = 0;
    // mergedCells keeps total merged width (passed to headerColumn by reference)
    const mergedCells = {};
    const cellKeyToInt = str => parseInt(str.replace('c', ''));
    // map data columns to header column ranges
    dataColumns.map(({show, width, column}) => {
      // default column is the current data column (we only need to track width)
      let headerColumn = show ? {column: `c${idx}`, width} : null;
      const idx = cellKeyToInt(column);
      _mapKeys(columnHeader, ({cellRange, data}, key) => {
        // only need to process if cell range includes current column
        if (idx >= cellKeyToInt(cellRange[0]) && idx <= cellKeyToInt(cellRange[1])) {
          headerColumn = null;
          if (show) {
            if (mergedCells[key] === undefined) {
              mergedCells[key] = {
                column: `c${idx}`,
                label: _isFunction(data) ? data() : '',
                width,
              };
              headerColumn = mergedCells[key];
            } else {
              mergedCells[key].width += width;
            }
          }
        }
      });
      if (headerColumn !== null) this.columnHeaderCells.push(headerColumn);
    });
  };

  renderColumnHeaderCell = ({columnIndex, key, style, columns = this.columnHeaderCells}) => {
    const {label = ''} = columns[columnIndex];
    const nextCell = columns[columnIndex + 1];
    const hasLabel = label !== '';
    const hasRightBorder = hasLabel || (nextCell && nextCell.label !== undefined);
    const cellData = (
      <ColumnNameHeader title={label} hasLabel={hasLabel} hasRightBorder={hasRightBorder}>
        <Label>{label}</Label>
      </ColumnNameHeader>
    );
    return (
      <div key={key} style={style} onContextMenu={this.showHeaderContextMenu}>
        {cellData}
      </div>
    );
  };

  renderHeaderCell = ({columnIndex, key, style, dataColumns = this.state.dataColumns}) => {
    const {label, show, column, width, sort} = dataColumns[columnIndex];
    let cellData = null;
    switch (column) {
      case 'c0':
        cellData = (
          <div
            style={{
              height: `${config.headerHeight}px`,
              borderRight: `1px solid ${this.props.theme.table.borderColor}`,
            }}
          />
        );
        break;

      case 'c1':
        if (_isFunction(this.props.selectAllItems)) {
          const icon = this.props.items.length === this.props.selectedItems.length
            ? <Icon type={'check-box'} size={config.iconSize} />
            : <Icon type={'check-box-outline'} size={config.iconSize} />;
          cellData = (
            <div
              onClick={this.props.selectAllItems}
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                height: `${config.headerHeight}px`,
                borderRight: `1px solid ${this.props.theme.table.borderColor}`,
              }}>
              {icon}
            </div>
          );
        }
        break;

      default:
        if (show && !_isNil(label)) {
          let currentSort = null;
          this.state.sort.map((sortItem, index) => {
            if (sortItem.column === column) {
              currentSort = {index: index + 1, direction: sortItem.direction};
            }
          });

          const dragger = (
            <Dragger
              column={column}
              width={width}
              height={config.headerHeight}
              minWidth={config.minColumnWidth}
              maxWidth={config.maxColumnWidth}
              onColumnResize={this.onColumnResize}
            />
          );

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
                {dragger}
              </SortColumnHeader>
            );
          } else {
            cellData = (
              <SortColumnHeader onClick={() => this.onSortClick({sort, column})}>
                <Label>{label}</Label>
                {dragger}
              </SortColumnHeader>
            );
          }
        }
    }
    return (
      <div key={key} style={style} onContextMenu={this.showHeaderContextMenu}>
        {cellData}
      </div>
    );
  };

  cellColor = ({item}) => {
    const {
      defaultColor,
      currentColor,
      selectedColor,
      updatedColor,
      errorColor,
    } = this.props.theme.table;
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
    this.scrollToColumn = columnIndex;
    this.scrollToRow = rowIndex;
    this.props.clickItem({item, previewPanel: this.appliedMapper.previewPanel});
  };

  renderBodyCell = ({
    columnIndex,
    key,
    rowIndex,
    style,
    items = this.items,
    dataColumns = this.state.dataColumns,
    isScrolling,
  }) => {
    if (isScrolling) this.hideContextMenu();
    const item = items[rowIndex];
    const {column, data, tooltip, show, align, sort} = dataColumns[columnIndex];
    const value = cellValue({data, item});
    let cell = null;
    switch (column) {
      case 'c0':
        cell = <ColorBar style={{background: value}} />;
        break;

      case 'c1':
        cell = (
          <IconCell>
            <SelectIcon
              tooltip={!isScrolling && _isFunction(tooltip) ? tooltip({item}) : ''}
              selected={this.isSelected({item})}
              iconPath={value}
              rowHeight={config.rowHeight}
              iconSize={config.iconSize}
              select={this.selectItem}
              item={item}
            />
          </IconCell>
        );
        break;

      default:
        if (show) {
          const cAlign = align || sort === 'numeric' ? 'right' : 'left';
          cell = (
            <Cell
              id={this.props.id}
              item={item}
              selectedItems={this.props.selectedItems}
              align={cAlign}
              wrap={this.state.wrapText}
              data={data}
              selectOnlyItem={this.selectOnlyItem}
              cellClick={this.cellClick}
              showContextMenu={this.showDataContextMenu}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              isScrolling={isScrolling}
            />
          );
        }
    }
    // set background color (selected, updated, error)
    const background = this.cellColor({item});
    return (
      <div key={key} style={{...style, background}}>
        {cell}
      </div>
    );
  };

  onColumnResize = ({column, delta}) => {
    const dataColumns = this.state.dataColumns.map(col => {
      if (col.column === column) {
        const width = col.width - delta;
        return {...col, width};
      }
      return col;
    });
    this.setState(() => ({dataColumns}));
    this.refreshGrids();
  };

  // context menu selection
  onSelect = action => {
    switch (action) {
      case 'reset-columns':
        const dataColumns = this.state.dataColumns.map((column, index) => {
          column.width = this.initialWidths[index];
          return column;
        });
        this.setState(() => ({dataColumns}));
        this.refreshGrids();
        break;

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

      case 'text-wrap':
        this.setState(state => {
          const parent = document.body;
          const wrapText = !state.wrapText;
          if (wrapText) {
            this.measureWrapElem = document.createElement('div');
            this.measureWrapElem.setAttribute(
              'style',
              `position: absolute; visibility: hidden; white-space: normal; word-wrap: break-word; overflow-wrap: break-word; padding: ${config.cellPadding}px; line-height: ${config.cellLineHeight};`
            );
            parent.appendChild(this.measureWrapElem);
          } else {
            parent.removeChild(this.measureWrapElem);
            this.measureWrapElem = null;
          }
          return {wrapText};
        });
        this.refreshGrids();
        break;

      case 'select-all':
        this.props.selectAllItems();
        break;

      case 'unselect-all':
        this.props.unselectAllItems();
        break;

      default:
      // console.log('onSelect', action);
    }
    // close context menu
    this.setState(() => ({contextMenuPosition: null}));
  };

  onSelectedColumns = ({dataColumns}) => {
    // apply and close context menu
    this.setState(() => ({dataColumns, contextMenuPosition: null}));
    this.setColumnHeaderCells({dataColumns});
    this.refreshGrids();
  };

  getColumnHeaderColumnWidth = ({index}) => {
    const {width} = this.columnHeaderCells[index];
    return width;
  };

  getColumnWidth = ({index}) => {
    const {show, width} = this.state.dataColumns[index];
    return show ? width : 0;
  };

  getRowHeight = ({index, items = this.items, dataColumns = this.state.dataColumns}) => {
    let cellHeight = config.rowHeight;
    if (this.state.wrapText) {
      const item = items[index];
      dataColumns.map(({label, data, width, show}) => {
        if (!_isNil(label) && show) {
          // replace value with innerHTML is more efficient than createTextNode and appendChild/removeChild
          this.measureWrapElem.innerHTML = cellValue({data, item});
          this.measureWrapElem.style.width = `${width}px`;
          // add 1px for bottom border
          const height = this.measureWrapElem.offsetHeight + 1;
          if (height > cellHeight) cellHeight = height;
        }
      });
    }
    return cellHeight;
  };

  setColumnHeaderCells = ({mapper = this.props.mapper, dataColumns = this.state.dataColumns}) => {
    // optional header grid
    const columnHeader = mapper.columnNameHeader;
    if (columnHeader) this.createColumnHeaderCells({dataColumns, columnHeader});
  };

  // will cause double render for small grids without vertical scrollbar since vertical = true initially
  setScrollbarWidth = ({vertical}) => {
    const size = vertical ? scrollbarSize() : 0;
    if (this.state.scrollbarSize !== size) {
      this.setState(() => ({scrollbarSize: size}));
    }
  };

  resetScroll = () => {
    //clearTooltip();
    this.scrollToRow = -1;
    this.scrollToColumn = -1;
  };

  init = ({items, exclude = [], include = [], mapper, getMapper}) => {
    // require valid items for measurements and sorting
    if (items.length) {
      const {appliedMapper, dataColumns} = tableMapper({
        mapper,
        items,
        additionalExclude: exclude,
        additionalInclude: include,
        currentColumns: this.state.dataColumns,
      });
      // pass appliedMapper back up for use in container (filters, item.id)
      getMapper({appliedMapper, dataColumns});
      this.appliedMapper = appliedMapper;
      const sort = setInitialSort({columns: dataColumns});
      // retain initial widths for column reset
      this.initialWidths = dataColumns.map(column => column.width);
      this.setColumnHeaderCells({mapper, dataColumns});
      this.setState(() => ({dataColumns, sort, contextMenuPosition: null}));
      this.refreshGrids();
    }
  };

  componentDidMount() {
    this.init(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.items !== this.props.items) {
      this.init(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.measureWrapElem !== null) {
      document.body.removeChild(this.measureWrapElem);
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

    const hasColumnHeader = this.columnHeaderCells.length !== 0;
    const {
      columnHeaderColor,
      headerBorderColor,
      borderColor,
      backgroundColor,
      headerColor,
      headerTextColor,
      tableTextColor,
    } = this.props.theme.table;

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
          const gridHeight =
            height - (hasColumnHeader ? 2 * config.headerHeight : config.headerHeight);
          return (
            <TableContextMenu
              menu={wrappedMenu}
              position={this.state.contextMenuPosition}
              onClose={() => this.setState(() => ({contextMenuPosition: null}))}>
              <ScrollSync>
                {({onScroll, scrollLeft}) => {
                  return (
                    <Container>
                      {hasColumnHeader &&
                        <div
                          style={{
                            height: `${config.headerHeight}px`,
                            width: `${width}px`,
                            borderTop: `1px solid ${headerBorderColor}`,
                            borderBottom: `1px solid ${headerBorderColor}`,
                            margin: '0 0 1px',
                            background: columnHeaderColor,
                            color: headerTextColor,
                          }}>
                          <Grid
                            ref={ref => (this.columnHeaderElem = ref)}
                            className={'header-grid'}
                            width={width - this.state.scrollbarSize}
                            height={config.rowHeight}
                            scrollLeft={scrollLeft}
                            columnWidth={this.getColumnHeaderColumnWidth}
                            columnCount={this.columnHeaderCells.length}
                            rowHeight={config.rowHeight}
                            rowCount={1}
                            overscanColumnCount={0}
                            overscanRowCount={0}
                            cellRenderer={this.renderColumnHeaderCell}
                          />
                        </div>}
                      <div
                        style={{
                          height: `${config.headerHeight}px`,
                          width: `${width}px`,
                          borderTop: `1px solid ${borderColor}`,
                          borderBottom: `1px solid ${borderColor}`,
                          background: headerColor,
                          color: headerTextColor,
                        }}>
                        <Grid
                          ref={ref => (this.headerElem = ref)}
                          className={'header-grid'}
                          width={width - this.state.scrollbarSize}
                          height={config.rowHeight}
                          scrollLeft={scrollLeft}
                          columnWidth={this.getColumnWidth}
                          columnCount={dataColumns.length}
                          rowHeight={config.rowHeight}
                          rowCount={1}
                          overscanColumnCount={0}
                          overscanRowCount={0}
                          cellRenderer={this.renderHeaderCell}
                        />
                      </div>
                      <div
                        style={{
                          height: `${gridHeight}px`,
                          width: `${width}px`,
                          background: backgroundColor,
                          color: tableTextColor,
                        }}>
                        <Grid
                          ref={ref => (this.gridElem = ref)}
                          className={'body-grid'}
                          width={width}
                          height={gridHeight}
                          onScroll={onScroll}
                          onSectionRendered={this.resetScroll}
                          columnWidth={this.getColumnWidth}
                          columnCount={dataColumns.length}
                          estimatedRowSize={config.rowHeight}
                          rowHeight={this.getRowHeight}
                          rowCount={this.items.length}
                          overscanColumnCount={0}
                          overscanRowCount={5}
                          cellRenderer={this.renderBodyCell}
                          scrollToColumn={this.scrollToColumn}
                          scrollToRow={this.scrollToRow}
                          onScrollbarPresenceChange={this.setScrollbarWidth}
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
  include: PropTypes.array,
  exclude: PropTypes.array,
};

GridTable.defaultProps = {
  items: [],
  mapper: {},
  getMapper: () => {},
  include: [],
  exclude: [],
};

export default withTheme(GridTable);

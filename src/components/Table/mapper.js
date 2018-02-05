import _map from 'lodash/map';
import _difference from 'lodash/difference';
import _intersection from 'lodash/intersection';
import _keys from 'lodash/keys';
import _union from 'lodash/union';
import _orderBy from 'lodash/orderBy';
import _isFunction from 'lodash/isFunction';
import _isObject from 'lodash/isObject';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import _find from 'lodash/find';
import config from './config';

export const generateChars = length => {
  // add extra space with 'W0'
  let chars = 'W';
  for (let i = 0; i <= length; i++) {
    chars += '0';
  }
  return chars;
};

export const cellData = ({data, item}) =>
  _isFunction(data) ? data({item}) : item[data] === undefined ? null : item[data];

export const cellValue = ({data, item}) => {
  const value = cellData({data, item});
  if (_isNil(value)) return '';
  return _isObject(value) ? JSON.stringify(value) : value.toString();
};

const measureColumns = ({columns}) => {
  const parent = document.body;
  const elem = document.createElement('div');
  elem.setAttribute(
    'style',
    'position: absolute; visibility: hidden; will-change: transform; font-size: 1em; white-space: nowrap;'
  );
  parent.appendChild(elem);
  const cols = columns.map(column => {
    const key = column.column;
    switch (key) {
      case 'c0':
        column.width = config.colorBarWidth;
        return column;

      case 'c1':
        column.width = config.iconColumnWidth;
        return column;

      default:
        if (column.show && column.measure) {
          elem.innerHTML = generateChars(column.width);
          const width = elem.offsetWidth; // returns integer value
          column.width = width > config.maxColumnWidth
            ? config.maxColumnWidth
            : width < config.minColumnWidth ? config.minColumnWidth : width;
        }
        return column;
    }
  });
  if (parent.contains(elem)) parent.removeChild(elem);
  return cols;
};

const defaultMapper = {
  include: [],
  exclude: [],
  cells: {},
};

export const tableMapper = ({
  mapper,
  items,
  additionalExclude,
  additionalInclude,
  currentColumns,
}) => {
  const appliedMapper = mapper || defaultMapper;

  const {include = [], exclude = [], cells = {}} = appliedMapper;
  // get all data keys (items are not necessarily uniform)
  let keys = [];
  items.map(item => (keys = _union(keys, _keys(item))));
  // remove excluded keys
  let dataKeys = _orderBy(
    _difference(keys, [...exclude, ...additionalExclude]),
    value => value,
    'asc'
  );

  // if there are include keys they are the only keys that will be displayed
  if (include.length !== 0 || additionalInclude.length !== 0) {
    dataKeys = _intersection(dataKeys, [...include, ...additionalInclude]);
  }

  // offset by 2 so we always account for special c0 and c1 cells
  let numberOfCells = 2;
  const mappedCells = {};
  if (!_isEmpty(cells)) {
    // order the defined cells by cell key
    const cellKeys = _orderBy(_keys(cells), value => +value.replace('c', ''));
    cellKeys.map(key => (mappedCells[key] = cells[key]));
    numberOfCells = cellKeys.length + 2;
  }

  // undefined columns - add columns from item that are not defined in cells or excluded
  const itemCells = {};
  dataKeys.map(
    (key, index) =>
      (itemCells[`c${numberOfCells + index}`] = {
        data: key,
        label: key,
        sort: 'alpha',
      })
  );

  // order mapped cells first
  const dataColumns = _map({...mappedCells, ...itemCells}, (value, key) => {
    const currentColumn = _find(currentColumns, {column: key});
    if (currentColumn) {
      return {...currentColumn, measure: false};
    }
    return {
      ...value,
      show: true,
      column: key,
      measure: _isNil(value.width),
    };
  });

  // we have to test all items (or until we have a value for each column)
  dataColumns.map(col => {
    const {column, data, label, measure} = col;
    if (measure) {
      // character count will be replaced by pixel measurement
      col.width = 0;
      // allows us to show/hide empty columns
      col.empty = false;
      switch (column) {
        case 'c0':
          col.width = config.colorBarWidth;
          break;

        case 'c1':
          col.width = config.iconColumnWidth;
          break;

        default:
          // compare against all data (data not necessarily uniform)
          items.map(item => {
            const columnWidth = cellValue({data, item}).length;
            if (columnWidth > col.width) {
              col.width = columnWidth;
            }
          });
          col.empty = col.width === 0;
          // set column labels as default width
          const labelLength = label.toString().length;
          if (labelLength > col.width) col.width = labelLength;
      }
    }
  });
  // dataKeys for mapping over columns so we do not have to get them from dataCells
  return {appliedMapper, dataColumns: measureColumns({columns: dataColumns})};
};

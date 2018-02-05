import _map from 'lodash/map';
import _keys from 'lodash/keys';
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
    if (column.width !== 0) {
      elem.innerHTML = generateChars(column.width);
      const width = elem.offsetWidth; // returns integer value
      column.width = width > config.maxColumnWidth
        ? config.maxColumnWidth
        : width < config.minColumnWidth ? config.minColumnWidth : width;
    }
    return column;
  });
  if (parent.contains(elem)) parent.removeChild(elem);
  return cols;
};

const defaultMapper = {
  cells: {},
};

export const gridMapper = ({mapper, currentColumns}) => {
  const appliedMapper = mapper || defaultMapper;
  const {cells = {}} = appliedMapper;

  if (_isEmpty(cells)) {
    console.error('No cells defined in Grid mapper');
    return [];
  }

  const mappedCells = {};
  // order the defined cells by cell key
  const cellKeys = _orderBy(_keys(cells), value => +value.replace('c', ''));
  cellKeys.map(key => (mappedCells[key] = cells[key]));

  // order mapped cells first
  const dataColumns = _map(mappedCells, (value, key) => {
    const {label} = value;
    const currentColumn = _find(currentColumns, {column: key});
    if (currentColumn) {
      return {...currentColumn, measure: false};
    }
    return {
      ...value,
      show: true,
      column: key,
      width: _isNil(label) ? 0 : label.toString().length,
    };
  });

  return {appliedMapper, dataColumns: measureColumns({columns: dataColumns})};
};

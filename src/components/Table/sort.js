import _map from 'lodash/map';
import _find from 'lodash/find';
import _isFunction from 'lodash/isFunction';
import _orderBy from 'lodash/orderBy';
import _filter from 'lodash/filter';
import _reject from 'lodash/reject';

// need to cache sort on object since setState is async and we iterate over this method when setting initial sorting
let initialSort = [];
let currentSort = [];

export const toggleSortColumn = ({sort, column}) => {
  currentSort = [...sort];
  // get selected sort or create it
  let toggleColumn = _filter(currentSort, ['column', column])[0];
  if (toggleColumn === undefined) {
    toggleColumn = _filter(initialSort, ['column', column])[0];
    if (toggleColumn === undefined) {
      toggleColumn = {
        column,
        direction: 'asc',
        toggled: 0,
      };
    } else {
      const direction = toggleColumn.direction === 'asc' ? 'desc' : 'asc';
      toggleColumn = {
        ...toggleColumn,
        direction,
        toggled: 0,
      };
    }
    currentSort = [...currentSort, toggleColumn];
  }

  const {direction, toggled} = toggleColumn;
  // remove columns that have toggled and are back at original direction
  if (toggled === 2) {
    currentSort = _reject(currentSort, ['column', column]);
  } else {
    currentSort = currentSort.map(
      sortColumn =>
        sortColumn.column === column
          ? {
              ...sortColumn,
              direction: direction === 'asc' ? 'desc' : 'asc',
              toggled: toggled + 1,
            }
          : sortColumn,
    );
  }
  return currentSort;
};

export const sortItems = ({sort, columns, items}) => {
  const sorter = sort.map(sortColumn => {
    const s = _find(columns, {column: sortColumn.column});
    const data = item => (_isFunction(s.data) ? s.data({item}) : item[s.data]);

    if (_isFunction(s.sort)) {
      // sort function - do not use mapped data
      return {
        ...sortColumn,
        column: item => s.sort({item}),
      };
    } else if (s.sort === 'numeric') {
      // numeric sort
      return {
        ...sortColumn,
        column: item => parseFloat(data(item)),
      };
    } else if (s.sort === 'alpha') {
      // alpha sort
      return {
        ...sortColumn,
        column: item => data(item),
      };
    }
    // no sort
    return sortColumn;
  });
  // return sorted items
  return _orderBy(items, _map(sorter, 'column'), _map(sorter, 'direction'));
};

export const setInitialSort = ({columns}) => {
  initialSort = [];
  _orderBy(_filter(columns, 'order'), 'order').map(item => {
    const {column, direction = 'asc'} = item;
    initialSort.push({
      column,
      toggled: 1,
      direction,
    });
  });
  return initialSort;
};

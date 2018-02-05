import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import VirtualGrid from '../Grid';
import VirtualTable from '../Table';

// Note: with exception of mapper we could simply pass props object and destructure {...props} on each view component
const ViewSelector = ({
  id,
  type,
  items,
  clickItem,
  selectItem,
  selectOnlyItem,
  selectAllItems,
  unselectAllItems,
  currentItem,
  selectedItems,
  updatedItems,
  errorItems,
  config,
  getMapper,
}) => {
  const {grid, table} = config.mappers;

  switch (type) {
    case 'json':
      return <h1>JSON Viewer</h1>;

    case 'plugin':
      return <h1>Plugin Viewer</h1>;

    case 'grid':
      return (
        <VirtualGrid
          id={id}
          mapper={grid['grid']}
          getMapper={getMapper}
          items={items}
          clickItem={clickItem}
          selectItem={selectItem}
          selectOnlyItem={selectOnlyItem}
          selectAllItems={selectAllItems}
          unselectAllItems={unselectAllItems}
          currentItem={currentItem}
          selectedItems={selectedItems}
          updatedItems={updatedItems}
          errorItems={errorItems}
          showHeader={false}
        />
      );

    default:
      return (
        <VirtualTable
          id={id}
          mapper={table['table']}
          getMapper={getMapper}
          items={items}
          clickItem={clickItem}
          selectItem={selectItem}
          selectOnlyItem={selectOnlyItem}
          selectAllItems={selectAllItems}
          unselectAllItems={unselectAllItems}
          currentItem={currentItem}
          selectedItems={selectedItems}
          updatedItems={updatedItems}
          errorItems={errorItems}
          include={[]}
          exclude={[]}
        />
      );
  }
};

ViewSelector.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  items: PropTypes.array,
  clickItem: PropTypes.func,
  selectItem: PropTypes.func,
  selectOnlyItem: PropTypes.func,
  selectAllItems: PropTypes.func,
  unselectAllItems: PropTypes.func,
  currentItem: PropTypes.object,
  selectedItems: PropTypes.array,
  updatedItems: PropTypes.array,
  errorItems: PropTypes.array,
  config: PropTypes.object,
  getMapper: PropTypes.func,
};

export default connect(state => ({
  config: state.config
}))(ViewSelector);

import React from 'react';
import PropTypes from 'prop-types';
import {Menu, Item} from '../../ContextMenu/GridContextMenu';

// selection is everything we want to pass back to the handler
const WrappedMenu = ({selection, menu, onSelect, closeMenu}) => {
  let menuItems = [];
  let itemHandler = () => {};
  // check if context menu is defined (may not be defined in mapper)
  if (menu !== undefined) {
    const {items, handler} = menu;
    menuItems = items.map((item, index) => {
      return <Item key={index} item={item}>{item.name}</Item>;
    });
    // item is everything from the mapped context menu item
    itemHandler = item => {
      handler({item, selection});
      closeMenu();
    };
  }
  // local clickHandler is passing the menu "item"
  const clickHandler = item => onSelect(item);
  // always provide select/unselect options
  menuItems.push(
    <Item key="selectAll" item={'select-all'} onClick={clickHandler} border={'top'}>Select All</Item>
  );
  menuItems.push(
    <Item key="unselectAll" item={'unselect-all'} onClick={clickHandler}>Unselect All</Item>
  );
  return (
    <Menu onClick={itemHandler}>
      {menuItems}
    </Menu>
  );
};

WrappedMenu.propTypes = {
  selection: PropTypes.object,
  menu: PropTypes.object,
  onSelect: PropTypes.func,
  closeMenu: PropTypes.func,
};

export default WrappedMenu;
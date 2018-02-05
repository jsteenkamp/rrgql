import React from 'react';
import PropTypes from 'prop-types';
import GridContextMenu from '../../ContextMenu/GridContextMenu';

const TableContextMenu = props => {
  return (
    <GridContextMenu
      position={props.position}
      onSelect={props.onSelect}
      onClose={props.onClose}
      render={() => props.menu}>
      {props.children}
    </GridContextMenu>
  );
};

TableContextMenu.propTypes = {
  position: PropTypes.object,
  menu: PropTypes.element,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default TableContextMenu;

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import _find from 'lodash/find';
import {Menu, Item} from '../../ContextMenu/GridContextMenu';

const ColumnSelector = styled.div`
  width: 100%;
  & .column-heading {
    height: 30px;
    padding: 7px;
    background: #f4f4f4;
  }
  & .apply-button {
    width: 100%;
    height: 30px;
    text-align: center;
    background: #f4f4f4;
  }
  & .scroll-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: ${props => (props.numberOfColumns > 6 ? '150px' : 'auto')};
    overflow-y: auto;
    & > div {
      height: 24px;
      line-height: 24px;
      margin: 0 10px;
      & > input {
        margin-right: 7px;
      }
    }
  }
`;

class WrappedMenu extends React.Component {
  state = {
    dataColumns: [],
  };

  onColumnChange = event => {
    const {name, checked} = event.target;
    this.setState((state) => {
      _find(state.dataColumns, {'column': name}).show = !!checked;
      return ({dataColumns: state.dataColumns});
    });
  };

  applySelectedColumns = () => {
    this.props.onSelectedColumns({dataColumns: this.state.dataColumns});
  };

  componentWillMount() {
    this.setState(() => ({dataColumns: this.props.dataColumns}));
  }

  render() {
    const {dataColumns, onSelect} = this.props;
    const columns = [];
    dataColumns.map(column => {
      if (column.label) {
        columns.push(
          <div key={column.column}>
            <input
              type="checkbox"
              name={column.column}
              checked={column.show}
              onChange={this.onColumnChange}
            />
            {column.label}
          </div>,
        );
      }
    });

    return (
      <Menu onClick={onSelect}>
        <Item item={'reset-columns'}>Reset Columns</Item>
        <Item item={'reset-sort'}>Reset Sort</Item>
        <Item item={'save-csv'}>Save CSV</Item>
        <Item item={'text-wrap'}>{this.props.wrapText ? 'Truncate Text' : 'Wrap Text'}</Item>
        <ColumnSelector numberOfColumns={dataColumns.length}>
          <div className="column-heading">Columns</div>
          <div className="scroll-wrapper">
            {columns}
          </div>
          <button className="apply-button" onClick={this.applySelectedColumns}>
            Apply
          </button>
        </ColumnSelector>
      </Menu>
    );
  }
}

WrappedMenu.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onSelectedColumns: PropTypes.func.isRequired,
  dataColumns: PropTypes.array.isRequired,
  wrapText: PropTypes.bool,
};

export default WrappedMenu;

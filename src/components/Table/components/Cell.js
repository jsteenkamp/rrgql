import React from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';
import config from '../config';
import _isObject from 'lodash/isObject';
import {cellData, cellValue} from '../mapper';
import {ObjectViewer} from '../modals';

const CellWrapper = styled.div`
  height: 100%;
  padding: ${config.cellPadding}px;
  line-height: ${config.cellLineHeight};
  text-align: ${props => props.align};
  border-right: 1px solid ${props => props.theme.table.borderColor};
  border-bottom: 1px solid ${props => props.theme.table.borderColor};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${props => props.wrapText && css`
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
`};
`;

class Cell extends React.Component {
  onContextMenu = event => {
    const {id, item, selectedItems} = this.props;
    this.props.showContextMenu({event, selectedDataRow: {id, item, selectedItems}});
    this.props.selectOnlyItem({item: this.props.item});
  };

  cellClick = () => {
    if (document.getSelection().toString() === '') {
      const {item, rowIndex, columnIndex} = this.props;
      this.props.cellClick({item, rowIndex, columnIndex});
    }
  };

  render() {
    const {item, data, align, wrap, isScrolling} = this.props;
    const cData = cellData({data, item});
    const cValue = cellValue({data, item});
    const CellContent = ({cellClick = () => {}}) =>
      isScrolling
        ? <CellWrapper align={align} wrapText={wrap}>
            {cValue}
          </CellWrapper>
        : <CellWrapper
            align={align}
            wrapText={wrap}
            onClick={cellClick}
            onContextMenu={this.onContextMenu}>
            {cValue}
          </CellWrapper>;

    return _isObject(cData)
      ? <ObjectViewer data={cData}>
          <CellContent />
        </ObjectViewer>
      : <CellContent cellClick={this.cellClick} />;
  }
}

Cell.propTypes = {
  id: PropTypes.string,
  item: PropTypes.object.isRequired,
  selectOnlyItem: PropTypes.func.isRequired,
  selectedItems: PropTypes.array,
  data: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  align: PropTypes.string,
  wrap: PropTypes.bool,
  cellClick: PropTypes.func.isRequired,
  showContextMenu: PropTypes.func,
  rowIndex: PropTypes.number,
  columnIndex: PropTypes.number,
  isScrolling: PropTypes.bool,
};

export default Cell;

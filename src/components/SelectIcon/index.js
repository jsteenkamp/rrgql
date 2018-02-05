import React from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';
import _isFunction from 'lodash/isFunction';
import Icon from '../Icon';
import Tooltip from '../Tooltip';

const ImageIcon = styled.img`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  opacity: ${props => props.theme.selectIcon.imageIconOpacity};
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: ${props => props.iconSize}px;
  height: ${props => props.rowHeight}px;

  & > div {
    display: none;
  }
  
  & > .icon-selected {
    display: ${props => (props.selected ? 'block' : 'none')};
  }
    
  ${props => !props.hasIcon && css`
    & > .icon-select {
      display: ${props => (props.selected ? 'none' : 'block')};
    }
  `}
  
  ${props => props.hasIcon && css`
    & > .icon {
      display: ${props => (props.selected ? 'none' : 'block')};
    }
  `}
  
  ${props => props.selectable && !props.selected && css`
    &:hover > div {
      display: none;
      &.icon-select {
       display: block;
      }
    }
  `}
`;

const SelectIcon = ({
  select = null,
  selected = false,
  iconPath = '',
  iconSize = 18,
  rowHeight = 30,
  tooltip = '',
  item,
}) => {
  const selectable = _isFunction(select);
  const hasIcon = iconPath !== '';

  const onSelectClick = event => {
    // do not want click to propagate to card/row
    event.stopPropagation();
    if (selectable) select({item});
  };

  const selectContainer = (
    <SelectContainer
      hasIcon={hasIcon}
      selected={selected}
      selectable={selectable}
      iconSize={iconSize}
      rowHeight={rowHeight}
      onClick={onSelectClick}>
      {selected &&
        <div className="icon-selected">
          <Icon type={'check-box'} size={iconSize} />
        </div>}
      {selectable &&
        <div className="icon-select">
          <Icon type={'check-box-outline'} size={iconSize} />
        </div>}
      {hasIcon &&
        <div className="icon">
          <ImageIcon src={iconPath} alt="" size={iconSize} />
        </div>}
    </SelectContainer>
  );

  return tooltip.length === 0
    ? selectContainer
    : <Tooltip content={tooltip}>
        {selectContainer}
      </Tooltip>;
};

SelectIcon.propTypes = {
  tooltip: PropTypes.string,
  select: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  selected: PropTypes.bool,
  iconPath: PropTypes.string,
  iconSize: PropTypes.number,
  rowHeight: PropTypes.number,
  item: PropTypes.object,
};

export default SelectIcon;

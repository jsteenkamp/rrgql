import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';
import Measure from 'react-measure';
import _delay from 'lodash/delay';
import _isFunction from 'lodash/isFunction';
import {numberToPixels} from 'Utils/components';

// context menu is bounded by full viewport (could use #root selector)
const getViewport = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const ItemWrapper = styled.div`
  position: relative;
  padding: 7px;
  cursor: pointer;
  background: ${props => props.theme.contextMenu.background};
  ${props => props.border && props.border.includes('top') && css`
    border-top: 1px solid ${props => props.theme.contextMenu.borderColor}; 
  `}
  ${props => props.border && props.border.includes('bottom') && css`
    border-bottom: 1px solid ${props => props.theme.contextMenu.borderColor}; 
  `}
  box-sizing: border-box;
  &:last-child {
    border: none;
  }
  &:hover {
    background: #eee;
  }
  & > [data-menu-items] {
    visibility: hidden;
    position: absolute;
    z-index: 10;
    top: 0;
    left: 100%;
    box-shadow: ${props => props.theme.contextMenu.shadow};
    &[data-flip-right] {
      left: -100%;
    }
    &[data-flip-top] {
      top: auto;
      bottom: 0;
    }
  }
  &:hover > [data-menu-items],
  &[data-delay-hide] > [data-menu-items] {
    visibility: visible;
  }
  &[data-sub-menu] {
    margin-top: -1px;
    border-top: 1px solid ${props => props.theme.contextMenu.borderColor};
    border-bottom: 1px solid ${props => props.theme.contextMenu.borderColor};
    padding-right: 25px;
    &:after {
      position: absolute;
      right: 5px;
      top: calc(50% - 8px);
      content: '\\25b6';
      opacity: 0.5;
    }
  }
`;

export const Item = props => {
  // item element is the sub menu parent element
  let itemElem = null;
  // measure and decide if submenu needs to flip position
  const showSubmenu = event => {
    const subMenuElem = event.target.querySelector('div[data-menu-items]');
    if (subMenuElem) {
      itemElem = event.target;
      itemElem.setAttribute('data-delay-hide', true);
      subMenuElem.removeAttribute('data-flip-top');
      subMenuElem.removeAttribute('data-flip-right');
      const viewport = getViewport();
      const {top, left, width, height} = subMenuElem.getBoundingClientRect();
      const offsetTop = top + height - viewport.height;
      const offsetRight = left + width - viewport.width;
      if (offsetTop > 0) {
        subMenuElem.setAttribute('data-flip-top', true);
      }
      if (offsetRight > 0) {
        subMenuElem.setAttribute('data-flip-right', true);
      }
    }
  };

  const hideSubmenu = () => {
    // allow time to reach expanded children while not hovering parent
    if (itemElem) {
      _delay(
        element => {
          element.removeAttribute('data-delay-hide');
        },
        300,
        itemElem
      );
    }
  };
  // need to pass props to pass item object property to click handler
  return (
    <ItemWrapper {...props} onMouseOver={showSubmenu} onMouseOut={hideSubmenu}>
      {props.children}
    </ItemWrapper>
  );
};

Item.propTypes = {
  parent: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element, PropTypes.string]),
};

Item.defaultProps = {
  parent: null,
  children: [],
};

const MenuWrapper = styled.div`
  position: relative;
  width: 220px;
  border: 1px solid ${props => props.theme.contextMenu.borderColor};
  box-shadow: ${props => props.theme.contextMenu.shadow};
`;

export const Menu = props => {
  const children = React.Children.map(props.children, child => {
    if (child.props.item) {
      // if top level menu handler not defined handle clicks for items without onClick handler
      const menuClickHandler = props.onClick;
      // clicking an item returns the item prop (so you can pass objects)
      return React.cloneElement(child, {
        onClick: () => {
          // allow defining a click handler directly on the element
          _isFunction(child.props.onClick)
            ? child.props.onClick(child.props.item)
            : menuClickHandler(child.props.item);
        },
      });
    } else {
      // noClick items will not close the menu or action item click handler
      return React.cloneElement(child, {
        'data-sub-menu': true,
      });
    }
  });
  // data-menu-items is CSS selector used to show/hide of submenus
  return (
    <MenuWrapper data-menu-items="true">
      {children}
    </MenuWrapper>
  );
};

Menu.propTypes = {
  hideContextMenu: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.array,
};

Menu.defaultProps = {
  children: [],
};

const ContextMenuWrapper = styled.div`
  position: absolute;
  background: ${props => props.theme.contextMenu.background};
  box-shadow: ${props => props.theme.contextMenu.shadow};
  z-index: 1000;
`;

class ContextMenu extends React.Component {
  state = {
    position: this.props.position,
    viewport: getViewport(),
  };

  onHideContextMenu = () => {
    this.setState(() => ({position: null}));
    this.props.onClose();
  };

  onClickOutside = event => {
    if (this.wrapperElem && !this.wrapperElem.contains(event.target)) this.onHideContextMenu();
  };

  componentWillReceiveProps({position}) {
    this.setState(() => ({position}));
  }

  // use global events so we do not need a blocking UI layer
  componentDidMount() {
    document.addEventListener('click', this.onClickOutside, true);
    document.addEventListener('keydown', this.onHideContextMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside, true);
    document.removeEventListener('keydown', this.onHideContextMenu);
  }

  render() {
    const {render} = this.props;
    return (
      <div style={{display: 'inline'}}>
        {this.props.children}
        {this.state.position !== null &&
          ReactDOM.createPortal(
            <Measure bounds innerRef={ref => (this.wrapperElem = ref)}>
              {({measureRef, contentRect}) => {
                const {width, height} = contentRect.bounds;
                const offsetTop = this.state.position.top + height - this.state.viewport.height;
                const offsetRight = this.state.position.left + width - this.state.viewport.width;
                const newPosition = {
                  top: numberToPixels(this.state.position.top - (offsetTop > 0 ? offsetTop : 0)),
                  left: numberToPixels(this.state.position.left - (offsetRight > 0 ? offsetRight : 0)),
                };
                return (
                  <ContextMenuWrapper innerRef={measureRef} style={{top: newPosition.top, left: newPosition.left}}>
                    {render()}
                  </ContextMenuWrapper>
                );
              }}
            </Measure>,
            document.getElementById('portal')
          )}
      </div>
    );
  }
}

ContextMenu.propTypes = {
  render: PropTypes.func,
  position: PropTypes.object,
  onClose: PropTypes.func,
  children: PropTypes.element,
};

ContextMenu.defaultProps = {
  render: () => {},
  position: {top: 0, left: 0},
  onClose: () => {},
  children: null,
};

export default ContextMenu;

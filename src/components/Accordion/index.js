import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import _isFunction from 'lodash/isFunction';
import _debounce from 'lodash/debounce';
import Panel from '../Panel';
import {numberToPixels} from 'Utils/components';
// todo icon = spinner during async activity
//import Spinner from '../Spinner';

// accordion panel headers (tab)
const Tab = styled.div`
  display: flex;
  flex-direction: row;
  flex: auto;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
  box-sizing: border-box;
  height: ${props => numberToPixels(props.height)};
  border: 1px solid ${props => props.theme.accordions.borderColor};
  background: ${props => props.theme.accordions.backgroundColor};
  & > .icon {
    flex: none;
    width: 24px;
    height: 24px;
    margin: 0 10px;
    background: ${props => props.theme.accordions.icon.backgroundColor[props.viewType] || props.theme.accordions.icon.backgroundColor.default};
    line-height: 24px;
    text-align: center;
    text-transform: uppercase;
    color: ${props => props.theme.accordions.icon.color};
    font-size: 18px;
  }
  & > .name {
    color: ${props => (props.selected ? props.theme.accordions.selectedColor : props.theme.accordions.color)};
    flex: auto;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  & > .close {
    flex: none;      
    width: 18px;
    height: 18px;
    line-height: 18px;
    margin: 0 10px;
    visibility: hidden;
    font-weight: normal;
    text-align: center;
    font-size: 14px;
    &:hover {
      cursor: pointer;
      border-radius: 50%;
      color: ${props => props.theme.accordions.close.color};
      background: ${props => props.theme.accordions.close.backgroundColor};
    }
  }
  &:hover > .close {
    visibility: visible;
  }
`;

// accordion panels (containers)

export const AccordionPanel = ({
  innerRef,
  show = false,
  height = 0,
  background = 'transparent',
  children,
}) => (
  <Panel
    direction={'column'}
    innerRef={innerRef}
    show={show}
    height={height}
    background={background}>
    {children}
  </Panel>
);

AccordionPanel.propTypes = {
  show: PropTypes.bool,
  innerRef: PropTypes.func,
  height: PropTypes.number,
  background: PropTypes.string,
  children: PropTypes.node,
};

// tabs container
export class Accordion extends React.Component {
  state = {
    selectedTabIdx: 0,
    height: 0,
  };

  // store panel DOM elements, only valid after render
  tabPanelElems = [];

  setPanelElem = ref => {
    if (ref !== null) this.tabPanelElems.push(ref);
  };

  debounced = _debounce((index, elem) => this.props.onSelect({index, elem}), 150);

  onResize = bounds => {
    if (bounds !== undefined) {
      const {width, height} = bounds;
      if (width && height && height !== this.state.height) {
        const index = this.state.selectedTabIdx;
        const elem = this.tabPanelElems[index];
        if (_isFunction(this.props.onSelect)) this.debounced(index, elem);
        this.setState(() => ({height}));
      }
    }
  };

  removeTab = (event, index) => {
    event.stopPropagation();
    if (_isFunction(this.props.onRemove)) {
      this.props.onRemove(index);
    }
  };

  selectTab = (event, index) => {
    event.stopPropagation();
    if (index !== this.state.selectedTabIdx) {
      this.setState(() => ({selectedTabIdx: index}));
      if (_isFunction(this.props.onSelect)) {
        const elem = this.tabPanelElems[index];
        this.props.onSelect({index, elem});
      }
    }
  };

  // select the initial tab
  componentWillMount() {
    React.Children.forEach(this.props.children, (child, index) => {
      if (index !== 0 && child.props.selected) {
        this.setState(() => ({selectedTabIdx: index}));
      }
    });
  }

  // ensure a valid tab selected if a tab is removed
  componentWillReceiveProps(nextProps) {
    if (this.state.selectedTabIdx === React.Children.count(nextProps.children)) {
      const selectedTabIdx = this.state.selectedTabIdx > 0 ? this.state.selectedTabIdx - 1 : 0;
      this.setState(() => ({selectedTabIdx}));
    }
    if (nextProps.id !== this.props.id && _isFunction(this.props.onSelect)) {
      const index = this.state.selectedTabIdx;
      const elem = this.tabPanelElems[index];
      this.props.onSelect({index, elem});
    }
  }

  componentWillUnmount() {
    this.debounced.cancel();
  }

  render() {
    const accordions = [];
    // set selected tab - easier to simply iterate over children before building tabs with selection
    const selectedTabIdx = this.state.selectedTabIdx;
    const hasRemove = _isFunction(this.props.onRemove);
    // build tabs and tab containers
    const panelHeight =
      this.state.height - React.Children.count(this.props.children) * this.props.height;
    React.Children.forEach(this.props.children, (child, index) => {
      const name = child.props.name || `Panel ${index}`;
      const type = child.props.viewType ? child.props.viewType.toString().charAt(0) : '';
      if (React.isValidElement(child)) {
        const show = selectedTabIdx === index;
        // add accordion tab (header) and panel
        accordions.push(
          <div key={`accordion-${index}`}>
            <Tab
              height={this.props.height}
              selected={show}
              viewType={child.props.viewType}
              onClick={event => this.selectTab(event, index)}>
              {this.props.hasIcon && <div className="icon">{type}</div>}
              <div className="name">{name}</div>
              {hasRemove &&
                <div className="close" onClick={event => this.removeTab(event, index)}>
                  X
                </div>}
            </Tab>
            {React.cloneElement(child, {
              show,
              height: panelHeight,
              innerRef: this.setPanelElem,
            })}
          </div>
        );
      }
    });

    if (accordions.length === 0) return <Panel />;

    return (
      <Panel onResize={this.onResize}>
        {accordions}
      </Panel>
    );
  }
}

Accordion.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  onRemove: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  hasIcon: PropTypes.bool,
  children: PropTypes.node,
};

Accordion.defaultProps = {
  id: null,
  height: 40,
  onSelect: null,
  onRemove: null,
  hasIcon: false,
  children: null,
};

// legacy default export
export default Accordion;

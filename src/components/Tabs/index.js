import React from 'react';
import PropTypes from 'prop-types';
import _isFunction from 'lodash/isFunction';
import _debounce from 'lodash/debounce';
import Panel, {OverlayPanel} from '../Panel';
// components are all styled components
import {TabBar, Tab, TabOptions, TabOptionsOverlay} from './components';

// tab panels
export const TabPanel = ({innerRef, show = false, background = 'transparent', children}) => (
  <Panel direction={'column'} innerRef={innerRef} show={show} background={background}>
    {children}
  </Panel>
);

TabPanel.propTypes = {
  show: PropTypes.bool,
  innerRef: PropTypes.func,
  background: PropTypes.string,
  children: PropTypes.node,
};

// tabs container
export class Tabs extends React.Component {
  state = {
    selectedTabIdx: 0,
    height: 0,
    showOverlayPanel: false,
  };

  // store panel DOM elements, only valid after render
  tabPanelElems = [];
  overlayPanel = {top: 0, height: 0, bottom: 0};

  toggleOverlay = () => {
    const {top} = this.tabContainerElem.getBoundingClientRect();
    this.overlayPanel = {
      top: this.props.bottom ? null : top + this.props.height,
      bottom: this.props.bottom ? this.props.height : null,
    };
    this.setState(state => ({showOverlayPanel: !state.showOverlayPanel}));
  };

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
    }
    if (_isFunction(this.props.onSelect)) {
      const elem = this.tabPanelElems[index];
      // todo - may not need to pass tab props like name depending on how app is structured
      const {name} = this.props.children[index].props;
      this.props.onSelect({index, name, elem});
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

  // ensure a valid tab selected if a tab is removed, and tab select overlay is closed
  componentWillReceiveProps(nextProps) {
    if (this.state.selectedTabIdx === React.Children.count(nextProps.children)) {
      const selectedTabIdx = this.state.selectedTabIdx > 0 ? this.state.selectedTabIdx - 1 : 0;
      // keep overlay open if it was open before and tabs remain (allows quick delete/switch from overlay list)
      const showOverlayPanel = this.state.showOverlayPanel && this.state.selectedTabIdx > 0;
      this.setState(() => ({selectedTabIdx, showOverlayPanel}));
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
    const tabs = [];
    const tabPanels = [];
    // set selected tab - easier to simply iterate over children before building tabs with selection
    const selectedTabIdx = this.state.selectedTabIdx;
    const hasRemove = _isFunction(this.props.onRemove);
    // build tabs and tab containers
    const panelHeight = this.state.height - this.props.height;
    React.Children.forEach(this.props.children, (child, index) => {
      const name = child.props.name || `Tab ${index}`;
      const type = child.props.viewType ? child.props.viewType.charAt(0) : '';
      if (React.isValidElement(child)) {
        const show = selectedTabIdx === index;
        // add tab
        tabs.push(
          <Tab
            key={`tab-${index}`}
            selected={show}
            viewType={child.props.viewType}
            onClick={event => this.selectTab(event, index)}>
            {this.props.hasIcon && <div className="icon">{type}</div>}
            <div className="name">{name}</div>
            {hasRemove &&
              <div className="close" onClick={event => this.removeTab(event, index)}>X</div>}
          </Tab>
        );
        // add panel
        tabPanels.push(
          React.cloneElement(child, {
            key: `tab-panel-${index}`,
            show,
            height: panelHeight,
            innerRef: this.setPanelElem,
          })
        );
      }
    });

    if (tabPanels.length === 0) return <Panel />;

    return (
      <Panel onResize={this.onResize} innerRef={ref => (this.tabContainerElem = ref)}>
        {this.props.bottom && tabPanels}
        <TabBar height={this.props.height}>
          {tabs}
          <TabOptions onClick={this.toggleOverlay}><div>{tabPanels.length}</div></TabOptions>
        </TabBar>
        {!this.props.bottom && tabPanels}
        <OverlayPanel
          background={'transparent'}
          show={this.state.showOverlayPanel}
          onClose={() => this.setState(() => ({showOverlayPanel: false}))}
          top={this.overlayPanel.top}
          bottom={this.overlayPanel.bottom}
          width={180}
          right={0}>
          <TabOptionsOverlay>
            {tabs}
          </TabOptionsOverlay>
        </OverlayPanel>
      </Panel>
    );
  }
}

Tabs.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  onRemove: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  hasIcon: PropTypes.bool,
  bottom: PropTypes.bool,
  children: PropTypes.node,
};

Tabs.defaultProps = {
  id: null,
  height: 40,
  onSelect: null,
  onRemove: null,
  hasIcon: false,
  bottom: false,
  children: null,
};

// legacy default export
export default Tabs;

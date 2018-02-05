import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import compose from 'recompose/compose';
import {injectIntl} from 'react-intl';
import Header from 'Components/Header';
import Footer from 'Components/Footer';
import Panel, {PanelGroup} from 'Components/Panel';
import ViewSelector from 'Components/ViewSelector';
import _isFunction from 'lodash/isFunction';
import _find from 'lodash/find';
import _reject from 'lodash/reject';
import _filter from 'lodash/filter';
import _concat from 'lodash/concat';
import _uniqBy from 'lodash/uniqBy';
import _intersectionBy from 'lodash/intersectionBy';
import _isObject from 'lodash/isObject';
import _union from 'lodash/union';
import _kebabCase from 'lodash/kebabCase';
import {Tabs, TabPanel} from 'Components/Tabs';
import {OverlayPanel} from 'Components/Panel';
import Filters from 'Components/Filters';

// test providing render to external scripts via handlers
import render from '../../../app/render';

class View extends React.Component {
  state = {
    showRightPanel: false,
    showFilterPanel: false,
    currentItem: null,
    selectedItems: [],
    updatedItems: [],
    errorItems: [],
    selectedFilters: [],
    findText: '',
  };

  // renderItems are filtered source data items
  renderItems = [];
  previewPanel = null;
  previewPanelConfig = {
    direction: 'row',
    size: {height: '50%'},
  };
  hasSetPreviewPanelConfig = false;
  overlayPanel = {top: 0, height: 0};
  availableFilters = [];
  itemKinds = [];
  itemTypes = [];
  hasAppliedFilters = false;

  toggleOverlayPanel = () => {
    const {bottom} = this.headerElem.getBoundingClientRect();
    const {top} = this.footerElem.getBoundingClientRect();
    this.overlayPanel = {top: bottom, height: top - bottom};
    this.setState(state => ({showFilterPanel: !state.showFilterPanel}));
  };

  togglePanel = () => {
    this.setState(state => ({showRightPanel: !state.showRightPanel}));
  };

  getPreviewPanel = () => {
    if (this.previewPanel !== null) {
      const {tabs, handler} = this.previewPanel;
      if (tabs.length) {
        const tabPanels = tabs.map(tab => <TabPanel key={tab.id} name={tab.name} />);
        const tabHandler = ({index, elem}) => {
          return handler({
            item: this.state.currentItem,
            tab: tabs[index],
            elem,
            viewId: this.props.view.id,
            mappers: this.props.mappers,
            filters: this.props.filters,
            render,
          });
        };
        return <Tabs id={this.state.currentItem} onSelect={tabHandler}>{tabPanels}</Tabs>;
      }
    }
    return null;
  };

  selectItem = ({item}) => {
    let selectedItems = [];
    if (_find(this.state.selectedItems, i => i === item)) {
      selectedItems = _reject(this.state.selectedItems, i => i === item);
    } else {
      selectedItems = [...this.state.selectedItems, item];
    }
    this.setState(() => ({selectedItems}));
  };

  selectAllItems = () => {
    const selectedItems = this.state.selectedItems.length === this.renderItems.length
      ? []
      : this.renderItems;
    this.setState(() => ({selectedItems}));
  };

  unselectAllItems = () => this.setState(() => ({selectedItems: []}));

  selectOnlyItem = ({item}) => {
    if (!_find(this.state.selectedItems, item)) {
      this.setState(() => ({selectedItems: [item]}));
    }
  };

  clickItem = ({item, previewPanel = null}) => {
    this.previewPanel = null;
    this.setState(state => {
      const showRightPanel = state.showRightPanel;
      const currentItem = state.currentItem === item ? null : item;
      if (currentItem) this.previewPanel = previewPanel;
      return {currentItem, showRightPanel};
    });
  };

  setFilters = ({selectedFilters = [], findText = ''}) => {
    this.setState({
      resetFilters: false,
      currentItem: null,
      selectedItems: [],
      selectedFilters,
      findText,
    });
  };

  filterData = data => {
    const hasFilters = this.state.selectedFilters.length !== 0;
    const hasFind = this.state.findText.length !== 0;
    // used for UI clear button display
    this.hasAppliedFilters = hasFilters || hasFind;
    // no filters
    if (!this.hasAppliedFilters) return data;
    // default result is all items
    let results = data;
    if (hasFilters) {
      results = [];
      // filters applied using AND and filter options applied using OR
      this.state.selectedFilters.map(filter => {
        const {kind, type, options} = filter;
        let optionResults = [];
        // filter option results combined using OR (concat)
        options.map(option => {
          const filterFn = _isFunction(option.filter) ? option.filter : filter.filter;
          // filter applies to item kind:type
          const filteredData = _filter(data, item => {
            const itemKind = _kebabCase(this.appliedMapper.item.kind({item}));
            const itemType = _kebabCase(this.appliedMapper.item.type({item}));
            return itemKind === kind && (type === 'all' || itemType === type)
              ? filterFn(item)
              : false;
          });
          if (filteredData.length) {
            optionResults = _uniqBy(_concat(optionResults, filteredData), item =>
              this.appliedMapper.item.id({item})
            );
          }
        });
        // filters results combined using AND (intersection)
        if (optionResults.length) {
          results = results.length === 0
            ? optionResults
            : _intersectionBy(results, optionResults, item => this.appliedMapper.item.id({item}));
        }
      });
      if (!hasFind) return results;
    }

    // apply find (contains) filter, apply mapper so we search what the UI displays
    const findResults = [];
    const findText = this.state.findText.toString().toLowerCase();
    // need to use dataColumns for rendered output
    const cellDataMappers = [];

    // values could be objects (table)
    const containsText = value => {
      const cellValue = _isObject(value) ? JSON.stringify(value) : value;
      return cellValue.toString().toLowerCase().indexOf(findText) !== -1;
    };

    // only search visible columns
    this.dataColumns.map(({search = true, show, data}) => {
      if (search && show) cellDataMappers.push(data);
    });

    // look for find text matches in filtered results
    results.map(item => {
      let hasText = false;
      cellDataMappers.map(mapper => {
        if (!hasText)
          hasText = _isFunction(mapper) ? containsText(mapper({item})) : containsText(item[mapper]);
      });
      if (hasText) findResults.push(item);
    });
    return findResults;
  };

  getMapper = ({appliedMapper, dataColumns}) => {
    this.appliedMapper = appliedMapper;
    this.dataColumns = dataColumns;

    // we need to build filters from item kind and type
    // we get kind and type from the mapper
    // we have to iterate over the entire dataset (items) to know which
    // filters can be applied

    if (this.availableFilters.length === 0) {
      this.itemKinds.length = 0;
      this.itemTypes.length = 0;
      this.props.view.items.map(item => {
        // todo - kebabCase just for testing, need to check actual data types
        const kind = this.appliedMapper.item.kind({item});
        const type = this.appliedMapper.item.type({item});
        if (kind !== undefined) {
          const arr = [_kebabCase(kind)];
          this.itemKinds = this.itemKinds.length === 0 ? arr : _union(this.itemKinds, arr);
        }
        if (type !== undefined) {
          const arr = [_kebabCase(type)];
          this.itemTypes = this.itemTypes.length === 0 ? arr : _union(this.itemTypes, arr);
        }
      });
      // keep track of filter kind:type to apply to compliant items
      this.itemKinds.map(kind => {
        _filter(this.props.filters[kind], (value, key) => {
          if (key === 'all') {
            value.map(v => this.availableFilters.push({...v, kind, type: 'all'}));
          } else {
            this.itemTypes.map(type => {
              if (key === type) {
                value.map(v => this.availableFilters.push({...v, kind, type}));
              }
            });
          }
        });
      });
    }

    // previewPanel size and position from config
    const {previewPanel} = appliedMapper;
    if (!this.hasSetPreviewPanelConfig && previewPanel !== undefined) {
      this.hasSetPreviewPanelConfig = true;
      if (previewPanel.config !== undefined) {
        const {sizePercent, direction} = previewPanel.config;
        const size = sizePercent || 50;
        this.previewPanelConfig = {
          direction: direction === 'vertical' ? 'row' : 'column',
          size: direction === 'vertical' ? {width: `${size}%`} : {height: `${size}%`},
        };
      }
    }
  };

  // Note: this relies on immutable data (view) to update when panel tab is active: nextProps.show === true
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.view !== nextProps.view || this.state !== nextState;
  }

  render() {
    const {id, name, items, type} = this.props.view;
    // always apply filters to the data on view render
    this.renderItems = this.filterData(items);

    return (
      <Panel key={id}>
        <OverlayPanel
          background={'transparent'}
          show={this.state.showFilterPanel}
          onClose={() => this.setState(() => ({showFilterPanel: false}))}
          top={this.overlayPanel.top}
          height={this.overlayPanel.height}
          width={420}
          right={0}
          overflowY={'hidden'}>
          <Filters
            height={this.overlayPanel.height}
            filters={this.availableFilters}
            appliedFilters={this.state.selectedFilters}
            findText={this.state.findText}
            resetFilters={false}
            applyFilters={this.setFilters}
            closePanel={() => this.setState(() => ({showFilterPanel: false}))}
          />
        </OverlayPanel>

        <Header innerRef={ref => (this.headerElem = ref)}>
          <div>{name}</div>
          <div className="spacer" />
          <div>
            {this.hasAppliedFilters && <button onClick={this.setFilters}>Clear</button>}
            <button onClick={this.toggleOverlayPanel}>Filters</button>
            <button onClick={this.togglePanel}>Tools</button>
          </div>
        </Header>

        <PanelGroup show={[true, this.state.showRightPanel]}>
          <PanelGroup direction={this.previewPanelConfig.direction} show={[true, this.previewPanel !== null]}>
            <Panel>
              <ViewSelector
                id={id}
                type={type}
                items={this.renderItems}
                clickItem={this.clickItem}
                selectItem={this.selectItem}
                selectOnlyItem={this.selectOnlyItem}
                selectAllItems={this.selectAllItems}
                unselectAllItems={this.unselectAllItems}
                currentItem={this.state.currentItem}
                selectedItems={this.state.selectedItems}
                updatedItems={this.state.updatedItems}
                errorItems={this.state.errorItems}
                getMapper={this.getMapper}
              />
            </Panel>
            <Panel {...this.previewPanelConfig.size}>
              {this.getPreviewPanel()}
            </Panel>
          </PanelGroup>

          <PanelGroup direction={'column'} width={'50%'} background={'#f8f8f8'}>
            <Panel height={'50%'} />
            <Panel />
            <Panel height={100} />
          </PanelGroup>
        </PanelGroup>

        <Footer innerRef={ref => (this.footerElem = ref)}>
          <div>{this.renderItems.length}</div>
          <div>
            {this.state.selectedItems.length !== 0 ? `(${this.state.selectedItems.length})` : ''}
          </div>
          <div className="spacer" />
        </Footer>
      </Panel>
    );
  }
}

View.propTypes = {
  view: PropTypes.object,
  filters: PropTypes.object,
  mappers: PropTypes.object,
};

View.defaultProps = {
  view: {
    id: 'workspace',
    items: [],
  },
};

const enhance = compose(
  connect(state => ({
    filters: state.config.filters,
    mappers: state.config.mappers,
  })),
  injectIntl
);

export default enhance(View);

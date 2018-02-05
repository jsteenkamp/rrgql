import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _isEqual from 'lodash/isEqual';
import _find from 'lodash/find';
import {Wrapper, Container} from './components';

class FilterPanel extends React.Component {
  state = {
    filters: [],
    find: '',
  };

  filterOptions = [];
  selectedFilters = [];

  // Need to close if clicking outside panel content (panel is on top of overlay but not 100% width)
  closePanel(event) {
    this.props.closePanel();
  }

  onFindChange = event => {
    this.setState({find: event.target.value});
  };

  // keep track of selected filter option and update state (controlled component)
  onFilterOptionClick = event => {
    const {filterId} = event.target.dataset;
    // event delegation so check a valid element has been clicked
    if (filterId) {
      const {value, checked} = event.target;

      // available filters
      const sourceFilter = _find(
        this.props.filters,
        filter => filterId === `${filter.kind}-${filter.type}-${filter.id}`
      );

      // applied filters
      const filter = _find(
        this.selectedFilters,
        filter => filterId === `${filter.kind}-${filter.type}-${filter.id}`
      );

      if (value === 'checkAll') {
        if (checked) {
          filter.options = sourceFilter.options.map(option => {
            return option;
          });
        } else {
          filter.options = [];
        }
      } else {
        // add or remove the filter option value
        if (checked === true) {
          const option = _find(sourceFilter.options, option => {
            return option.id.toString() === value;
          });
          // only need to filter option id to action
          filter.options.push(option);
        } else {
          filter.options = filter.options.filter(option => {
            return option.id.toString() !== value;
          });
        }
      }
      // update state which displays checked/unchecked checkboxes
      this.setState({filters: this.selectedFilters});
    }
  };

  // send filters to API
  applyFilters = event => {
    // prevent form submission
    event.preventDefault();
    // only apply filters with options
    const selectedFilters = this.selectedFilters.filter(filter => filter.options.length !== 0);
    // only apply if filters if different from currently applied filters
    if (
      !_isEqual(selectedFilters, this.props.appliedFilters) ||
      this.state.find !== this.props.findText
    ) {
      this.props.applyFilters({selectedFilters, findText: this.state.find});
    }
    // close panel (no event passed like UI close actions)
    this.closePanel();
  };

  clearFind = () => {
    this.setState({find: ''});
  };

  clearFilters = () => {
    this.selectedFilters.length = 0;
    // create filter list without options - an option is set when selected
    this.props.filters.map(filter => {
      this.selectedFilters.push({...filter, options: []});
    });
    this.setState({filters: this.selectedFilters, find: ''});
  };

  buildFilterOptions = ({filters}) => {
    this.filterOptions.length = 0;
    filters.map(filter => {
      // assume all items are checked
      let isAllChecked = true;
      let isSomeChecked = false;
      // form checkboxes
      const formOptions = [];
      // filter must have options array to generate a checkbox
      filter.options.map(option => {
        // if filter contains the current option it is checked
        let isChecked = false;
        const filterId = `${filter.kind}-${filter.type}-${filter.id}`;
        if (this.state.filters.length) {
          const stateFilter = _find(
            this.state.filters,
            f => filterId === `${f.kind}-${f.type}-${f.id}`
          );

          if (stateFilter) {
            const checked = _find(stateFilter.options, o => option.id === o.id);
            isChecked = checked !== undefined;
            // at least one option is checked
            isSomeChecked = isSomeChecked || isChecked;
          }
        }

        // only need single unchecked option to "uncheck" all
        isAllChecked = isAllChecked && isChecked;

        const checkBoxStyle = option.name === '' ? {visibility: 'hidden'} : {};
        // build form checkbox
        formOptions.push(
          <div key={`${filter.kind}-${filter.type}-${filter.id}-${option.id}`}>
            <label className="checkbox" style={checkBoxStyle}>
              <input
                type="checkbox"
                data-filter-id={`${filter.kind}-${filter.type}-${filter.id}`}
                checked={isChecked}
                value={option.id}
              />
              {' '}
              {option.name}
            </label>
          </div>
        );
      });

      const filterOption = (
        <label className="checkbox">
          <input
            type="checkbox"
            className={`${isSomeChecked && !isAllChecked ? 'some-checked' : ''}`}
            data-filter-id={`${filter.kind}-${filter.type}-${filter.id}`}
            checked={isAllChecked || isSomeChecked}
            value="checkAll"
          />
          {' '}
          {filter.name}
        </label>
      );

      // add checkboxes to form
      this.filterOptions.push(
        <tr key={`${filter.kind}-${filter.type}-${filter.id}`}>
          <td>{filterOption}</td>
          <td>{formOptions}</td>
        </tr>
      );
    });
  };

  componentDidMount() {
    this.selectedFilters.length = 0;
    // create filter list without options - an option is set when selected
    this.props.filters.map(filter => {
      const {kind, type, id} = filter;
      const stateFilter = _find(
        this.props.appliedFilters,
        f => `${kind}-${type}-${id}` === `${f.kind}-${f.type}-${f.id}`
      );
      const options = stateFilter ? stateFilter.options : [];
      this.selectedFilters.push({...filter, options});
    });
    this.setState({
      filters: this.props.appliedFilters,
      find: this.props.findText,
    });
  }

  render() {
    this.buildFilterOptions({filters: this.props.filters});

    const cssFindClear = classNames('find-clear', {
      show: this.state.find !== '',
    });

    return (
      <Wrapper>
        <Container height={this.props.height}>
          <form onSubmit={this.applyFilters}>
            <div className="filter-panel">
              <div className="panel-header">
                <div className="find-input-wrapper">
                  <input
                    className="input"
                    tabIndex="-1"
                    type="text"
                    value={this.state.find}
                    placeholder="Contains..."
                    onChange={this.onFindChange}
                  />
                  <div className={cssFindClear} onClick={this.clearFind}>
                    X
                  </div>
                </div>
              </div>
              <div className="panel-content">
                {this.filterOptions.length !== 0 &&
                  <table className="table">
                    <thead>
                      <tr>
                        <th width="40%">Filter</th>
                        <th>Options</th>
                      </tr>
                    </thead>
                    <tbody onClick={this.onFilterOptionClick}>
                      {this.filterOptions}
                    </tbody>
                  </table>}
              </div>
              <div className="panel-footer">
                <div className="footer-item">
                  <button className="button is-white" type="reset" onClick={this.clearFilters}>
                    Clear
                  </button>
                </div>
                <div className="footer-item">
                  <button className="button is-primary" type="submit">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Container>
      </Wrapper>
    );
  }
}

FilterPanel.propTypes = {
  height: PropTypes.number,
  filters: PropTypes.array,
  findText: PropTypes.string,
  appliedFilters: PropTypes.array,
  resetFilters: PropTypes.bool,
  applyFilters: PropTypes.func,
  closePanel: PropTypes.func,
};

export default FilterPanel;

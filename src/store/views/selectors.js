import {createSelector} from 'reselect';
import _filter from 'lodash/fp/filter';

const viewDataSelector = state => state.views.data;

// tab data has key display = 'tab'
export const tabViewData = createSelector(viewDataSelector, data =>
  _filter(['display', 'tab'], data));

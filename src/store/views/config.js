import {createActions, handleActions} from 'redux-actions';
import update from 'immutability-helper';
import _findIndex from 'lodash/findIndex';

export const id = 'views';

export const initialState = {
  data: [],
  requests: [],
  updatedItemIds: [],
  errorItemIds: [],
};

const {
  dataLoadRequest,
  dataLoadSuccess,
  dataLoadFailure,
  dataDelete,
} = createActions(
  'DATA_LOAD_REQUEST',
  'DATA_LOAD_SUCCESS',
  'DATA_LOAD_FAILURE',
  'DATA_DELETE',
);

export const actions = {dataLoadRequest, dataLoadSuccess, dataLoadFailure, dataDelete};

// remove view id from pending requests
const removeRequestId = (requests, id) => requests.filter(rid => rid !== id);

export const reducer = handleActions(
  {
    [dataLoadRequest]: (state, action) => {
      return update(state, {
        data: {$push: [action.payload]},
        requests: {$push: [action.payload.id]},
      });
    },

    [dataLoadSuccess]: (state, action) => {
      const idx = _findIndex(state.data, ['id', action.payload.data.id]);
      return update(state, {
        data: {[idx]: {$set: action.payload.data}},
        requests: {
          $set: removeRequestId(state.requests, action.payload.data.id),
        },
      });
    },

    [dataLoadFailure]: (state, action) => {
      // todo - display error panel/dialog/toast
      console.error(
        `Error loading data for view ${action.payload.id}`,
        action.payload.error,
      );
      return update(state, {
        requests: {$set: removeRequestId(state.requests, action.payload.id)},
      });
    },

    [dataDelete]: (state, action) => {
      const idx = _findIndex(state.data, ['id', action.payload.id]);
      return update(state, {data: {$unset: [idx]}});
    }
  },
  initialState,
);

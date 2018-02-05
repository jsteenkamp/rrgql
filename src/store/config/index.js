import { createActions, handleActions } from 'redux-actions';

export const id = 'config';

export const initialState = {};

const { configUpdate } = createActions('CONFIG_UPDATE');

export const actions = { configUpdate };

export const reducer = handleActions(
  {
    CONFIG_UPDATE: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  initialState
);

export default {
  id,
  initialState,
  actions,
  reducer,
};

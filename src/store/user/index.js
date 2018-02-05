import { createActions, handleActions } from 'redux-actions';

export const id = 'user';

export const initialState = {
  authenticated: false,
  user: null,
  token: null,
};

const { userSet, userClear } = createActions('USER_SET', 'USER_CLEAR');

export const actions = { userSet, userClear };

export const reducer = handleActions(
  {
    USER_SET: (state, action) => {
      // payload = {authenticated, user, token}
      return { ...state, ...action.payload };
    },
    USER_CLEAR: state => {
      return { ...state, ...initialState };
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
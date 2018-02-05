import {all, fork} from 'redux-saga/effects';
// application modules
import config from './config';
import user from './user';
import views from './views';

// export so we can access initial state for store configuration
export const rootInitialStates = {
  [config.id]: config.initialState,
  [user.id]: user.initialState,
  [views.id]: views.initialState,
};


// ids are the domains (sub-states) under which state values are stored
export const rootReducers = {
  [config.id]: config.reducer,
  [user.id]: user.reducer,
  [views.id]: views.reducer,
};


// side effects are handled by sagas in Redux middleware (alternatively you can use thunks)
export function* rootSaga() {
  yield all ([
    fork(views.sagas),
  ]);
}

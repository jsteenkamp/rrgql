import {createStore, applyMiddleware, combineReducers} from 'redux';
import createSagaMiddleware, {END} from 'redux-saga';
import {compose} from 'redux';
//import {ApolloClient} from 'react-apollo';
import {rootInitialStates, rootReducers, rootSaga} from './index';

/* * * Redux DevTools * * *
 Using DevTools Chrome extension so there is nothing to install,
 just check the extension is installed with window.__REDUX_DEVTOOLS_EXTENSION__()
 https://github.com/zalmoxisus/redux-devtools-extension
 https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
 * * * ----- * * */

// check if Chrome Redux DevTools extension is installed
const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;
// use Apollo provider for redux store
//const client = new ApolloClient();
// prefer sagas for async actions
const sagaMiddleware = createSagaMiddleware();

let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = compose(applyMiddleware(sagaMiddleware), reduxDevTools);
} else {
  // only need logger for dev so use require
  const {createLogger} = require('redux-logger');
  // this will log Redux ACTIONS
  const loggerMiddleware = createLogger({level: 'info', collapsed: true});
  // logger should always be last in applied middleware, add reduxDevTools
  enhancer = compose(applyMiddleware(sagaMiddleware, loggerMiddleware), reduxDevTools);
}

let store;

// so we can access store API
export const getStore = () => store;

// config store and export apollo client
export const configureStore = ({config = rootInitialStates.config, user = rootInitialStates.user}) => {
  const initialState = {...rootInitialStates, config, user};
  // create the store
  store = createStore(combineReducers({...rootReducers}), initialState, enhancer);

  // webpack hot module replacement for redux reducers - dev only
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('../index', () => {
      // update store with "next" (updated) reducer
      store.replaceReducer(require('index').rootReducer);
    });
  }

  // attach saga run method to store, used after store configuration in <Root .../>
  sagaMiddleware.run(rootSaga);
  store.close = () => store.dispatch(END);
  return {store};
};


import {all, call, put, takeEvery} from 'redux-saga/effects';
import _isString from 'lodash/isString';
import {actions} from './config';

const {dataLoadSuccess, dataLoadFailure} = actions;

// set required view defaults on data object
const defaultViewData = ({id, display, type, name = null}, data) => {
  return {...data, id, display, type, name};
};

function* loadDataRequestSaga(action) {
  const view = action.payload;

  try {
    const response = yield call(async () => {
      switch (view.type) {
        case 'plugin':
          return Promise.resolve({data: view});

        default:
          // string = url returning JSON data otherwise expect data {object}
          if (_isString(view.data)) {
            try {
              const response = await fetch(view.data, {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                cache: 'no-cache',
              });
              const jsonData = await response.json();
              const data = defaultViewData(view, jsonData.data);
              return response.ok ? {data} : Promise.reject(response);
            } catch (error) {
              return Promise.reject({id: view.id, error});
            }
          } else {
            return Promise.resolve({data: view});
          }
      }
    });
    // update views
    yield put(dataLoadSuccess(response));
  } catch (error) {
    yield put(dataLoadFailure(error));
  }
}

export default function* views() {
  yield all([takeEvery('DATA_LOAD_REQUEST', loadDataRequestSaga)]);
}

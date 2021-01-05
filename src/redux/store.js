import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducer';
import middlewares from './middlewares';

const store = createStore(rootReducer, applyMiddleware(...middlewares));

if (module.hot) {
  module.hot.accept('./reducer', () => {
    // eslint-disable-next-line global-require
    const { default: nextRootReducer } = require('./reducer');
    store.replaceReducer(nextRootReducer);
  });
}

export default store;

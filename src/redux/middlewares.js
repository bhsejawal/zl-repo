import thunk from 'redux-thunk';

const middlewares = [thunk];

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  middlewares.push(require('redux-logger').default);
}

export default middlewares;

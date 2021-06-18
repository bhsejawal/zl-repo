import thunk from 'redux-thunk';

const middlewares = [thunk];

if (process.env.PREACT_APP_ENVIRONMENT === 'development') {
  // eslint-disable-next-line global-require
  middlewares.push(require('redux-logger').default);
}

export default middlewares;

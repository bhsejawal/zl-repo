import { h } from 'preact';
import { Router } from 'preact-router';
import { Provider } from 'react-redux';

import store from './redux/store';
import Header from './components/Header';

// Code-splitting is automated for `routes` directory
import Home from './routes/home';

import style from './style/index.scss';

const App = () => (
  <Provider store={store}>
    <div className={style.app}>
      <Header />
      <Router>
        <Home path="/" />
      </Router>
    </div>
  </Provider>
)

export default App;

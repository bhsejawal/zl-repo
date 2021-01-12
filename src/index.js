import { h } from 'preact';
import { Router } from 'preact-router';
import { Provider } from 'react-redux';

import store from './redux/store';
import Header from './components/Header';
import DesignSystem from './routes/designSystem';

import './style/globalStyle.scss';

// Code-splitting is automated for `routes` directory
import Home from './routes/home';
import Habitat from './routes/habitat';

import style from './style/index.scss';

const App = () => (
  <Provider store={store}>
    <div className={style.app}>
      <Header />
      <Router>
        <Home path="/" exact />
        <Habitat path="/habitat" />
        <DesignSystem path="/design" />
      </Router>
    </div>
  </Provider>
)

export default App;

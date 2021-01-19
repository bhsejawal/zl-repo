import { h } from 'preact';
import { Router } from 'preact-router';
import { Provider } from 'react-redux';

import store from './redux/store';

import Header from './components/Header';
import AdminRouter from './shared/AdminRouter';
import DesignSystem from './routes/designSystem';
import Login from './routes/login';

import './style/globalStyle.scss';

// Code-splitting is automated for `routes` directory
import Home from './routes/home';
import Habitat from './routes/habitat';

// TODO: this is not working - should be fixed
import style from './style/index.scss';

const App = () => (
  <Provider store={store}>
    <div className={style.app}>
      <Header />
      <Router>
        <Home path="/" exact />
        <Habitat path="/habitat" />
        <DesignSystem path="/design" />
        <Login path="/login" />
        <AdminRouter path="/admin/:*" />
      </Router>
    </div>
  </Provider>
)

export default App;

import { h } from 'preact';
import { Router } from 'preact-router';
import { Provider } from 'react-redux';

import { Grommet, Main, ResponsiveContext } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { grommet } from 'grommet/themes';

import store from './redux/store';

import zoolifeTheme from './style/theme';

import Header from './components/Header';
import AdminRouter from './shared/AdminRouter';
import DesignSystem from './routes/designSystem';
import Login from './routes/login';
import Signup from './routes/signup';

import './style/globalStyle.scss';

// Code-splitting is automated for `routes` directory
import Home from './routes/home';
import Habitat from './routes/habitat';
import Plans from './routes/plans';

const customBreakpoints = deepMerge(grommet, zoolifeTheme)

const App = () => (
  <Provider store={store}>
    <Grommet full theme={customBreakpoints} >
      <ResponsiveContext.Consumer>
        {(size) => (
          <>
            <Header />
            <Main fill={size === 'large'} pad={{ top: '60px' }}>
              <Router>
                <Home path="/" exact />
                <Habitat path="/habitat" />
                <DesignSystem path="/design" />
                <Signup path="/signup" />
                <Login path="/login" />
                <AdminRouter path="/admin/:*" />
                <Plans path="/plans" />
              </Router>
            </Main>
          </>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  </Provider>
)

export default App;

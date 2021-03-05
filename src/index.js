import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Router } from 'preact-router';
import { Provider } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';

import { Grommet, Main, ResponsiveContext } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { grommet } from 'grommet/themes';
import { StripeContext } from 'Shared/context';
import AuthGuard from 'Components/Authorize/AuthGuard';

import store from './redux/store';

import zoolifeTheme from './grommetTheme';

import AdminRouter from './shared/AdminRouter';
import DesignSystem from './routes/designSystem';
import Login from './routes/login';
import Signup from './routes/signup';
import Map from './routes/map';
import Schedule from './routes/schedule';

import './style/globalStyle.scss';

// Code-splitting is automated for `routes` directory
import Home from './routes/home';
import Habitat from './routes/habitat';
import Plans from './routes/plans';
import Profile from './routes/profile';
import Favorite from './routes/favorite';
import NotFound from './routes/notFound';
import PasswordReset from './routes/passwordReset';
import Account from './routes/account';

const customBreakpoints = deepMerge(grommet, zoolifeTheme);

const App = () => {
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        setStripe(await loadStripe(process.env.PREACT_APP_STRIPE_PUBLIC_KEY));
      } catch (err) {
        console.error('Error loading Stripe', err.message);
      }
    };

    initializeStripe();
  }, []);

  return (
    <Provider store={store}>
      <StripeContext.Provider value={{ stripe }} width={{ max: "1650px" }} margin={{ horizontal: 'auto' }}>
        <Grommet full theme={customBreakpoints} >
          <ResponsiveContext.Consumer>
            {(size) => (
              <Main fill={size === 'large'}>
                <Router>
                  <Home path="/" exact />
                  <Signup path="/signup" />
                  <Login path="/login" />
                  <Login path="/login/token/:token" />
                  <PasswordReset path="/passwordReset" />
                  <Plans path="/plans" />

                  <AuthGuard path="/map" permission="map:view">
                    <Map />
                  </AuthGuard>
                  <AuthGuard path="/profile" permission="profile:edit">
                    <Profile />
                  </AuthGuard>
                  <AuthGuard path="/schedule" permission="schedule:view">
                    <Schedule />
                  </AuthGuard>
                  <AuthGuard path="/favorite" permission="favorite:edit">
                    <Favorite />
                  </AuthGuard>
                  <AuthGuard path="/account" permission="profile:edit">
                    <Account />
                  </AuthGuard>

                  {/* display 404 instead of Unatuhorized message
                      we don't want our viewers to know about this route
                      and still redirect unauthenticated users to /login page
                      this redirection is there not to confuse our admins */}
                  <AuthGuard path="/admin/:*" adminOnly fallback={<NotFound />}>
                    <AdminRouter />
                  </AuthGuard>

                  {/* TODO: we should consider removing this
                      another option is to set ENV variable
                      and have this route only in development */}
                  <AuthGuard path="/design" adminOnly fallback={<NotFound />}>
                    <DesignSystem />
                  </AuthGuard>

                  {/* NOTE: Habitat and NotFound need to be at the end */}
                  <AuthGuard path="/:zooName/:habitatSlug" permission="habitat:view">
                    <Habitat />
                  </AuthGuard>
                  <NotFound path=":*" />
                </Router>
              </Main>
            )}
          </ResponsiveContext.Consumer>
        </Grommet>
      </StripeContext.Provider>
    </Provider>
  );
};
export default App;

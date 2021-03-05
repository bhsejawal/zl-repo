import { h } from 'preact';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'preact/hooks';
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
import { generateTitle } from './helpers';

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

import ga from './shared/ga';

const customBreakpoints = deepMerge(grommet, zoolifeTheme);

const App = () => {
  const [stripe, setStripe] = useState(null);
  const ga4Ref = useRef();

  useEffect(() => {
    const initializeGa = async () => {
      try {
        ga4Ref.current = await ga.initialize();
        ga4Ref.current?.pageview();
      } catch (err) {
        console.error('Error loading GA', err);
      }
    };

    const initializeStripe = async () => {
      try {
        setStripe(await loadStripe(process.env.PREACT_APP_STRIPE_PUBLIC_KEY));
      } catch (err) {
        console.error('Error loading Stripe', err.message);
      }
    };

    initializeStripe();
    initializeGa();
  }, []);

  const onRouteChange = useCallback(({
    url,
    current: { props: { title, skipTitle } },
  }) => {
    if (!skipTitle && typeof window !== 'undefined') {
      document.title = generateTitle(title);
    }

    if (typeof window !== 'undefined') {
      ga4Ref.current?.pageview(url);
    }
  }, []);

  return (
    <Provider store={store}>
      <StripeContext.Provider value={{ stripe }} width={{ max: "1650px" }} margin={{ horizontal: 'auto' }}>
        <Grommet full theme={customBreakpoints} >
          <ResponsiveContext.Consumer>
            {(size) => (
              <Main fill={size === 'large'}>
                <Router onChange={onRouteChange}>
                  <Home path="/" exact />
                  <Signup path="/signup" title="Sign Up" />
                  <Login path="/login" title="Log In" />
                  <Login path="/login/token/:token" title="Log In" />
                  <PasswordReset path="/passwordReset" title="Reset Password" />
                  <Plans path="/plans" title="Subscription Plans" />

                  <AuthGuard path="/map" permission="map:view" title="Map">
                    <Map />
                  </AuthGuard>
                  <AuthGuard path="/profile" permission="profile:edit" title="Profile">
                    <Profile />
                  </AuthGuard>
                  <AuthGuard path="/schedule" permission="schedule:view" title="Talk Schedule">
                    <Schedule />
                  </AuthGuard>
                  <AuthGuard path="/favorite" permission="favorite:edit" title="Favorites">
                    <Favorite />
                  </AuthGuard>
                  <AuthGuard path="/account" permission="profile:edit">
                    <Account />
                  </AuthGuard>

                  {/* display 404 instead of Unatuhorized message
                      we don't want our viewers to know about this route
                      and still redirect unauthenticated users to /login page
                      this redirection is there not to confuse our admins */}
                  <AuthGuard path="/admin/:*" adminOnly fallback={<NotFound />} title="Admin">
                    <AdminRouter />
                  </AuthGuard>

                  {/* TODO: we should consider removing this
                      another option is to set ENV variable
                      and have this route only in development */}
                  <AuthGuard path="/design" adminOnly fallback={<NotFound />} title="Design Guideline">
                    <DesignSystem />
                  </AuthGuard>

                  {/* NOTE: Habitat and NotFound need to be at the end */}
                  <AuthGuard path="/:zooName/:habitatSlug" permission="habitat:view" skipTitle>
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

import { h } from 'preact';
import {
  useCallback,
  useEffect,
  useState,
  useErrorBoundary,
} from 'preact/hooks';
import { Provider } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { config as faConfig } from "@fortawesome/fontawesome-svg-core";

import { Grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { grommet } from 'grommet/themes';
import { StripeContext } from 'Shared/context';
import Main from 'Components/Main';
import { initializeGA } from 'Shared/ga';

import store from './redux/store';
import zoolifeTheme from './grommetTheme';

import { generateTitle } from './helpers';

import './style/globalStyle.scss';
import '@fortawesome/fontawesome-svg-core/styles.css';

const customBreakpoints = deepMerge(grommet, zoolifeTheme);

// we are manually loading FA css and this should prevent duplication
faConfig.autoAddCss = false;

const App = () => {
  const [stripe, setStripe] = useState(null);

  useErrorBoundary((err) => {
    console.error(err);
    // TODO: log this somewhere (sentry, logRocket, or GA)
  });

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        setStripe(await loadStripe(process.env.PREACT_APP_STRIPE_PUBLIC_KEY));
      } catch (err) {
        console.error('Error loading Stripe', err.message);
      }
    };

    const handleFullscreenMode = () => {
      // document.fullscreenElement will point to the element that
      // is in fullscreen mode if there is one. If there isn't one,
      // the value of the property is null.
      if (document.fullscreenElement) {
        document.body.classList.add('fullscreen');
      } else {
        document.body.classList.remove('fullscreen');
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenMode);

    initializeStripe();
    initializeGA();
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenMode);
    }
  }, []);

  const onRouteChange = useCallback(({
    current: { props: { title, skipTitle } },
  }) => {
    if (!skipTitle && typeof window !== 'undefined') {
      document.title = generateTitle(title);
    }
  }, []);

  return (
    <Provider store={store}>
      <StripeContext.Provider value={{ stripe }}>
        <Grommet
          full
          className="calculated-full-height"
          theme={customBreakpoints}
          background="transparent"
          >
          <Main onRouteChange={onRouteChange} />
        </Grommet>
      </StripeContext.Provider>
    </Provider>
  );
};

export default App;

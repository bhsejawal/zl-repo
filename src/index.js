import { h } from 'preact';
import {
  useCallback,
  useEffect,
  useRef,
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

import store from './redux/store';
import zoolifeTheme from './grommetTheme';

import { generateTitle } from './helpers';
import ga from './shared/ga';

import './style/globalStyle.scss';
import '@fortawesome/fontawesome-svg-core/styles.css';

const customBreakpoints = deepMerge(grommet, zoolifeTheme);

// we are manually loading FA css and this should prevent duplication
faConfig.autoAddCss = false;

const App = () => {
  const [stripe, setStripe] = useState(null);
  const ga4Ref = useRef();

  useErrorBoundary((err) => {
    console.error(err);
    // TODO: log this somewhere (sentry, logRocket, or GA)
  });

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
      <StripeContext.Provider value={{ stripe }}>
        <Grommet full theme={customBreakpoints} >
          <Main onRouteChange={onRouteChange} />
        </Grommet>
      </StripeContext.Provider>
    </Provider>
  );
};
export default App;

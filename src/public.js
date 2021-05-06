import Router from "preact-router";
import { useEffect, useErrorBoundary } from "preact/hooks";
import { Grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { grommet } from 'grommet/themes';
import { connect, Provider } from "react-redux";
import { config as faConfig } from "@fortawesome/fontawesome-svg-core";

import { PRIVACY_PDF_URL, TERMS_PDF_URL } from 'Components/TermsAndConditions';
import ContactUsModalLoader from "Components/async/ContactUsModalLoader";
import Home from "./routes/home";
import TermsAndPrivacy from "./routes/TermsAndPrivacy";

import oranaZooLogo from './components/Main/partners/orana-zoo.png';
import torontoZooLogo from './components/Main/partners/toronto-zoo.png';
import pmmcLogo from './components/Main/partners/pmmc.png';
import sanAntonioLogo from './components/Main/partners/san-antonio-zoo.png';
import zoolifeTheme from './grommetTheme';
import store from "./redux/store";

import { logPageView, logAndGetCampaignData } from './helpers';
import { updateReferralData } from "./redux/actions";

import '@fortawesome/fontawesome-svg-core/styles.css';

const customBreakpoints = deepMerge(grommet, zoolifeTheme);
const homeTitle = "The world's first digital zoo.";

// we are manually loading FA css and this should prevent duplication
faConfig.autoAddCss = false;

const Content = ({ showContactUs, updateReferralDataAction }) => {
  useEffect(() => {
    const campaignData = logAndGetCampaignData();
    updateReferralDataAction(campaignData);
  }, [updateReferralDataAction]);

  const routerChangeHandler = (props) => {
    const { url, previous } = props;

    // Segments sends a beacon when plugin is loaded, hence, we should ignore if previous is empty
    // Its possible to see some duplicated entries on dev due to hot reload
    if (url !== previous && typeof previous !== 'undefined') {
      logPageView();
    }
  }

  return (
    <Grommet full theme={customBreakpoints}>
      <Router onRouteChange={routerChangeHandler}>
        <Home path="/" exact title={homeTitle} />
        <Home path="/oranapark" partnerImage={oranaZooLogo} exact title={homeTitle} />
        <Home path="/orana" partnerImage={oranaZooLogo} exact title={homeTitle} />
        <Home path="/torontozoo" partnerImage={torontoZooLogo} exact title={homeTitle} />
        <Home path="/pmmc" partnerImage={pmmcLogo} exact title={homeTitle} />
        <Home path="/sazoo" partnerImage={sanAntonioLogo} exact title={homeTitle} />

        <TermsAndPrivacy
          path="/terms-and-conditions"
          title="Terms and Conditions"
          pdfLink={TERMS_PDF_URL}
        />
        <TermsAndPrivacy
          path="/privacy-policy"
          title="Privacy Policy"
          pdfLink={PRIVACY_PDF_URL}
        />
      </Router>
      <ContactUsModalLoader isOpen={showContactUs} />
    </Grommet>
  );
};

const ConnectedContent = connect(
  ({ modals: { contactus: { isOpen: showContactUs } } }) => ({ showContactUs }),
  { updateReferralDataAction: updateReferralData },
)(Content);

const PublicPages = () => {
  useErrorBoundary((err) => {
    console.error(err);
    // TODO: log this somewhere (sentry, logRocket, or GA)
  });

  return (
    <Provider store={store}>
      <ConnectedContent />
    </Provider>
  );
};

export default PublicPages;

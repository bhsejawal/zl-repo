import Router from "preact-router";
import { useEffect, useErrorBoundary } from "preact/hooks";
import { connect, Provider } from "react-redux";
import { config as faConfig } from "@fortawesome/fontawesome-svg-core";
import { Grommet } from 'grommet';

/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable import/no-unresolved */
import TermsAndPrivacy from "async!./routes/TermsAndPrivacy";
import NotFound from "async!./routes/notFound";
/* eslint-enable import/no-webpack-loader-syntax */
/* eslint-enable import/no-unresolved */
import { PRIVACY_PDF_URL, TERMS_PDF_URL } from 'Components/TermsAndConditions/constants';
import ContactUsModalLoader from "Components/async/ContactUsModalLoader";
import InviteModalLoader from "Components/async/InviteModalLoader";

import Home from "./routes/home";
import Album from "./routes/album";

import AppLoader from "./components/AppLoader";
import oranaZooLogo from './components/Main/partners/orana-zoo.png';
import torontoZooLogo from './components/Main/partners/toronto-zoo.png';
import pmmcLogo from './components/Main/partners/pmmc.png';
import sanAntonioLogo from './components/Main/partners/san-antonio-zoo.png';
import santaBarbaraLogo from './components/Main/partners/santa-barbara-zoo.png';

import store from "./redux/store";
import { initializeGA, logPageViewGA } from './shared/ga';

import { logAndGetCampaignData } from './helpers';
import { updateReferralData } from "./redux/actions";

import '@fortawesome/fontawesome-svg-core/styles.css';
import './style/globalStyle.scss';

const homeTitle = "The world's first virtual zoo.";

// we are manually loading FA css and this should prevent duplication
faConfig.autoAddCss = false;

const Content = ({
  showContactUs,
  updateReferralDataAction,
  showInvite,
}) => {
  useEffect(() => {
    const campaignData = logAndGetCampaignData();
    updateReferralDataAction(campaignData);
  }, [updateReferralDataAction]);

  const routerChangeHandler = (props) => {
    const { url } = props;
    logPageViewGA(url)
    if (typeof window !== 'undefined' && window?.fbq) {
      window.fbq('track', 'PageView');
    }
  }

  useEffect(() => {
    initializeGA();
    if (typeof window !== 'undefined') {
      logPageViewGA(window.location.pathname);
    }
  }, []);

  return (
    <Grommet>
      <Router onRouteChange={routerChangeHandler}>
        <Home path="/" exact title={homeTitle} />
        <Home path="/twitch" exact title={homeTitle} />
        <Home path="/oranapark" partnerImage={oranaZooLogo} exact title={homeTitle} partner="orana" />
        <Home path="/orana" partnerImage={oranaZooLogo} exact title={homeTitle} partner="orana" />
        <Home path="/torontozoo" partnerImage={torontoZooLogo} exact title={homeTitle} partner="torontozoo" />
        <Home path="/pmmc" partnerImage={pmmcLogo} exact title={homeTitle} partner="pmmc" />
        <Home path="/pmmccamp" partnerImage={pmmcLogo} exact title={homeTitle} partner="pmmc" />
        <Home path="/sazoo" partnerImage={sanAntonioLogo} exact title={homeTitle} partner="sazoo" />
        <Home path="/sbzoo" partnerImage={santaBarbaraLogo} exact title={homeTitle} partner="sbzoo" />
        {/* these routes can be briefly rendered on slow devices
        while waiting for the full page load */}
        <AppLoader path="/login" title="Log In" />
        <AppLoader path="/login/token/:token" title="Log In" />
        <AppLoader path="/signup" title="Sign Up" />
        <AppLoader path="/prices" title="Sign Up" />

        <Album mediaType="photos" path="/album/photos/:photoId" />
        <Album mediaType="videos" path="/album/videos/:videoId" />

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

        {/* NOTE: NotFound need to be at the end */}
        <NotFound path=":*" />
      </Router>

      <ContactUsModalLoader isOpen={showContactUs} />
      <InviteModalLoader isOpen={showInvite} />
    </Grommet>
  );
};

const ConnectedContent = connect(({
  modals: { contactus: { isOpen: showContactUs }, invite: { isOpen: showInvite } },
}) => (
  { showContactUs, showInvite }
), { updateReferralDataAction: updateReferralData })(Content);

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

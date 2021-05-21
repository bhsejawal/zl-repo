import { Router } from 'preact-router';
import { Box } from 'grommet';
import { useState, useEffect } from 'preact/hooks';
import { connect } from 'react-redux';

import TimeBar from 'Components/TimeBar';
import AuthGuard from 'Components/Authorize/AuthGuard';
import Redirect from 'Components/Redirect';
import TermsAndConditions, { PRIVACY_PDF_URL, TERMS_PDF_URL } from 'Components/TermsAndConditions';
import ContactUsModalLoader from 'Components/async/ContactUsModalLoader';

import oranaZooLogo from './partners/orana-zoo.png';
import torontoZooLogo from './partners/toronto-zoo.png';
import pmmcLogo from './partners/pmmc.png';
import sanAntonioLogo from './partners/san-antonio-zoo.png';

// Code-splitting is automated for `routes` directory
import PasswordReset from '../../routes/passwordReset';
import Home from '../../routes/home';
import Signup from '../../routes/signup';
import Login from '../../routes/login';
import Profile from '../../routes/profile';
import NotFound from '../../routes/notFound';
import DesignSystem from '../../routes/designSystem';
import RedirectPage from '../../routes/redirectPage';
import TermsAndPrivacy from '../../routes/TermsAndPrivacy';
import AdminRouter from './AdminRouter';
import AppRouter from './AppRouter';
import MobileGuard from './MobileGuard';

import { logPageView, logAndGetCampaignData } from '../../helpers';
import { updateReferralData } from '../../redux/actions';

const homeTitle = "The world's first digital zoo.";

const Main = ({
  onRouteChange,
  isTrial,
  showContactUs,
  updateReferralDataAction,
}) => {
  const [path, setPath] = useState();

  useEffect(() => {
    const campaignData = logAndGetCampaignData();
    updateReferralDataAction(campaignData);
  }, [updateReferralDataAction])

  const routerChangeHandler = (props) => {
    const { url, previous, current: { props: { matches } } } = props;

    if (url.startsWith('/socialLogin') && matches?.newUser === "true") {
      logPageView('/signed-up')
    }

    if (url.startsWith('/checkout-completed')) {
      const { passType } = matches;
      if (passType) {
        logPageView(`/purchased-${passType}`)
      }
    }

    // Segments sends a beacon when plugin is loaded, hence, we should ignore if previous is empty
    // Its possible to see some duplicated entries on dev due to hot reload
    if (url !== previous && typeof previous !== 'undefined') {
      logPageView();
    }

    onRouteChange(props);
    setPath(url);
  }

  return (
    // time bar padding
    <Box fill pad={{ bottom: isTrial ? '58px' : undefined }}>
      <Router onChange={routerChangeHandler}>
        <Home path="/" exact title={homeTitle} />
        <Home path="/twitch" exact title={homeTitle} />
        <Home path="/oranapark" partnerImage={oranaZooLogo} exact title={homeTitle} />
        <Home path="/orana" partnerImage={oranaZooLogo} exact title={homeTitle} />
        <Home path="/torontozoo" partnerImage={torontoZooLogo} exact title={homeTitle} />
        <Home path="/pmmc" partnerImage={pmmcLogo} exact title={homeTitle} />
        <Home path="/sazoo" partnerImage={sanAntonioLogo} exact title={homeTitle} />

        <Redirect path="/socialLogin" to="/map" />
        <Redirect path="/checkout-completed" to="/welcome" />
        <Redirect path="/checkout-cancelled" to="/plans" />

        <AuthGuard path="/login" guestOnly title="Log In" redirectTo="/map">
          <Login />
        </AuthGuard>

        <AuthGuard path="/signup" guestOnly title="Sign Up" redirectTo="/">
          <Signup />
        </AuthGuard>

        <AuthGuard path="/login/token/:token" title="Log In" redirectTo="/" guestOnly>
          <Login />
        </AuthGuard>

        <PasswordReset path="/passwordReset" title="Reset Password" />

        <MobileGuard path="/profile" title="Profile">
          <AuthGuard permission="profile:edit">
            <Profile step />
          </AuthGuard>
        </MobileGuard>

        {/* display 404 instead of Unatuhorized message
            we don't want our viewers to know about this route
            and still redirect unauthenticated users to /login page
            this redirection is there not to confuse our admins */}
        <MobileGuard path="/admin/:*" title="Admin">
          <AuthGuard adminOnly fallback={<NotFound />}>
            <AdminRouter />
          </AuthGuard>
        </MobileGuard>

        {/* TODO: we should consider removing this
            another option is to set ENV variable
            and have this route only in development */}
        <MobileGuard path="/design" title="Design Guideline">
          <AuthGuard adminOnly fallback={<NotFound />}>
            <DesignSystem />
          </AuthGuard>
        </MobileGuard>

        <AuthGuard path="/mobile" phoneOnly title="Our animals are too big" redirectTo="/" permission="redirect:view">
          <RedirectPage />
        </AuthGuard>

        <MobileGuard path="/welcome" title="Welcome to Zoolife">
          <AppRouter />
        </MobileGuard>
        <MobileGuard path="/h/:zooName/:habitatSlug" skipTitle>
          <AppRouter />
        </MobileGuard>
        <MobileGuard path="/map" title="Map">
          <AppRouter />
        </MobileGuard>
        <MobileGuard path="/schedule" title="Talk Schedule">
          <AppRouter />
        </MobileGuard>
        <MobileGuard path="/favorite" title="Favorites">
          <AppRouter />
        </MobileGuard>
        <MobileGuard path="/account" title="Account">
          <AppRouter />
        </MobileGuard>
        <MobileGuard path="/plans" title="Plans">
          <AppRouter />
        </MobileGuard>

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

      <TimeBar path={path} />
      <TermsAndConditions />
      <ContactUsModalLoader isOpen={showContactUs} />
    </Box>
  )
};

export default connect((
  { user: { subscription: { productId } }, modals: { contactus: { isOpen: showContactUs }} },
) => (
  { isTrial: productId === 'TRIAL', showContactUs }
), {
  updateReferralDataAction: updateReferralData,
})(Main);

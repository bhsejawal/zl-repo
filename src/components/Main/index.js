import { Router, route } from 'preact-router';
import { Box } from 'grommet';
import { useState, useEffect } from 'preact/hooks';
import { connect } from 'react-redux';

import TimeBar from 'Components/TimeBar';
import AuthGuard from 'Components/Authorize/AuthGuard';
import TermsAndConditions from 'Components/TermsAndConditions';
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
import AdminRouter from './AdminRouter';
import AppRouter from './AppRouter';

import { getDeviceType, logPageView, logAndGetCampaignData } from '../../helpers';

import { updateReferralData } from '../../redux/actions';

const mobileRoutes = ['/', '/signup', '/mobile', '/login', '/torontozoo', '/oranapark', '/orana', '/pmmc', '/sazoo'];

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
    const { url, previous } = props;

    // Segments sends a beacon when plugin is loaded, hence, we should ignore if previous is empty
    // Its possible to see some duplicated entries on dev due to hot reload
    if (url !== previous && typeof previous !== 'undefined') {
      logPageView();
    }

    if (getDeviceType() === 'phone' && !mobileRoutes.includes(url)) {
      route('/mobile', true);
      setPath('/mobile');
    } else {
      onRouteChange(props);
      setPath(url);
    }
  }

  return (
    // time bar padding
    <Box fill pad={{ bottom: isTrial ? '58px' : undefined }}>
      <Router onChange={routerChangeHandler}>
        <Home path="/" exact />
        <Home path="/oranapark" partnerImage={oranaZooLogo} exact />
        <Home path="/orana" partnerImage={oranaZooLogo} exact />
        <Home path="/torontozoo" partnerImage={torontoZooLogo} exact />
        <Home path="/pmmc" partnerImage={pmmcLogo} exact />
        <Home path="/sazoo" partnerImage={sanAntonioLogo} exact />

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

        <AuthGuard path="/profile" permission="profile:edit" title="Profile">
          <Profile step />
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

        <AuthGuard path="/mobile" phoneOnly title="Our animals are too big" redirectTo="/" permission="redirect:view">
          <RedirectPage />
        </AuthGuard>

        <AppRouter path="/welcome" />
        <AppRouter path="/h/:zooName/:habitatSlug" />
        <AppRouter path="/map" />
        <AppRouter path="/schedule" />
        <AppRouter path="/favorite" />
        <AppRouter path="/account" />
        <AppRouter path="/plans" />

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

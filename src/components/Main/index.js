import { Router, route } from 'preact-router';
import { Box } from 'grommet';
import { useState } from 'preact/hooks';
import { connect } from 'react-redux';

import classnames from 'classnames';
import AdminRouter from 'Shared/AdminRouter';
import TimeBar from 'Components/TimeBar';
import AuthGuard from 'Components/Authorize/AuthGuard';
import TermsAndConditions from 'Components/TermsAndConditions';

import oranaZooLogo from 'Assets/partners/orana-zoo.png';
import torontoZooLogo from 'Assets/partners/toronto-zoo.png';
import pmmcLogo from 'Assets/partners/pmmc.png';
import sanAntonioLogo from 'Assets/partners/san-antonio-zoo.png';

// Code-splitting is automated for `routes` directory
import PasswordReset from '../../routes/passwordReset';
import Home from '../../routes/home';
import Signup from '../../routes/signup';
import Login from '../../routes/login';
import Plans from '../../routes/plans';
import Map from '../../routes/map';
import Profile from '../../routes/profile';
import Schedule from '../../routes/schedule';
import Favorite from '../../routes/favorite';
import Account from '../../routes/account';
import NotFound from '../../routes/notFound';
import DesignSystem from '../../routes/designSystem';
import Habitat from '../../routes/habitat';
import RedirectPage from '../../routes/redirectPage';

import { getDeviceType, logPageView } from '../../helpers';

import style from './style.scss';

const mobileRoutes = ['/', '/signup', '/mobile', '/login']
const Main = ({ onRouteChange, isTrial }) => {
  const [path, setPath] = useState();

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
    <Box
      className={classnames(style.main, {[style.timeBarSpace]: isTrial})}
      width={{ max: "1650px", min: "350px" }}
      margin={{ horizontal: 'auto' }}
      fill
    >
      <Router onChange={routerChangeHandler}>
        <Home path="/" exact />

        <Home path="/orana-zoo" partnerImage={oranaZooLogo} exact />
        <Home path="/toronto-zoo" partnerImage={torontoZooLogo} exact />
        <Home path="/pacific-marine-mammal-center" partnerImage={pmmcLogo} exact />
        <Home path="/san-antonio-zoo" partnerImage={sanAntonioLogo} exact />

        <AuthGuard path="/login" guestOnly title="Log In" redirectTo="/">
          <Login />
        </AuthGuard>

        <AuthGuard path="/signup" guestOnly title="Sign In" redirectTo="/">
          <Signup />
        </AuthGuard>

        <AuthGuard path="/login/token/:token" title="Log In" redirectTo="/" guestOnly>
          <Login />
        </AuthGuard>

        <PasswordReset path="/passwordReset" title="Reset Password" />

        <AuthGuard path="/plans" permission="checkout:plans" title="Plans">
          <Plans />
        </AuthGuard>

        <AuthGuard path="/map" permission="map:view" title="Map" redirectTo="/plans">
          <Map />
        </AuthGuard>
        <AuthGuard path="/profile" permission="profile:edit" title="Profile">
          <Profile step />
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

        <AuthGuard path="/h/:zooName/:habitatSlug" permission="habitat:view" skipTitle redirectTo="/plans">
          <Habitat />
        </AuthGuard>

        <AuthGuard path="/mobile" phoneOnly title="Our animals are too big" redirectTo="/" permission="redirect:view">
          <RedirectPage />
        </AuthGuard>

        {/* NOTE: NotFound need to be at the end */}
        <NotFound path=":*" />
      </Router>

      <TimeBar path={path} />
      <TermsAndConditions />
    </Box>
  )
};

export default connect((
  { user: { subscription: { productId } } },
) => ({ isTrial: productId === 'TRIAL' }))(Main);

import { Router } from 'preact-router';
import { Box } from 'grommet';

import AuthGuard from 'Components/Authorize/AuthGuard';
import Header from 'Components/Header';

import Plans from '../../routes/plans';
import Map from '../../routes/map';
import Schedule from '../../routes/schedule';
import Favorite from '../../routes/favorite';
import Account from '../../routes/account';
import Habitat from '../../routes/habitat';
import Welcome from '../../routes/welcome';

const AppRouter = () => (
  <Box fill>
    <Header />

    <Box fill pad={{ top: 'var(--headerHeight)' }}>
      <Box fill overflow="auto">
        <Box fill width={{ max: "1650px", min: "350px" }} margin={{ horizontal: 'auto' }}>
          <Router>
            <AuthGuard path="/welcome" title="Welcome to Zoolife" redirectTo="/" permission="welcome:view">
              <Welcome />
            </AuthGuard>
            <AuthGuard path="/h/:zooName/:habitatSlug" permission="habitat:view" skipTitle redirectTo="/plans">
              <Habitat />
            </AuthGuard>
            <AuthGuard path="/map" permission="map:view" title="Map" redirectTo="/plans">
              <Map />
            </AuthGuard>
            <AuthGuard path="/schedule" permission="schedule:view" title="Talk Schedule" redirectTo="/plans">
              <Schedule />
            </AuthGuard>
            <AuthGuard path="/favorite" permission="favorite:edit" title="Favorites" redirectTo="/plans">
              <Favorite />
            </AuthGuard>
            <AuthGuard path="/account" permission="profile:edit">
              <Account />
            </AuthGuard>
            <AuthGuard path="/plans" permission="checkout:plans" title="Plans">
              <Plans />
            </AuthGuard>
          </Router>
        </Box>
      </Box>
    </Box>
  </Box>
);

export default AppRouter;

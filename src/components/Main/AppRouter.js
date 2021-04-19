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

const PageWrapper = ({ children }) => (
  <Box fill pad={{ top: 'var(--headerHeight)' }}>
    <Box fill overflow="auto">
      <Box fill width={{ max: "1650px", min: "350px" }} margin={{ horizontal: 'auto' }}>
        {children}
      </Box>
    </Box>
  </Box>
);

const AppRouter = ({ matches }) => (
  <Box fill>
    <Router>
      <AuthGuard path="/welcome" title="Welcome to Zoolife" redirectTo="/" permission="welcome:view">
        <Header />
        <PageWrapper>
          <Welcome />
        </PageWrapper>
      </AuthGuard>
      <AuthGuard path="/h/:zooName/:habitatSlug" permission="habitat:view" skipTitle redirectTo="/plans">
        <Header />
        <PageWrapper>
          <Habitat matches={matches} />
        </PageWrapper>
      </AuthGuard>
      <AuthGuard path="/map" permission="map:view" title="Map" redirectTo="/plans">
        <Header />
        <PageWrapper>
          <Map />
        </PageWrapper>
      </AuthGuard>
      <AuthGuard path="/schedule" permission="schedule:view" title="Talk Schedule" redirectTo="/plans">
        <Header />
        <PageWrapper>
          <Schedule />
        </PageWrapper>
      </AuthGuard>
      <AuthGuard path="/favorite" permission="favorite:edit" title="Favorites" redirectTo="/plans">
        <Header />
        <PageWrapper>
          <Favorite />
        </PageWrapper>
      </AuthGuard>
      <AuthGuard path="/account" permission="profile:edit">
        <Header />
        <PageWrapper>
          <Account />
        </PageWrapper>
      </AuthGuard>
      <AuthGuard path="/plans" permission="checkout:plans" title="Plans">
        <Header />
        <PageWrapper>
          <Plans />
        </PageWrapper>
      </AuthGuard>
    </Router>
  </Box>
);

export default AppRouter;

import { Route, Router } from 'preact-router';
import { Box } from 'grommet';

import Header from 'Components/Header';

import Users from '../../routes/adminUsers';
import Habitats from '../../routes/adminHabitats';
import Partners from '../../routes/adminPartners';
import Reports from '../../routes/reports';

const AdminRouter = () => (
  <Box fill width={{ max: "var(--maxWidth)", min: "350px" }} margin={{ horizontal: 'auto' }}>
    <Header />
    <Router>
      <Route path="/admin/users" component={Users} />
      <Route path="/admin/habitats" component={Habitats} />
      <Route path="/admin/partners" component={Partners} />
      <Route path="/admin/reports" component={Reports} />
    </Router>
  </Box>
);

export default AdminRouter;

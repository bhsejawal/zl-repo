import { Route, Router } from 'preact-router';
import { Box } from 'grommet';

import Header from 'Components/Header';

import Users from '../../routes/adminUsers';
import Habitats from '../../routes/adminHabitats';
import Partners from '../../routes/adminPartners';

const AdminRouter = () => (
  <Box fill width={{ max: "1650px", min: "350px" }} margin={{ horizontal: 'auto' }}>
    <Header />
    <Router>
      <Route path="/admin/users" component={Users} />
      <Route path="/admin/habitats" component={Habitats} />
      <Route path="/admin/partners" component={Partners} />
    </Router>
  </Box>
);

export default AdminRouter;

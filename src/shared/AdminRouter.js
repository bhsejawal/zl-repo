import { Route, Router } from 'preact-router';

import Users from '../routes/adminUsers';
import Habitats from '../routes/adminHabitats';
import Partners from '../routes/adminPartners';

const AdminRouter = () => (
  <Router>
    <Route path="/admin/users" component={Users} />
    <Route path="/admin/habitats" component={Habitats} />
    <Route path="/admin/partners" component={Partners} />
  </Router>
);

export default AdminRouter;

import { Route, Router } from 'preact-router';

import Users from '../routes/adminUsers';

const AdminRouter = () => (
  <Router>
    <Route path="/admin/" component={() => (<div style={{marginTop: 'var(--headerHeight)'}}>Admin Generic</div>)} />
    <Route path="/admin/users" component={Users} />
    <Route path="/admin/test/:test" component={() => (<div style={{marginTop: 'var(--headerHeight)'}}>Admin test 2</div>)} />
    <Route default component={() => (<div style={{marginTop: 'var(--headerHeight)'}}>Admin NOT FOUND</div>)} />
  </Router>
);

export default AdminRouter;

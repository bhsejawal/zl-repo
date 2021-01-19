import { Route, Router } from 'preact-router';

const AdminRouter = () => (
  <Router>
    <Route path="/admin/" component={() => (<div style={{marginTop: 'var(--headerHeight)'}}>Admin Generic</div>)} />
    <Route path="/admin/test" component={() => (<div style={{marginTop: 'var(--headerHeight)'}}>Admin test</div>)} />
    <Route path="/admin/test/:test" component={() => (<div style={{marginTop: 'var(--headerHeight)'}}>Admin test 2</div>)} />
    <Route default component={() => (<div style={{marginTop: 'var(--headerHeight)'}}>Admin NOT FOUND</div>)} />
  </Router>
);

export default AdminRouter;

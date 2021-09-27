import { connect } from 'react-redux';

import ViewsCount from './standalone';

const VIEWER_ADJUSTMENT = 5;

const ConnectedViewersCount = ({ plain, viewers, className }) => (
  <ViewsCount viewers={ viewers + VIEWER_ADJUSTMENT } className={className} plain={plain} />
);

export default connect(({ mainStream: { viewers }}) => ({ viewers }))(ConnectedViewersCount);

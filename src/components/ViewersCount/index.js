import { connect } from 'react-redux';

import ViewsCount from './standalone';

const ConnectedViewersCount = ({ plain, viewers, className }) => (
  <ViewsCount viewers={viewers} className={className} plain={plain} />
);

export default connect(({ mainStream: { viewers }}) => ({ viewers }))(ConnectedViewersCount);

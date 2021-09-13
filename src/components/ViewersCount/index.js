import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';

import style from './style.scss';

const VIEWER_ADJUSTMENT = 5;

const ViewersCount = ({ plain, viewers }) => (
  <div className={classnames({ [style.viewerCountWrapper]: !plain })}>
    <div className={style.viewerCount}>
      <FontAwesomeIcon icon={faEye} />
      <span>
        {viewers + VIEWER_ADJUSTMENT}
      </span>
    </div>
  </div>
);

export default connect(({ mainStream: { viewers }}) => ({ viewers }))(ViewersCount);

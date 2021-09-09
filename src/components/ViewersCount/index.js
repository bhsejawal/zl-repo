import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/pro-solid-svg-icons';

import style from './style.scss';

const VIEWER_ADJUSTMENT = 5;

const ViewersCount = ({ viewers }) => (
  <div className={style.viewerCountWrapper}>
    <div className={style.viewerCount}>
      <FontAwesomeIcon icon={faEye} />
      <span>
        {viewers + VIEWER_ADJUSTMENT}
      </span>
    </div>
  </div>
);

export default connect(({ mainStream: { viewers }}) => ({ viewers }))(ViewersCount);

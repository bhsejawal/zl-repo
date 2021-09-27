import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';

import style from './style.scss';

const ViewersCount = ({ plain, viewers, className }) => (
  <div className={classnames(className, { [style.viewerCountWrapper]: !plain })}>
    <div className={style.viewerCount}>
      <FontAwesomeIcon icon={faEye} />
      <span>
        {viewers}
      </span>
    </div>
  </div>
);

export default ViewersCount;

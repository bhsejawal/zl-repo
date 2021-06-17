import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import classnames from 'classnames';

import style from './style.scss';

const CloseButton = ({ className, onClick, varient }) => (
  <button
    type="button"
    onClick={onClick}
    className={classnames(style.close, className, { [style[varient]]: varient })}
  >
    <FontAwesomeIcon icon={faTimes} />
  </button>
);

export default CloseButton;

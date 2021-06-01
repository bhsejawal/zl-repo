import { h } from 'preact';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';

import style from './style.scss';

const RoundButton = ({
  backgroundColor,
  color,
  width,
  onClick,
  className,
  disabled,
  loading,
  children,
}) => (
  <button
    type="button"
    className={classnames(style.roundButton, className)}
    onClick={onClick}
    disabled={disabled}
    style={{
      width: `${width}px`,
      height: `${width}px`,
      backgroundColor,
      color,
    }}
  >
    <div className={style.btnWrapper}>
      {!loading && children}
      {loading && (
        <div className={style.loaderWrapper}>
          <FontAwesomeIcon className={style.loader} icon={faSpinner} spin />
        </div>
      )}
    </div>
  </button>
);

export default RoundButton;

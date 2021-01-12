import { h } from 'preact';
import classnames from 'classnames';

import style from './style.scss';

const RoundButton = ({
  backgroundColor,
  color,
  width,
  onClick,
  className,
  children,
}) => (
  <button
    type="button"
    className={classnames(style.roundButton, className)}
    onClick={onClick}
    style={{
      width: `${width}px`,
      height: `${width}px`,
      backgroundColor,
      color,
    }}
  >
    <div className={style.btnWrapper}>
      {children}
    </div>
  </button>
);

export default RoundButton;

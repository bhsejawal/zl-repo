import { h } from 'preact';
import classnames from 'classnames';

import style from './style.scss';

const ToggleButton = ({
  children,
  active,
  value,
  className,
  onClick,
  oneColor,
}) => (
  <button
    className={classnames(style.btn, className, {
      [style.active]: active,
      [style.oneColor]: oneColor,
    })}
    type="button"
    data-value={value}
    onClick={onClick}
  >
    {children}
  </button>
);

export default ToggleButton;

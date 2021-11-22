import classnames from 'classnames';
import { route } from 'preact-router';

import style from '../style.scss';

const clickHandler = (onClick, name, value) => () => {
  if (value) {
    route(`${window.location.pathname}?${name}=${value}`);
  }

  onClick();
};

const Tab = ({
  active,
  icon,
  color,
  title,
  description,
  param,
  onClick,
}) => (
  <div className={classnames(style.tabContainer, { [style.active]: active })}>
    <div
      className={style.wrapper}
      style={{ backgroundColor: color }}
      onClick={clickHandler(onClick, 'card', param)}
    >
      <div className={style.top}>
        <img src={icon} alt="" />
      </div>
      <div className={style.bottom}>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  </div>
);

export default Tab;

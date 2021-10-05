import classnames from 'classnames';

import style from '../style.scss';

const Tab = ({
  active,
  icon,
  iconTip,
  color,
  title,
  description,
  onClick,
}) => (
  <div className={classnames(style.tabContainer, { [style.active]: active })}>
    <div className={style.wrapper} style={{ backgroundColor: color }} onClick={onClick}>
      <div className={style.top}>
        {!icon && iconTip}
        {!iconTip && <img src={icon} alt="" />}
      </div>
      <div className={style.bottom}>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  </div>
);

export default Tab;

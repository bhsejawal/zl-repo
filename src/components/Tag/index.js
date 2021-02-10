import classnames from 'classnames';

import style from './style.scss';

const Tag = ({
  label,
  varient, // liveTalk, online, offline
}) => (
  <div className={classnames(style.tag, style[varient])}>
    {label}
  </div>
);

export default Tag;

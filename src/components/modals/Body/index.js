import classnames from 'classnames';

import style from './style.scss';

const Body = ({ children, className }) => (
  <div className={classnames(style.body, className)}>
    {children}
  </div>
);

export default Body;

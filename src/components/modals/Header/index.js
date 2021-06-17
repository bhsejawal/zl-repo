import classnames from 'classnames';
import CloseButton from '../CloseButton';

import style from './style.scss';

const Header = ({ onClose, children, className }) => (
  <div className={classnames(style.header, className)}>
    <CloseButton onClick={onClose} className={style.close} />
    {children}
  </div>
);

export default Header;

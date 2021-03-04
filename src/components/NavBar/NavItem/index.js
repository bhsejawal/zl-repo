import { h } from 'preact';
import { Link } from 'preact-router/match';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './style.scss';

const NavItem = ({
  url,
  text,
  icon,
  onClick,
}) => (
  <nav className={style.navItem}>
    <Link href={url} onClick={onClick}>
      <FontAwesomeIcon icon={icon} />
      <span>{text}</span>
    </Link>
  </nav>
);

export default NavItem;

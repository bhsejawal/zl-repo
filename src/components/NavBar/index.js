import { h } from 'preact';
import {
  faHeart,
  faMapMarkerAlt,
  faShare,
  faCalendarDay,
} from '@fortawesome/pro-light-svg-icons';

import NavItem from './NavItem';

import style from './style.scss';

const NavBar = () => (
  <div className={style.navBar}>
    <NavItem text="Map" url="/map" icon={faMapMarkerAlt} />
    <NavItem text="Talk Schedule" url="/schedule" icon={faCalendarDay} />
    <NavItem text="Favorites" url="/favorite" icon={faHeart} />
    <NavItem text="Share" url="/" icon={faShare} />
  </div>
);

export default NavBar;

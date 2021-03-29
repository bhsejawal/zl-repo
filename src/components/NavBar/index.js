import { h } from 'preact';
import { faHeart, faMapMarkerAlt, faCalendarDay } from '@fortawesome/pro-solid-svg-icons';

import NavItem from './NavItem';
import Invite from './Invite';

import style from './style.scss';

const NavBar = () => (
  <div className={style.navBar}>
    <NavItem text="Map" url="/map" icon={faMapMarkerAlt} />
    <NavItem text="Talk Schedule" url="/schedule" icon={faCalendarDay} />
    <NavItem text="Favorites" url="/favorite" icon={faHeart} />
    <Invite />
  </div>
);

export default NavBar;

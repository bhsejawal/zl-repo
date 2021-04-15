import { h } from 'preact';
import { route } from 'preact-router';
import {
  faHeart,
  faMapMarkerAlt,
  faCalendarDay,
  faSignInAlt,
} from '@fortawesome/pro-solid-svg-icons';

import { LandingSecondary } from 'Components/Buttons';

import NavItem from './NavItem';
import Invite from './Invite';

import style from './style.scss';

const NavBar = ({ landing }) => {
  if (landing) {
    return (
      <div className={style.navBar}>
        <Invite text="Invite Friends" />
        <NavItem text="Log In" url="/login" icon={faSignInAlt} />
        <LandingSecondary
          onClick={() => route('/signup')}
          className={style.signUpButton}
        >
          Sign Up
        </LandingSecondary>
      </div>
    )
  }
  return (
    <div className={style.navBar}>
      <NavItem text="Map" url="/map" icon={faMapMarkerAlt} />
      <NavItem text="Talk Schedule" url="/schedule" icon={faCalendarDay} />
      <NavItem text="Favorites" url="/favorite" icon={faHeart} />
      <Invite />
    </div>
  );
};

export default NavBar;

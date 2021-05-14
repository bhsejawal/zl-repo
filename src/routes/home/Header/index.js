import { h } from 'preact';
import { Header } from 'grommet';
import { faSignInAlt } from '@fortawesome/pro-solid-svg-icons';

import Invite from 'Components/NavBar/Invite';
import { LandingSecondary } from 'Components/Buttons';
import NavItem from 'Components/NavBar/NavItem';
import ZoolifeLogo from 'Components/ZoolifeLogo';
import Menu from './Menu';

import { goToLogin, goToSignup } from '../helpers';

import style from './style.scss';

const HeaderComponent = () => (
  <Header className={style.header}>
    <div className={style.logo}>
      <ZoolifeLogo landing />
    </div>

    <div className={style.navBar}>
      <Invite text="Invite Friends" />
      <NavItem text="Log In" onClick={goToLogin} icon={faSignInAlt} />
      <LandingSecondary
        onClick={goToSignup}
        className={style.signUpButton}
      >
        Sign Up
      </LandingSecondary>
    </div>

    <Menu className={style.menu} />
  </Header>
);

export default HeaderComponent;

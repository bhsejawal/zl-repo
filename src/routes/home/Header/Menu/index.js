import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { Drop, Box } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/pro-solid-svg-icons';
import { faBars } from '@fortawesome/pro-light-svg-icons';
import classnames from 'classnames';

import NavItem from 'Components/NavBar/NavItem'
import Invite from 'Components/NavBar/Invite';
import { LandingSecondary } from 'Components/Buttons';

import { goToLogin, goToSignup } from '../../helpers';

import style from './style.scss';

const Menu = ({ className }) => {
  const buttonRef = useRef(null)
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={classnames(style.menuContainer, className)}>
      <Box
        pad="20px"
        align="center"
        justify="start"
        ref={buttonRef}
        onClick={() => setShowMenu(!showMenu)}
      >
        <FontAwesomeIcon icon={faBars} />
      </Box>
      {showMenu && (
        <Drop
          align={{ top: 'bottom' }}
          target={buttonRef.current}
          elevation="xlarge"
          className={style.menuDrop}
          width="100%"
          height="200px"
          round="false"
        >
          <Box align="center" margin={{ top: '20px', left: '5px' }}>
            <Invite text="Invite Friends" />
          </Box>
          <Box align="center" margin={{ top: '20px', left: '5px' }}>
            <NavItem onClick={goToLogin} text="Log In" url="/login" icon={faSignOut} />
          </Box>
          <Box margin={{ top: '35px', left: '20px' }}>
            <LandingSecondary
              onClick={goToSignup}
              className={style.signUpButton}
            >
              Sign Up
            </LandingSecondary>
          </Box>
        </Drop>
      )}
    </div>
  );
};

export default Menu;

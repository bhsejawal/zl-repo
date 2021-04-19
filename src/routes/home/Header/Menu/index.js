import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { route } from 'preact-router';
import { Drop, Box } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from '@fortawesome/pro-solid-svg-icons';
import { faBars } from '@fortawesome/pro-light-svg-icons';
import NavItem from 'Components/NavBar/NavItem'
import Invite from 'Components/NavBar/Invite';
import { LandingSecondary } from 'Components/Buttons';

import style from './style.scss';

const Menu = () => {
  const buttonRef = useRef(null)
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={style.menuContainer}>
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
            <NavItem text="Log In" url="/login" icon={faSignOut} />
          </Box>
          <Box margin={{ top: '35px', left: '20px' }}>
            <LandingSecondary
              onClick={() => route('/signup')}
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

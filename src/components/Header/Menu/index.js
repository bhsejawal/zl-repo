import { h } from 'preact';
import { route } from 'preact-router';
import { useRef, useState } from 'preact/hooks';
import { Drop, Box, Text } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faQuestionCircle, faSignOut } from '@fortawesome/pro-solid-svg-icons';
import useFetch from 'use-http';
import { connect } from 'react-redux';

import { buildURL } from 'Shared/fetch';
import AnimalIcon from 'Components/AnimalIcon';

import { unsetUserData } from '../../../redux/actions'
import { openContactUsModal } from '../../modals/ContactUs/actions'

import style from './style.scss';

const Menu = ({ unsetUserDataAction, openContactUsModalAction }) => {
  const buttonRef = useRef(null)
  const [showMenu, setShowMenu] = useState(false);
  const { post, response } = useFetch(
    buildURL('/admin/users/logout'),
    { credentials: 'include', cachePolicy: 'no-cache' },
  );

  const handleLogout = async () => {
    await post();
    if (response.ok) {
      setShowMenu(false);
      unsetUserDataAction();
      route('/login');
    }
  }

  const accountHandler = () => {
    setShowMenu(false);
    route('/account')
  }

  return (
    <div className={style.menuContainer}>
      <Box
        pad="12px"
        align="center"
        justify="start"
        ref={buttonRef}
        onClick={() => setShowMenu(!showMenu)}
      >
        <AnimalIcon />
      </Box>
      {showMenu && (
        <Drop
          align={{ top: 'bottom' }}
          target={buttonRef.current}
          elevation="xlarge"
          className={style.menuItem}
        >
          <Box
            width="195px"
            height="35px"
            pad={{ horizontal: '15px' }}
            direction="row"
            align="center"
            onClick={accountHandler}
          >
            <FontAwesomeIcon icon={faCog} />
            <Box margin={{ left: '12px' }}>
              <Text size="large">My Account</Text>
            </Box>
          </Box>
          <Box
            width="195px"
            height="35px"
            pad={{ horizontal: '15px' }}
            direction="row"
            align="center"
            onClick={openContactUsModalAction}
          >
            <FontAwesomeIcon icon={faQuestionCircle} />
            <Box margin={{ left: '12px' }}>
              <Text size="large">Help</Text>
            </Box>
          </Box>
          <Box
            width="195px"
            height="35px"
            pad={{ horizontal: '15px' }}
            direction="row"
            align="center"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOut} />
            <Box margin={{ left: '12px' }}>
              <Text size="large">Log Out</Text>
            </Box>
          </Box>
        </Drop>
      )}
    </div>
  );
};

export default connect(null, {
  unsetUserDataAction: unsetUserData,
  openContactUsModalAction: openContactUsModal,
})(Menu);

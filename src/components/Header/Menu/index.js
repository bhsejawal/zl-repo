import { h } from 'preact';
import { route } from 'preact-router';
import { useRef, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { Drop, Box, Text } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faGlobeAmericas,
  faHeart,
  faQuestionCircle,
  faSignOut,
  faUsersCog,
} from '@fortawesome/pro-solid-svg-icons';
import useFetch from 'use-http';

import { hasPermission } from 'Components/Authorize';
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

  const contactUsHandler = () => {
    setShowMenu(false);
    openContactUsModalAction()
  }

  return (
    <div className={style.menuContainer}>
      <Box
        pad="12px"
        align="center"
        justify="start"
        ref={buttonRef}
        // using onclick for cursor pointer,
        // and onMouseDown to prevent reopening on avatar click
        onClick={() => {}}
        onMouseDown={() => setShowMenu(!showMenu)}
      >
        <AnimalIcon />
      </Box>

      {showMenu && (
        <Drop
          align={{ top: 'bottom' }}
          target={buttonRef.current}
          elevation="xlarge"
          className={style.menuItem}
          onClickOutside={() => setShowMenu(false)}
          onClick={() => setShowMenu(false)}
          width={{ min: '180px' }}
        >
          {hasPermission('admin:menu') && (
            <>
              <Box
                width="195px"
                height="35px"
                pad={{ horizontal: '15px' }}
                direction="row"
                align="center"
                onClick={() => route('/admin/users')}
              >
                <FontAwesomeIcon icon={faUsersCog} />
                <Box margin={{ left: '12px' }}>
                  <Text size="large">Users (Admin)</Text>
                </Box>
              </Box>
              <Box
                width="195px"
                height="35px"
                pad={{ horizontal: '15px' }}
                direction="row"
                align="center"
                onClick={() => route('/admin/habitats')}
              >
                <FontAwesomeIcon icon={faGlobeAmericas} />
                <Box margin={{ left: '12px' }}>
                  <Text size="large">Habitats (Admin)</Text>
                </Box>
              </Box>
              <Box
                width="195px"
                height="35px"
                pad={{ horizontal: '15px' }}
                direction="row"
                align="center"
                onClick={() => route('/admin/partners')}
              >
                <FontAwesomeIcon icon={faHeart} />
                <Box margin={{ left: '12px' }}>
                  <Text size="large">Partners (Admin)</Text>
                </Box>
              </Box>
            </>
          )}

          <Box
            width="195px"
            height="35px"
            pad={{ horizontal: '15px' }}
            direction="row"
            align="center"
            onClick={() => route('/account')}
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
            onClick={contactUsHandler}
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

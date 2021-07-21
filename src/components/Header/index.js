import { h } from 'preact';
import { connect } from 'react-redux';
import { Box, Header } from 'grommet';
import {
  faHeart,
  faMapMarkerAlt,
  faCalendarDay,
  faCog,
  faSignOut,
} from '@fortawesome/pro-solid-svg-icons';

import { openContactUsModal } from 'Components/modals/ContactUs/actions';
import NavItem from 'Components/NavBar/NavItem';
import Invite from 'Components/NavBar/Invite';
import BurgerMenu from 'Components/BurgerMenu';
import ZoolifeLogo from '../ZoolifeLogo';
import UserMenu from './Menu';
import Search from './Search';

import { useWindowResize, useIsMobileSize } from '../../hooks';
import { useLogout } from './hooks';
import { unsetUserData } from '../../redux/actions';

import style from './style.scss';

const cutOffWidth = 950;

const HeaderComponent = ({ unsetUserDataAction, openContactUsModalAction }) => {
  const { width } = useWindowResize();
  const isSmallScreen = useIsMobileSize();

  const logout = useLogout(unsetUserDataAction);

  return (
    <Header className={style.header} gap="none">
      <div className={style.logo}>
        <ZoolifeLogo />
        <Search className={style.desktopSearch} />
      </div>

      {width > cutOffWidth ? (
        <div>
          <div className={style.navBar}>
            <NavItem text="Map" url="/map" icon={faMapMarkerAlt} />
            <NavItem text="Talk Schedule" url="/schedule" icon={faCalendarDay} />
            <NavItem text="Favorites" url="/favorite" icon={faHeart} />
            <Invite />
          </div>
          <UserMenu />
        </div>
      ) : (
        <BurgerMenu>
          <NavItem clickable text={isSmallScreen ? 'Habitats' : 'Map'} url="/map" icon={faMapMarkerAlt} />
          <NavItem clickable text="Talk Schedule" url="/schedule" icon={faCalendarDay} />
          <NavItem clickable text="Favorites" url="/favorite" icon={faHeart} />
          <Invite />

          {/* separator */}
          <Box border={{ color: 'var(--mediumGrey)', position: 'bottom' }} margin={{ bottom: '5px' }} />

          <NavItem clickable text="My Account" url="/account" icon={faCog} />
          <NavItem clickable text="Help" onClick={openContactUsModalAction} icon={faCog} />
          <NavItem clickable text="Log Out" onClick={logout} icon={faSignOut} />
        </BurgerMenu>
      )}
    </Header>
  );
};

export default connect(
  null,
  {
    unsetUserDataAction: unsetUserData,
    openContactUsModalAction: openContactUsModal,
  },
)(HeaderComponent);

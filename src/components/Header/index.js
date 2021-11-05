import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';
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
const searchBarWidth = 414;

const HeaderComponent = ({ unsetUserDataAction, openContactUsModalAction }) => {
  const { width } = useWindowResize();
  const isSmallScreen = useIsMobileSize();
  const containableSearchBar = useMemo(() => width > searchBarWidth, [width]);
  const [searchShow, setSearchShow] = useState(containableSearchBar);

  const logout = useLogout(unsetUserDataAction);

  return (
    <Header className={style.header} gap="none">
      <div className={style.logo}>
        {(containableSearchBar || !searchShow) && <ZoolifeLogo />}
      </div>
      {width > cutOffWidth ? (
        <div>
          <Search className={style.searchContainer} />
          <div className={style.navBar}>
            <NavItem text="Map" url="/map" icon={faMapMarkerAlt} />
            <NavItem text="Talk Schedule" url="/schedule" icon={faCalendarDay} />
            <NavItem text="Favorites" url="/favorite" icon={faHeart} />
            <Invite />
          </div>
          <UserMenu />
        </div>
      ) : (
        <div>
          <Search
            className={style.searchContainer}
            switchableSearch={!containableSearchBar}
            searchShow={searchShow}
            setSearchShow={setSearchShow}
          />
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
        </div>
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

import { h } from 'preact';
import { Header } from 'grommet';

import ZoolifeLogo from 'Components/ZoolifeLogo';
import NavBar from 'Components/NavBar';
import Menu from './Menu';

import { getDeviceType } from '../../../helpers';

import style from './style.scss';

const HeaderComponent = () => (
  <Header className={style.header}>
    <div className={style.logo}>
      <ZoolifeLogo landing />
    </div>
    {getDeviceType() !== 'phone' && <NavBar landing />}
    {getDeviceType() === 'phone' && <Menu />}
  </Header>
);

export default HeaderComponent;

import { h } from 'preact';
import { Header } from 'grommet';

import ZoolifeLogo from 'Components/ZoolifeLogo';

import style from './style.scss';

const HeaderComponent = () => (
  <Header className={style.header}>
    <div className={style.logo}>
      <ZoolifeLogo />
    </div>
  </Header>
);

export default HeaderComponent;

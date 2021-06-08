import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { ResponsiveContext } from 'grommet';
import HabitatsUpdater from 'Components/HabitatsUpdater';

import MobileMap from './MobileMap';
import DesktopMap from './DesktopMap';

import style from './style.scss';

const Map = () => {
  const size = useContext(ResponsiveContext);
  const isSmallScreen = ['small', 'xsmall'].includes(size);
  return (
    <div className={style.background}>
      <HabitatsUpdater />
      {isSmallScreen && <MobileMap />}
      {!isSmallScreen && <DesktopMap />}
    </div>
  )
}

export default Map;

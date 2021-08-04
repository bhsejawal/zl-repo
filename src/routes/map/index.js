import { h } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import { connect } from 'react-redux';
import { ResponsiveContext } from 'grommet';

import HabitatsUpdater from 'Components/HabitatsUpdater';
import { buildURL, post } from 'Shared/fetch';
import { logGAEvent } from 'Shared/ga';

import MobileMap from './MobileMap';
import DesktopMap from './DesktopMap';

import { setUserData } from '../../redux/actions'
import { getDeviceType } from '../../helpers';

import style from './style.scss';

const Map = ({ enteredMap, setUserDataAction }) => {
  const size = useContext(ResponsiveContext);
  const isSmallScreen = ['small', 'xsmall'].includes(size);

  useEffect(() => {
    if (!enteredMap) {
      post(buildURL('/users/enteredMap'))
        .then(({ user }) => {
          logGAEvent(
            'onboarding',
            'user-entered-map',
            getDeviceType(),
          );
          setUserDataAction(user);
        })
        .catch((error) => console.error('Failed to update user entered map flag', error));
    }
  }, []);

  return (
    <div className={style.background}>
      <HabitatsUpdater />
      {isSmallScreen && <MobileMap />}
      {!isSmallScreen && <DesktopMap />}
    </div>
  )
}

export default connect(
  ({ user: { enteredMap }}) => ({ enteredMap }),
  {
    setUserDataAction: setUserData,
  },
)(Map);

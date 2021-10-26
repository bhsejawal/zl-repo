import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { ResponsiveContext } from 'grommet';
import { route } from 'preact-router';
import { lazy, Suspense } from 'preact/compat';

import HabitatsUpdater from 'Components/HabitatsUpdater';

import { buildURL, post } from 'Shared/fetch';
import { logGAEvent } from 'Shared/ga';

import MobileMap from './MobileMap';
import DesktopMap from './DesktopMap';

import { setUserData } from '../../redux/actions'
import { getDeviceType } from '../../helpers';

import style from './style.scss';

const ShareModal = lazy(() => import('Components/ShareModal/Standalone'));

const trailerInitialState = { show: false, data: null };

const Map = ({
  enteredMap,
  productId,
  isFreemiumOnboarded,
  setUserDataAction,
}) => {
  const size = useContext(ResponsiveContext);
  const isSmallScreen = ['small', 'xsmall'].includes(size);
  const [trailer, setTrailer] = useState(trailerInitialState)

  useEffect(() => {
    if (!enteredMap && isFreemiumOnboarded) {
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
  }, [enteredMap, setUserDataAction, isFreemiumOnboarded]);

  useEffect(() => {
    if (productId === 'FREEMIUM' && !isFreemiumOnboarded) {
      route(`/freemiumOnboarding`, true);
    }
  }, []);

  const onShowTrailer = (data) => setTrailer({ show: true, data });

  return (
    <div className={style.background}>
      <HabitatsUpdater />
      {isSmallScreen && <MobileMap onShowTrailer={onShowTrailer} />}
      {!isSmallScreen && <DesktopMap onShowTrailer={onShowTrailer} />}
      {trailer.show && typeof window !== 'undefined' && (
        <Suspense>
          <ShareModal
            open={trailer.show}
            data={trailer.data}
            onClose={() => setTrailer(trailerInitialState)}
            mediaId={trailer.data._id}
            isDownloadAllowed={false}
            shouldLoadPubnub
          />
        </Suspense>
      )}
    </div>
  )
}

export default connect((
  { user: { enteredMap, isFreemiumOnboarded, subscription: { productId } } },
) => (
  { enteredMap, productId, isFreemiumOnboarded }
), {
  setUserDataAction: setUserData,
})(Map);

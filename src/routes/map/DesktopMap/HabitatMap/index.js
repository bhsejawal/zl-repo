/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { h } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Box, Heading } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLockAlt } from '@fortawesome/pro-solid-svg-icons';

import Can from 'Components/Authorize'
import { selectHabitat, toggleMapModal } from '../../actions';
import PinIcon from './PinIcon';
import style from './style.scss';
import { isHabitatUnlocked } from '../../../../helpers';

const HabitatMap = ({
  subscription,
  habitats,
  selectHabitatAction,
  activeHabitatId,
}) => {
  const [coordinates, setCoordinates] = useState(null);
  const mapRef = useRef(null);

  if (!subscription) {
    return null;
  }

  const habitatClickHandler = (evt, _id) => {
    evt.stopPropagation();
    selectHabitatAction(_id);
  }

  const mapClickHandler = (evt) => {
    const { offsetX, offsetY } = evt;
    const { width, height } = mapRef.current.getBoundingClientRect();

    const x = parseInt((offsetX / width) * 100, 10);
    const y = parseInt((offsetY / height) * 100, 10);
    setCoordinates({ x, y });
  }

  return (
    <Box direction="column" fill justify="center" align="center">
      {/* eslint-disable-next-line  */}
      <div className={style.map} onClick={mapClickHandler} ref={mapRef}>
        <div className={style.wrapper}>
          {habitats.filter(({ hidden, mapPosition }) => !hidden && mapPosition).map(({
            _id,
            online,
            liveTalk,
            profileImage,
            mapPosition: { top, left },
          }) => (
            <div
              key={_id}
              id={_id}
              style={{ top: `${top}%`, left: `${left}%` }}
              className={classnames(style.habitat, {
                [style.liveTalk]: liveTalk,
                [style.offline]: !online,
              })}
              onClick={(evt) => habitatClickHandler(evt, _id)}
            >
              <div className={classnames(
                style.pinWrapper,
                {[style.selected]: _id === activeHabitatId },
              )}>
                {subscription.productId === 'FREEMIUM' && subscription.freeHabitat === _id && (
                  <div className={style.freeLabel}>
                    FREE
                  </div>
                )}
                <div className={classnames(
                  style.pin,
                  {
                    [style.offline]: !online,
                    [style.freemiumPin]: subscription.productId === 'FREEMIUM' && subscription.freeHabitat === _id,
                  },
                )}>
                  <PinIcon />
                </div>
                <img src={profileImage} alt="Habitat" className={style.profile} />
                {!isHabitatUnlocked(subscription, _id) && (
                  <div className={style.lock}>
                    <FontAwesomeIcon icon={faLockAlt} />
                  </div>
                )}
              </div>
            </div>
          ))}

          <img src="https://assets.zoolife.tv/zoolifeMap.png" alt="" />
        </div>
      </div>
      <Can
        perform="maps:edit"
        yes={() => (
          <Box margin={{ top: '20px' }} alignSelf="end" pad={{ right: '25px', bottom: '4px'}}>
            {!coordinates && (
              <Heading level="4" color="var(--blueDark)" textAlign="end" margin={{ bottom: '0px'}}>Click on map to show location percentages</Heading>
            )}
            {coordinates && (
              <Heading level="4" color="var(--blueDark)" margin={{ bottom: '0px'}}>
                {`X: ${coordinates.x}%, Y: ${coordinates.y}%`}
              </Heading>
            )}
          </Box>
        )} />
    </Box>
  )
};

export default connect(
  (
    {
      allHabitats: habitats,
      map: { activeHabitatId },
      user: { subscription } = {},
    },
  ) => (
    { habitats, activeHabitatId, subscription }
  ),
  {
    selectHabitatAction: selectHabitat,
    toggleMapModalAction: toggleMapModal,
  },
)(HabitatMap);

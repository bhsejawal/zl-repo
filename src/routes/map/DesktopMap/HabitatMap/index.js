/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { h } from 'preact';
import { useRef, useState, useMemo } from 'preact/hooks';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Box, Heading } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLockAlt } from '@fortawesome/pro-solid-svg-icons';

import Can from 'Components/Authorize'
import EditButton from 'Components/AdminEditWrappers/EditButton';
import HabitatCard from 'Components/HabitatCard';
import CloseButton from 'Components/modals/CloseButton';
import { selectHabitat, toggleMapModal, setEditHabitat } from '../../actions';
import PinIcon from './PinIcon';
import style from './style.scss';
import { isHabitatUnlocked } from '../../../../helpers';

const HabitatMap = ({
  subscription,
  habitats,
  selectHabitatAction,
  activeHabitatId,
  onShowTrailer,
  setEditHabitatAction,
  toggleMapModalAction,
}) => {
  const [coordinates, setCoordinates] = useState(null);
  const mapRef = useRef(null);
  const activeHabitat = useMemo(
    () => habitats.find(({ _id }) => _id === activeHabitatId),
    [habitats, activeHabitatId],
  );

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

  const handleEditButton = () => {
    setEditHabitatAction(activeHabitat);
    toggleMapModalAction();
  };

  const onClose = () => {
    selectHabitatAction(null);
  }

  const cardWidth = 310;
  const cardHeight = 340;
  const headerHeight = 45;
  let transformX = -50;
  let transformY = -50;
  if (mapRef.current && activeHabitat) {
    const boundingRect = mapRef.current.getBoundingClientRect();
    const leftTransition = (boundingRect.width * activeHabitat.mapPosition.left) / 100;
    const topTransition = (boundingRect.height * activeHabitat.mapPosition.top) / 100;
    if ( leftTransition < cardWidth * 0.5) {
      transformX = 0;
    // eslint-disable-next-line max-len
    } else if ((boundingRect.width * activeHabitat.mapPosition.left) / 100 + cardWidth * 0.5 > boundingRect.width) {
      transformX = -100;
    }

    if ( boundingRect.y - headerHeight + topTransition < cardHeight * 0.5) {
      transformY = 0;
    } else if ( topTransition + cardHeight * 0.5 > boundingRect.height) {
      transformY = -100;
    }
  }

  return (
    <Box direction="column" fill justify="center" align="center">
      {/* eslint-disable-next-line  */}
      <div className={style.map} onClick={mapClickHandler} ref={mapRef}>
        <div className={style.wrapper}>
          {activeHabitat && (
            <div
              className={classnames(style.description, style.habitatSelected)}
              style={{
                position: 'absolute',
                zIndex: 1,
                top: `${activeHabitat.mapPosition.top}%`,
                left: `${activeHabitat.mapPosition.left}%`,
                transform: `translate(calc(${transformX}% + 24px), calc(${transformY}% - 21px))`,
              }}>
              <div>
                <Can
                  perform="maps:edit"
                  yes={() => <EditButton onClick={handleEditButton} />}
                />
                <CloseButton varient="grey" onClick={onClose} className={style.closeBtn} />
                <HabitatCard
                  className={style.card}
                  slug={activeHabitat.slug}
                  zooSlug={activeHabitat.zoo?.slug}
                  online={activeHabitat.online}
                  liveTalk={activeHabitat.liveTalk}
                  title={activeHabitat.title}
                  description={activeHabitat.description}
                  image={activeHabitat.wideImage}
                  logo={activeHabitat.zoo?.logo}
                  habitatId={activeHabitat._id}
                  trailer={activeHabitat.trailer}
                  onShowTrailer={onShowTrailer}
                />
              </div>
            </div>
          )}
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

          <img src="https://assets.zoolife.tv/zoolifeMap2.png" alt="" />
        </div>
      </div>
      <Can
        perform="maps:edit"
        yes={() => (
          <Box margin={{ top: '20px' }} alignSelf="end" pad={{ right: '25px', bottom: '4px'}}>
            {!coordinates && (
              <Heading level="4" color="var(--blueDark)" textAlign="end" margin={{ vertical: '0px'}}>Click on map to show location percentages</Heading>
            )}
            {coordinates && (
              <Heading level="4" color="var(--blueDark)" margin={{ vertical: '0px'}}>
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
    setEditHabitatAction: setEditHabitat,
    toggleMapModalAction: toggleMapModal,
  },
)(HabitatMap);

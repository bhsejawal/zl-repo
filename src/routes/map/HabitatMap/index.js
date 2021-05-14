/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { h } from 'preact';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Box, Heading } from 'grommet';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';
import Can from 'Components/Authorize'
import { selectHabitat, toggleMapModal } from '../actions';
import { setHabitats } from '../../../redux/actions';

import style from './style.scss';

const HabitatMap = ({ allHabitats, selectHabitatAction, setHabitatsAction }) => {
  const [coordinates, setCoordinates] = useState(null);
  const mapRef = useRef(null);
  const [refreshed, setRefreshed] = useState();
  const habitats = useMemo(
    () => (refreshed ? allHabitats : []),
    [allHabitats, refreshed],
  );

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

  const { get, response } = useFetch(buildURL('/habitats/map'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  useEffect(() => {
    const fetchData = async () => {
      await get();
      if (response.ok) {
        setHabitatsAction(response.data.habitats);
        setRefreshed(true);
      }
    }

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <img src={profileImage} alt="" />
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
  ({ allHabitats }) => ({ allHabitats }),
  {
    selectHabitatAction: selectHabitat,
    toggleMapModalAction: toggleMapModal,
    setHabitatsAction: setHabitats,
  },
)(HabitatMap);

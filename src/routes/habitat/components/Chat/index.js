import { h } from 'preact';
import { route } from 'preact-router';
import { lazy, Suspense, useMemo } from 'preact/compat';
import { faLongArrowAltRight } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'grommet';
import { connect } from 'react-redux';
import useFetch from 'use-http';

import ScheduleCarousel from 'Components/ScheduleCarousel';
import { buildURL } from 'Shared/fetch';

import style from './style.scss';

const ChatComponent = lazy(() => {
  if (typeof window !== 'undefined') {
    return import('Components/Chat')
  }

  return null;
});

const upcomingParams = new URLSearchParams({ limit: 20, eventType: 'live' });

const getLiveEventIds = (events) => {
  const ids = events
    .filter(({ camera }) => camera?.cameraStatus === 'on')
    .map(({ habitat: { _id } }) => _id);
  return Array.from(new Set(ids));
};

const Chat = ({ height, width, habitatId }) => {
  const { data: upcomming } = useFetch(
    buildURL(`/schedules/upcoming?${upcomingParams}`),
    { credentials: 'include', cachePolicy: 'no-cache' },
    [],
  );

  const isNextBtnDisabled = useMemo(() => {
    if (upcomming?.events) {
      const uniqueIds = getLiveEventIds(upcomming.events);
      return uniqueIds.length === 0
        || (uniqueIds.length === 1 && habitatId === uniqueIds[0]);
    }
    return true;
  }, [habitatId, upcomming?.events]);

  const onNextClick = () => {
    const sessionStorageKey = 'last-next-habitat';
    const { events } = upcomming;
    let lastHabitatId;
    try {
      lastHabitatId = sessionStorage.getItem(sessionStorageKey)
    } catch (err) {
      lastHabitatId = habitatId;
    }
    const uniqueIds = getLiveEventIds(events);
    const ind = uniqueIds.includes(lastHabitatId)
      ? uniqueIds.indexOf(lastHabitatId)
      : uniqueIds.indexOf(habitatId);
    // in case lastHabitatId is undefined/null, ind will be -1 which will work nicely
    const nextId = uniqueIds[(ind + 1) % uniqueIds.length];
    const { habitat } = events.find(({ habitat: { _id } }) => _id === nextId);

    sessionStorage.setItem(sessionStorageKey, habitat._id);
    route(`/h/${habitat.zoo.slug}/${habitat.slug}`);
  };

  return (
    <div
      className={style.chat}
      style={{
        height,
        maxHeight: height,
        width,
      }}
    >
      <div className={style.chatNavigator}>
        <span>Up Next</span>
        <Button plain disabled={isNextBtnDisabled} className={style.nextBtn} onClick={onNextClick}>
          <span>Next Habitat&nbsp;</span>
          <FontAwesomeIcon icon={faLongArrowAltRight} />
        </Button>
      </div>
      <ScheduleCarousel />
      <Suspense>
        <ChatComponent />
      </Suspense>
    </div>
  );
};

export default connect(
  ({ habitat: { habitatInfo: { _id: habitatId } } }) => ({ habitatId }),
)(Chat);

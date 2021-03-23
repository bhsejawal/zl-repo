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

const Chat = ({ height, width, habitatId }) => {
  const { data: upcomming } = useFetch(
    buildURL('/schedules/upcoming?limit=20'),
    { credentials: 'include', cachePolicy: 'no-cache' },
    [],
  );

  const isNextBtnDisabled = useMemo(() => {
    if (upcomming?.events) {
      const ids = upcomming.events.map(({ habitat: { _id } }) => _id);
      const uniqueIds = Array.from(new Set(ids));
      return uniqueIds.length === 0
        || (uniqueIds.length === 1 && habitatId === uniqueIds[0]);
    }
    return false;
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
    const ids = events.map(({ habitat: { _id } }) => _id);
    const uniqueIds = Array.from(new Set(ids))
      .filter((id) => id !== habitatId);
    const ind = uniqueIds.indexOf(lastHabitatId);
    // in case lastHabitatId is undefined/null, ind will be -1 which will work nicely
    const nextId = uniqueIds[(ind + 1) % uniqueIds.length];
    const { habitat } = events.find(({ habitat: { _id } }) => _id === nextId);
    // eslint-disable-next-line no-underscore-dangle
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

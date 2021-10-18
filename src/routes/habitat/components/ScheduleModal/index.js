import { connect } from 'react-redux';
import { Layer, Box } from 'grommet';
import useFetch from 'use-http';
import classnames from 'classnames';
import { endOfDay, startOfDay } from 'date-fns';
import { buildURL } from 'Shared/fetch';
import { useCallback, useEffect, useState } from 'preact/hooks';

import CloseButton from 'Components/modals/CloseButton';
import Loader from 'Components/Loader';

import TalkSchedule from 'Components/ScheduleEvents/LiveTalk';
import Upcoming from './Upcoming';
import { closeScheduleModal } from './actions';

import style from './style.scss';

const Modal = ({
  onClose,
  habitatSlug,
  startTime,
}) => {
  const [schedule, setSchedule] = useState();
  const { get, loading } = useFetch(buildURL('/livetalks/schedule'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  const getSchedule = useCallback(async () => {
    const params = new URLSearchParams();
    params.append('startTime', startOfDay(startTime).getTime());
    params.append('endTime', endOfDay(startTime).getTime());
    const schedulesData = await get(params);
    setSchedule(schedulesData.find(({ habitatSlug: slug }) => habitatSlug === slug));
  }, [startTime, get, habitatSlug]);

  useEffect(() => {
    getSchedule();
  }, [getSchedule]);

  return (
    <Layer onEsc={onClose} onClickOutside={onClose} background="transparent">
      <Box className={style.modalContainer}>
        <div className={classnames(style.modalWrapper, 'customScrollBar grey')}>
          <CloseButton varient="plain" onClick={onClose} className={style.close} />
          {loading && <Loader />}
          {schedule && (
            <TalkSchedule
              key={schedule._id}
              id={schedule._id}
              animal={schedule.animal}
              zoo={schedule.zoo}
              zooLogo={schedule.zooLogo}
              habitatImage={schedule.habitatImage}
              title={schedule.title}
              startTime={schedule.startTime}
              stopTime={schedule.stopTime}
              description={schedule.description}
              habitatSlug={schedule.habitatSlug}
              zooSlug={schedule.zooSlug}
              wideImage={schedule.wideImage}
              isStreamOn={schedule.isStreamOn}
              isHostStreamOn={schedule.isHostStreamOn}
              habitatId={schedule.habitatId}
              habitatDescription={schedule.habitatDescription}
              businessHourId={schedule.businessHourId}
              editDisabled
            />
          )}
          <Upcoming />
        </div>
      </Box>
    </Layer>
  );
}

const ScheduleModal = ({
  show,
  habitatSlug,
  startTime,
  closeScheduleModalAction,
}) => {
  if (!show) {
    return null;
  }

  return (
    <Modal
      onClose={closeScheduleModalAction}
      habitatSlug={habitatSlug}
      startTime={startTime}
    />
  )
};

export default connect(
  ({
    habitat: {
      scheduleModal: { show, startTime },
      habitatInfo: { slug: habitatSlug },
    },
  }) => ({
    show,
    habitatSlug,
    startTime,
  }),
  { closeScheduleModalAction: closeScheduleModal },
)(ScheduleModal);

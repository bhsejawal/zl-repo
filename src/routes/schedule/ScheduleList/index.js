import { useEffect, useState, useCallback } from 'preact/hooks';
import {
  endOfDay,
  isSameDay,
  startOfDay,
} from 'date-fns';
import { connect } from 'react-redux';
import { Box } from 'grommet';
import useFetch from 'use-http'

import Loader from 'Components/Loader';
import NoContentFallback from 'Components/NoContentFallback';
import { buildURL } from 'Shared/fetch';

import TalkSchedule from 'Components/ScheduleEvents/LiveTalk';
import EditEventModal from 'Components/ScheduleEvents/EventScheduleModals/EditEvent';
import DeleteEventModal from 'Components/ScheduleEvents/EventScheduleModals/DeleteEvent';

const ScheduleList = ({
  animals,
  zoos,
  date,
}) => {
  const {
    get,
    response,
    loading,
  } = useFetch(buildURL('/livetalks/schedule'), { credentials: 'include', cachePolicy: 'no-cache' });

  const [schedules, setSchedules] = useState([]);

  const getSchedule = useCallback(async (date, animals, zoos) => {
    const params = new URLSearchParams();

    if (animals.length) {
      animals.forEach((animal) => params.append('animals[]', animal));
    }

    if (zoos.length) {
      zoos.forEach((zoo) => params.append('zoos[]', zoo));
    }

    const now = new Date();
    if (isSameDay(now, date)) {
      params.append('startTime', now.getTime());
    } else {
      params.append('startTime', startOfDay(date).getTime());
    }

    params.append('endTime', endOfDay(date).getTime());

    const schedulesData = await get(params);
    setSchedules(schedulesData);
  }, [setSchedules, get]);

  useEffect(() => {
    getSchedule(date, animals, zoos);
  }, [animals, zoos, date, getSchedule])

  if (loading) {
    return (
      <Loader color="white" fill />
    )
  }

  if (response.status === 200 && !loading && !schedules.length) {
    return (
      <Box flex="grow" justify="center">
        <NoContentFallback
          text="Sorry! There aren’t any talks available."
          subText="Please try broadening your search."
        />
      </Box>
    )
  }

  return (
    <>
      {schedules.map((schedule, index) => (
        <Box align="center" pad={{ bottom: index !== (schedules.length - 1) ? '35px' : undefined }} height={{ min: 'max-content' }}>
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
          />
        </Box>
      ))}

      <EditEventModal onUpdate={() => getSchedule(date, animals, zoos)} />
      <DeleteEventModal onUpdate={() => getSchedule(date, animals, zoos)} />
    </>
  )
};

export default connect((
  { schedule: { filters: { animals, zoos, date }}},
) => (
  { animals, zoos, date}
))(ScheduleList);

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
import LoaderModal from 'Components/LoaderModal';
import NoContentFallback from 'Components/NoContentFallback';
import Dialog from 'Components/modals/Dialog';
import ErrorModal from 'Components/modals/Error';
import SuccessModal from 'Components/modals/Success';
import { buildURL } from 'Shared/fetch';

import ScheduleItem from './ScheduleItem';

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

  const {
    post,
    response: reminderResponse,
    loading: sendingReminder,
  } = useFetch(buildURL(), { credentials: 'include', cachePolicy: 'no-cache' });

  const [schedules, setSchedules] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleScheduleClick = (scheduleId) => {
    setSelectedSchedule(scheduleId);
    setShowDialog(true);
  }

  const sendInvitationHandler = async () => {
    setShowDialog(false)
    await post('/schedules/reminder', {scheduleId: selectedSchedule });
    if (reminderResponse.ok) {
      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true)
    }
  }

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
      {schedules.map(({
        animal,
        liveTalks,
        zoo,
        habitatId,
        logo,
        profileInfo,
        description,
        habitatSlug,
        zooSlug,
      }) => (
        <ScheduleItem
          liveTalks={liveTalks}
          animal={animal}
          zoo={zoo}
          key={habitatId}
          zooLogo={logo}
          habitatImage={profileInfo}
          description={description}
          onClick={handleScheduleClick}
          habitatSlug={habitatSlug}
          zooSlug={zooSlug}
        />
      ))}
      {showDialog && (
        <Dialog
          title="Send reminder?"
          text="We'll send a calendar invite to your email."
          buttonLabel="Remind me"
          onConfirm={sendInvitationHandler}
          onCancel={() => setShowDialog(false)}
        />
      )}
      {sendingReminder && (<LoaderModal />)}
      {showErrorModal && (
        <ErrorModal
          text="Something went wrong. Please try again"
          onClose={() => setShowErrorModal(false)}
        />
      )}
      {showSuccessModal && (
        <SuccessModal
          text="Invitation sent! Please check your inbox."
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </>
  )
};

export default connect((
  { schedule: { filters: { animals, zoos, date }}},
) => (
  { animals, zoos, date}
))(ScheduleList);

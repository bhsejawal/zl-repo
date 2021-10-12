import { useEffect, useState, useCallback } from 'preact/hooks';
import { endOfDay, startOfDay } from 'date-fns';
import { connect } from 'react-redux';
import useFetch from 'use-http'

import Loader from 'Components/Loader';
import LoaderModal from 'Components/LoaderModal';
import Dialog from 'Components/modals/Dialog';
import ErrorModal from 'Components/modals/Error';
import SuccessModal from 'Components/modals/Success';
import { buildURL } from 'Shared/fetch';
import style from './style.scss';

import ScheduleItem from '../../../../../schedule/ScheduleList/ScheduleItem';
import Accordion from "../../../../../account/Accordion";

const LiveTalks = ({
  animal,
  zoo,
  date,
  accordion,
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

  const getSchedule = useCallback(async () => {
    const params = new URLSearchParams();
    params.append('animals[]', animal);
    params.append('zoos[]', zoo);
    params.append('startTime', startOfDay(date).getTime());
    params.append('endTime', endOfDay(date).getTime());

    const schedulesData = await get(params);
    setSchedules(schedulesData);
  }, [animal, zoo, date, get]);

  useEffect(() => {
    getSchedule();
  }, [date, getSchedule]);

  if (loading) {
    return (
      <Loader color="white" fill />
    )
  }

  if (response.status === 200 && !loading && !schedules.length) {
    return null;
  }

  const content = (
    <div className={style.liveTalks}>
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
        wideImage,
        isHostStreamOn,
        isStreamOn,
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
          wideImage={wideImage}
          online={isStreamOn}
          liveTalk={isHostStreamOn}
          habitatId={habitatId}
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
    </div>
  );

  if (accordion) {
    return (
      <Accordion
        className={style.accordion}
        header={<h4>Habitat Events:</h4>}
        expanded
      >
        {content}
      </Accordion>
    );
  }

  return content;
};

export default connect((
  { habitat: { habitatInfo: { animal, zoo: { name } }}},
) => (
  { animal, zoo: name }
))(LiveTalks);

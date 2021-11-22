import { useEffect, useState } from 'preact/hooks';
import { endOfDay, startOfDay } from 'date-fns';
import { connect } from 'react-redux';
import { isArray } from 'lodash-es';
import useFetch from 'use-http'

import Loader from 'Components/Loader';
import LoaderModal from 'Components/LoaderModal';
import Dialog from 'Components/modals/Dialog';
import ErrorModal from 'Components/modals/Error';
import SuccessModal from 'Components/modals/Success';
import TalkSchedule from 'Components/ScheduleEvents/LiveTalk';
import { API_BASE_URL } from 'Shared/fetch';

import Accordion from '../../../../account/Accordion';
import { setLiveTalks } from '../actions';
import style from './style.scss';

const LiveTalks = ({
  animal,
  zoo,
  date,
  accordion,
  liveTalks,
  setLiveTalksAction,
}) => {
  const {
    get,
    loading,
    error,
  } = useFetch(API_BASE_URL, { credentials: 'include', cachePolicy: 'no-cache' });

  const {
    post,
    response: reminderResponse,
    loading: sendingReminder,
  } = useFetch(API_BASE_URL, { credentials: 'include', cachePolicy: 'no-cache' });

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

  useEffect(() => {
    const getSchedules = async () => {
      const params = new URLSearchParams();
      params.append('animals[]', animal);
      params.append('zoos[]', zoo);
      params.append('startTime', startOfDay(date).getTime());
      params.append('endTime', endOfDay(date).getTime());

      const schedulesData = await get(`/livetalks/schedule?${params}`);

      if (isArray(schedulesData)) {
        setLiveTalksAction(schedulesData);
      }
    };

    getSchedules();
  }, [animal, date, get, setLiveTalksAction, zoo]);

  if (loading) {
    return (
      <Loader color="white" fill />
    )
  }

  if (error) {
    console.error('Error fetching live talks', error);
    return null;
  }

  if (!liveTalks.length) {
    return null;
  }

  const content = (
    <div className={style.liveTalks}>
      {liveTalks.map((schedule) => (
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
          onClick={handleScheduleClick}
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

export default connect(
  ({
    habitat: {
      habitatInfo: { title, zoo: { name } },
      schedulesTab: { liveTalks },
    },
  }) => ({ animal: title, zoo: name, liveTalks }),
  { setLiveTalksAction: setLiveTalks },
)(LiveTalks);

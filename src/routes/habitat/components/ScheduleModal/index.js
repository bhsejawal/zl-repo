import { connect } from 'react-redux';
import { Layer, Box } from 'grommet';
import useFetch from 'use-http';
import classnames from 'classnames';
import { endOfDay, startOfDay } from 'date-fns';
import { buildURL } from 'Shared/fetch';
import { useCallback, useEffect, useState } from 'preact/hooks';

import CloseButton from 'Components/modals/CloseButton';
import Dialog from 'Components/modals/Dialog';
import LoaderModal from 'Components/LoaderModal';
import ErrorModal from 'Components/modals/Error';
import SuccessModal from 'Components/modals/Success';
import Loader from 'Components/Loader';

import ScheduleItem from '../../../schedule/ScheduleList/ScheduleItem';
import Upcoming from './Upcoming';
import { closeScheduleModal } from './actions';

import style from './style.scss';

const Modal = ({
  onClose,
  habitatSlug,
  startTime,
}) => {
  const [schedule, setSchedule] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const { get, loading } = useFetch(buildURL('/livetalks/schedule'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });
  const {
    post,
    response: reminderResponse,
    loading: sendingReminder,
  } = useFetch(buildURL(), { credentials: 'include', cachePolicy: 'no-cache' });

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

  const handleScheduleClick = (scheduleId) => {
    setSelectedSchedule(scheduleId);
    setShowDialog(true);
  }

  const sendInvitationHandler = async () => {
    setShowDialog(false)
    await post('/schedules/reminder', { scheduleId: selectedSchedule });
    if (reminderResponse.ok) {
      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true)
    }
  }

  return (
    <Layer onEsc={onClose} onClickOutside={onClose} background="transparent">
      <Box className={style.modalContainer}>
        <div className={classnames(style.modalWrapper, 'customScrollBar grey')}>
          <CloseButton varient="plain" onClick={onClose} className={style.close} />
          {loading && <Loader />}
          {schedule && (
            <ScheduleItem
              liveTalks={schedule.liveTalks}
              animal={schedule.animal}
              zoo={schedule.zoo}
              key={schedule.habitatId}
              zooLogo={schedule.logo}
              habitatImage={schedule.profileInfo}
              description={schedule.description}
              onClick={handleScheduleClick}
              habitatSlug={schedule.habitatSlug}
              zooSlug={schedule.zooSlug}
              wideImage={schedule.wideImage}
              online={schedule.isStreamOn}
              liveTalk={schedule.isHostStreamOn}
            />
          )}
          <Upcoming />
        </div>
      </Box>
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

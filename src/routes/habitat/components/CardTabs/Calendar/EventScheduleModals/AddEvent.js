import { connect } from 'react-redux';
import {
  Box,
  Button,
  Heading,
  Layer,
} from 'grommet';
import { useFetch } from 'use-http';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import { API_BASE_URL } from 'Shared/fetch';
import StatusContent from 'Components/modals/StatusContent';
import { showAddEventModal, updateCalendar } from './actions';
import Form from './Form';

import style from './style.scss';

const AddEvent = ({
  isOpen,
  cameraId,
  updateCalendarAction,
  showAddEventModalAction,
}) => {
  const {
    post,
    error,
    response,
  } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  const closeHandler = () => {
    showAddEventModalAction(false);
  };

  const addEvent = async (formData) => {
    await post(`/admin/cameras/${cameraId}/schedule-rules`, formData);

    if (response.ok) {
      updateCalendarAction();
      closeHandler();
    } else {
      throw new Error(response.data?.error || 'Something went wrong. Please try again.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Layer
      position="center"
      onClickOutside={closeHandler}
      onEsc={closeHandler}
    >
      {!cameraId && (
        <StatusContent
          type="error"
          text="This habitat doesn't have a camera associated with. Please contact your administrator."
          onClose={closeHandler}
        />
      )}

      {cameraId && (
        <div className={style.scheduleEventModal}>
          <Box direction="row" justify="between">
            <Heading level="2" margin={{ left: '40px'}}>
              Add Event
            </Heading>
            <Button
              plain
              margin="medium"
              onClick={closeHandler}
              icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
            />
          </Box>

          <Form onSubmit={addEvent} error={error && response?.data?.error} />
        </div>
      )}
    </Layer>
  )
};

export default connect(
  ({
    habitat: {
      calendarEvents: { showAddEventModal: isOpen },
      habitatInfo: { camera },
    },
  }) => ({
    isOpen,
    // eslint-disable-next-line no-underscore-dangle
    cameraId: camera?._id,
  }),
  {
    showAddEventModalAction: showAddEventModal,
    updateCalendarAction: updateCalendar,
  },
)(AddEvent);

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
import { showAddEventModal, updateCalendar } from './actions';
import Form from './Form';

import style from './style.scss';

const AddEvent = ({
  isOpen,
  habitatId,
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
    await post(`/admin/habitats/${habitatId}/schedule-rules`, formData);

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
    </Layer>
  )
};

export default connect(
  ({
    habitat: {
      calendarEvents: { showAddEventModal: isOpen },
      habitatInfo: { _id: habitatId },
    },
  }) => ({
    isOpen,
    habitatId,
  }),
  {
    showAddEventModalAction: showAddEventModal,
    updateCalendarAction: updateCalendar,
  },
)(AddEvent);

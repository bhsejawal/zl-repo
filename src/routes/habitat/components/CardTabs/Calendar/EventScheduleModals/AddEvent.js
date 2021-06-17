import { connect } from 'react-redux';
import { Layer } from 'grommet';
import { useFetch } from 'use-http';

import { API_BASE_URL } from 'Shared/fetch';
import Header from 'Components/modals/Header';
import Body from 'Components/modals/Body';

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

        <Header onClose={closeHandler}>
          Add Event
        </Header>

        <Body>
          <Form onSubmit={addEvent} error={error && response?.data?.error} />
        </Body>
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

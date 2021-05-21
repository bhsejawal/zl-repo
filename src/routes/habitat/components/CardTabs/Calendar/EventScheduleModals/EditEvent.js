import { connect } from 'react-redux';
import { useCallback, useEffect } from 'preact/hooks';
import { useFetch } from 'use-http';
import {
  Box,
  Button,
  Heading,
  Layer,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import { API_BASE_URL } from 'Shared/fetch';
import { defaultErrorMsg } from 'Components/modals/Error';
import Loader from 'Components/async/Loader';
import StatusContent from 'Components/modals/StatusContent';
import Form from './Form';

import { showEditEventModal, updateCalendar } from './actions';
import { useIsInitiallyLoaded } from '../../../../../../hooks';

import style from './style.scss';

const EditEvent = ({
  scheduleRuleId,
  scheduleId,
  habitatId,
  isOpen,
  eventDate,
  showEditEventModalAction,
  updateCalendarAction,
}) => {
  const {
    get,
    error,
    loading,
    response,
  } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  const { patch, response: patchResponse } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  const loaded = useIsInitiallyLoaded(loading);

  const load = useCallback(() => {
    get(`/admin/habitats/${habitatId}/schedule-rules/${scheduleRuleId}`);
  }, [habitatId, get, scheduleRuleId]);

  useEffect(() => {
    if (habitatId && scheduleRuleId) {
      load()
    }
  }, [habitatId, load, scheduleRuleId]);

  const closeHandler = () => {
    showEditEventModalAction(false, {});
  }

  const editEvent = async (formData) => {
    if (formData.singleEvent) {
      const data = { ...formData, date: eventDate };
      await patch(`/admin/habitats/${habitatId}/schedule-rules/${scheduleRuleId}/schedules/${scheduleId}`, data);
    } else {
      await patch(`/admin/habitats/${habitatId}/schedule-rules/${scheduleRuleId}`, formData);
    }

    if (patchResponse.ok) {
      updateCalendarAction();
      closeHandler();
    } else {
      throw new Error(patchResponse.data?.error || 'Something went wrong. Please try again.');
    }
  };

  if (!isOpen || !scheduleRuleId) {
    return null
  }

  return (
    <Layer
      position="center"
      onClickOutside={closeHandler}
      onEsc={closeHandler}
    >
      {error && (
        <StatusContent
          type="error"
          text={defaultErrorMsg}
          onClose={closeHandler}
        />
      )}

      {!error && (
        <div className={style.scheduleEventModal}>
          <Box direction="row" justify="between">
            <Heading level="2" margin={{ left: '40px'}}>
              Edit Event
            </Heading>
            <Button
              plain
              margin="medium"
              onClick={closeHandler}
              icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
            />
          </Box>

          {!loaded && (
            <Box pad={{ horizontal: 'large', bottom: 'large' }}>
              <Loader />
            </Box>
          )}

          {loaded && !error && (
            <Form onSubmit={editEvent} scheduleData={response.data} />
          )}
        </div>
      )}
    </Layer>
  )
};

export default connect(
  ({
    habitat: {
      habitatInfo: { _id: habitatId },
      calendarEvents: {
        showEditEventModal: isOpen,
        event: {
          _id: scheduleId,
          businessHourId: scheduleRuleId,
          start: eventDate,
        },
      },
    },
  }) => ({
    scheduleRuleId,
    scheduleId,
    isOpen,
    eventDate,
    habitatId,
  }),
  {
    showEditEventModalAction: showEditEventModal,
    updateCalendarAction: updateCalendar,
  },
)(EditEvent);

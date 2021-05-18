import classnames from 'classnames';
import { useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { API_BASE_URL } from 'Shared/fetch';
import { useFetch } from 'use-http';
import {
  Box,
  Button,
  Heading,
  Layer,
  RadioButton,
  Text,
} from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import { PrimaryButton } from 'Components/Buttons';
import { setDeleteMultiple, showDeleteEventModal, updateCalendar } from './actions';

import style from './style.scss';

const DeleteEvent = ({
  isOpen,
  multiple,
  freqHidden,
  habitatId,
  description,
  scheduleId,
  scheduleRuleId,
  showDeleteEventModalAction,
  updateCalendarAction,
  setMultipleAction,
}) => {
  const [error, setError] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const {
    del,
    loading,
    response,
  } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  const closeHandler = () => {
    showDeleteEventModalAction(false);
  }

  const deleteHandler = async (e) => {
    e.preventDefault();

    if (multiple) {
      await del(`/admin/habitats/${habitatId}/schedule-rules/${scheduleRuleId}`);
    } else {
      await del(`/admin/habitats/${habitatId}/schedule-rules/${scheduleRuleId}/schedules/${scheduleId}`);
    }

    if (response.ok) {
      updateCalendarAction();
      closeHandler();
      return;
    }
    // TODO handle errors properly for all schedule event modals
    setError('Something went wrong, Please try again!');
  };

  if (!isOpen || !scheduleRuleId) {
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
            Delete Event
          </Heading>
          <Button
            plain
            margin="medium"
            onClick={closeHandler}
            icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
          />
        </Box>

        <form onSubmit={deleteHandler} className={style.form}>
          <div className={classnames(style.wrapper, 'customScrollBar')}>
            <Heading level="4" margin="10px 0 20px 0">Are you sure you want to delete this event?</Heading>
            {description && (
              <Text size="xlarge">
                &quot;
                {description}
                &quot;
              </Text>
            )}
            {!freqHidden && (
              <Box direction="row" margin="20px 0">
                <RadioButton
                  checked={!multiple}
                  label="Single Event"
                  value={false}
                  name="singleEvent"
                  onChange={({ target: { checked } }) => setMultipleAction(checked === false)}
                />
                &nbsp;
                &nbsp;
                <RadioButton
                  checked={multiple}
                  label="All Events"
                  value={true}
                  name="singleEvent"
                  onChange={({ target: { checked } }) => setMultipleAction(checked === true)}
                />
              </Box>
            )}
            <Box margin={{ bottom: '20px' }}>
              <Text size="xlarge">Type in the word “delete” here to confirm:</Text>
            </Box>
            <input type="text" value={confirmation} onChange={({ target: { value }}) => setConfirmation(value)} />
          </div>
          <Box direction="row" justify="end" pad={{ horizontal: '20px' }}>
            <PrimaryButton
              label="Delete"
              type="submit"
              loading={loading}
              disabled={confirmation !== 'delete'}
            />
            {error && <div className={style.formSubmissionError}>{error}</div>}
          </Box>
        </form>
      </div>
    </Layer>
  )
};

export default connect(
  ({
    habitat: {
      habitatInfo: { _id: habitatId },
      calendarEvents: {
        deleteModal: {
          isOpen,
          multiple,
          freqHidden,
        },
        event: {
          _id: scheduleId,
          businessHourId: scheduleRuleId,
          description,
        },
      },
    },
  }) => ({
    scheduleRuleId,
    scheduleId,
    description,
    isOpen,
    multiple,
    freqHidden,
    habitatId,
  }),
  {
    showDeleteEventModalAction: showDeleteEventModal,
    updateCalendarAction: updateCalendar,
    setMultipleAction: setDeleteMultiple,
  },
)(DeleteEvent);

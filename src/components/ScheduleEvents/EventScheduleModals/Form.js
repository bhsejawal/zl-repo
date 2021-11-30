import { get, isEmpty, omit } from 'lodash-es';
import { useEffect, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import {
  Box,
  CheckBoxGroup,
  DateInput,
  Grommet,
  RadioButton,
  Select,
  Text,
  TextInput,
  Form,
  FormField,
  DropButton,
} from 'grommet';
import { deepMerge } from 'grommet/utils';
import { grommet } from 'grommet/themes';
import { utcToZonedTime } from 'date-fns-tz';
import { sub, add } from 'date-fns';
import { FormDown } from 'grommet-icons';
import classnames from 'classnames';
import useFetch from 'use-http';

import { buildURL, API_BASE_URL } from 'Shared/fetch';
import { PrimaryButton, OutlineButton } from 'Components/Buttons';
import { showDeleteEventModal } from '../actions';
import grommetTheme from '../../../grommetTheme';

import style from './style.scss';

const TALK = 'talk';
const STREAM = 'stream';

const REPEATS = 'Repeats';
const ONE_TIME_EVENT = 'One-Time Event';

const { timeZone: currentTimezone } = Intl.DateTimeFormat().resolvedOptions();

const getDuration = (ms) => {
  const oneHourMs = 60 * 60 * 1000;
  const oneMinuteMs = 60 * 1000;

  return [Math.floor(ms / oneHourMs), (ms % oneHourMs) / oneMinuteMs];
}

const defaultData = (timezone) => ({
  type: '',
  title: '',
  hostEmail: '',
  description: '',
  hour: 0,
  minute: 0,
  durationMs: 0,
  cameras: [],
  days: [], // ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
  // to avoid edge cases for converting in between local/utc/zoo timezones
  // Date should be zoneless/timeless just like the visible text
  date: utcToZonedTime(new Date(), timezone).toLocaleDateString(),
  frequency: REPEATS,
  singleEvent: 'false',
});

const theme = deepMerge(grommet, grommetTheme, {
  formField: {
    margin: 'none',
    border: {
      color: 'white',
    },
  },
});

const clearTimeOffset = (date, timezone) => {
  // Calendar input consume a date sting, but it also deals with time internally
  // we need clear the timezone offset to have the date in input box matches date in drop panel
  let dateStr = date;

  // recurring event single event edit
  if (!dateStr) {
    dateStr = utcToZonedTime(new Date(), timezone).toLocaleDateString();
  }
  // unify format
  if (dateStr.includes('-')) {
    // new Date('2021-11-04') is Thu Nov 04 2021 12:00:00 GMT+1200 (Anadyr Standard Time)
    // new Date('11/04/2021') is Thu Nov 04 2021 00:00:00 GMT+1200 (Anadyr Standard Time)
    const [year, month, day] = dateStr.split('-');
    dateStr = [month, day, year].join('/');
  }

  let result = new Date(dateStr);

  const offset = result.getTimezoneOffset();
  if (offset > 0) {
    result = add(result, { minutes: offset });
  } else {
    result = sub(result, { minutes: offset });
  }

  return result.toString();
};

const cameraLabel = (cameras, ids) => {
  if (ids.length === 0) {
    return 'Select Camera';
  }

  if (ids.length <= 2) {
    return ids.map((item) => cameras.find(({ _id }) => _id === item)?.cameraName || item).join(', ');
  }

  return `Selected Cameras (${ids.length})`;
};

const EventForm = ({
  onSubmit,
  scheduleData,
  timezone,
  habitatId,
  showDeleteEventModalAction,
}) => {
  // eslint-disable-next-line no-underscore-dangle
  const isEdit = !!scheduleData?._id;
  const [data, setData] = useState(isEdit ? {
    ...scheduleData,
    frequency: !scheduleData?.date ? REPEATS : ONE_TIME_EVENT,
    singleEvent: '',
  } : defaultData(timezone));
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [habitatCameras, setHabitatCameras] = useState([]);

  const { data: { hosts } = {}, get: getHosts } = useFetch(
    buildURL('/admin/users/hosts'),
    { credentials: 'include' },
  );

  const { data: cameras, get: getCameras } = useFetch(
    API_BASE_URL,
    { credentials: 'include' },
  );

  useEffect(() => {
    if (!cameras) {
      const params = new URLSearchParams();
      params.append('fields[]', 'cameraName');
      params.append('fields[]', 'habitat');
      getCameras(`/admin/cameras?${params}`);
    }

    if (cameras) {
      setHabitatCameras(cameras.filter(({ habitat }) => habitat === habitatId));
    }

    if (data.type === TALK && !isEmpty(data.cameras)) {
      setData({ ...data, cameras: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCameras, data.type, cameras]);

  useEffect(() => {
    if (data?.type === TALK) {
      getHosts();
    }
  }, [data?.type, getHosts]);

  // TODO enhance form validation to be field specific before sending a request
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const singleEvent = data.singleEvent === 'true';

      const submitData = {
        ...omit(data, 'frequency'),
        days: data.frequency === REPEATS && !singleEvent ? data.days : [],
        date: data.frequency === ONE_TIME_EVENT || singleEvent ? data.date?.slice(0, 10) : null,
        singleEvent,
      };

      await onSubmit(submitData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const changeHandler = (property, type = 'input') => (e) => {
    let { target: { value } = {} } = e;
    if (type === 'time') {
      const [hours, minutes] = value.split(':');
      setData({ ...data, hour: Number(hours), minute: Number(minutes) });
      return;
    }

    if (type === 'durationH') {
      const hours = Number(value);
      const [, m] = getDuration(data.durationMs);

      setData({ ...data, durationMs: ((hours * 60) + m) * 60 * 1000 });
      return;
    }

    if (type === 'durationM') {
      const minutes = Number(value);
      const [h] = getDuration(data.durationMs);
      setData({ ...data, durationMs: ((h * 60) + minutes) * 60 * 1000 });
      return;
    }

    if (property === 'singleEvent') {
      setData({ ...data, singleEvent: e.value });
      return;
    }

    if (type === 'CheckBoxGroup') {
      value = e.value.map((value) => value.toUpperCase().slice(0, 2));
    }

    if (type === 'DateInput') {
      if (e.value) {
        // date should be stored in state as a string without any timezone/time
        value = new Date(e.value).toLocaleDateString();
      }
    }

    setData({ ...data, [property]: value });
  };

  const onHostSuggestionClick = ({ suggestion }) => {
    setData({ ...data, hostEmail: suggestion });
  };

  return (
    <Grommet theme={theme}>
      <Form onSubmit={submitHandler} className={style.form}>
        <div className={classnames(style.wrapper, 'customScrollBar')}>
          <Box direction="column">
            {isEdit && !scheduleData.date && (
              <Box direction="column" width="calc(50% - 10px)" className={style.inputWrapper}>
                <Text size="xlarge" className={style.label}>Edit</Text>

                <FormField name="select-singleEvent" required className={style.selectContainer}>
                  <Select
                    labelKey="label"
                    valueKey={{ key: 'value', reduce: true }}
                    value={data.singleEvent}
                    options={[
                      { label: 'Single Event', value: 'true'},
                      { label: 'All Events', value: 'false'},
                    ]}
                    onChange={changeHandler('singleEvent')}
                    name="select-singleEvent"
                    placeholder="Select Event"
                  />
                </FormField>
              </Box>
            )}
            {/* eslint-disable-next-line no-underscore-dangle */}
            {!isEdit && (
              <Box direction="column" width="calc(50% - 10px)">
                <Text size="xlarge" className={classnames(style.label, style.eventType)}>Event Type:</Text>
                <FormField name="select-type" required className={style.selectContainer}>
                  <Select
                    labelKey="label"
                    valueKey={{ key: 'value', reduce: true }}
                    value={data.type || undefined}
                    options={[
                      { label: 'Talk', value: TALK},
                      { label: 'Stream', value: STREAM},
                    ]}
                    onChange={changeHandler('type')}
                    name="select-type"
                    placeholder="Select type"
                  />
                </FormField>
              </Box>
            )}

            <Box direction="row">
              <Box direction="column" width="calc(50% - 10px)" margin={{ right: '10px' }} className={style.inputWrapper}>
                <FormField name="title" required>
                  <Text size="xlarge" className={style.label}>Event Title</Text>
                  <TextInput value={data.title} name="title" className={style.letterCount} maxLength="50" onChange={changeHandler('title')} />
                  <div className={style.letterLabel}>{`${data?.title?.length}/50`}</div>
                </FormField>
              </Box>

              {data.type === STREAM && (
                <Box direction="column" width="calc(50% - 10px)" margin={{ left: '10px' }}>
                  <FormField
                    name="cameras"
                    validate={() => (isEmpty(data.cameras) ? { message: 'required', status: 'error' } : true)}
                  >
                    <Text size="xlarge" className={style.label}>Camera</Text>
                    <DropButton
                      className={style.cameraSelect}
                      label={
                        <div className={style.labelContainer}>
                          <span>{cameraLabel(habitatCameras, data.cameras)}</span>
                          <FormDown color="var(--blueMediumLight)" size="24px" />
                        </div>
                      }
                      dropContent={
                        <CheckBoxGroup
                          className={style.dropContainer}
                          name="cameras"
                          labelKey="label"
                          valueKey="value"
                          value={data.cameras}
                          onChange={({ value }) => {
                            const handler = changeHandler('cameras');
                            handler({ target: { value } });
                          }}
                          options={habitatCameras.map(
                            ({ _id, cameraName }) => ({ label: cameraName, value: _id }),
                          )}
                        />
                      }
                      dropProps={{ align: { top: 'bottom' } }}
                    />
                  </FormField>
                </Box>
              )}

              {data.type === TALK && (
                <Box direction="column" width="calc(50% - 10px)" margin={{ left: '10px' }} className={style.inputWrapper}>
                  <FormField name="email" required>
                    <Text size="xlarge" className={style.label}>Host Email</Text>
                    <TextInput
                      type="email"
                      name="email"
                      value={data.hostEmail}
                      onChange={changeHandler('hostEmail')}
                      onSuggestionSelect={onHostSuggestionClick}
                      suggestions={hosts}
                    />
                    {data.hostEmail.length > 0 && <div className={style.error}>Invalid Email</div>}
                  </FormField>
                </Box>
              )}
            </Box>
          </Box>

          {data.type === TALK && (
            <Box direction="column" className={style.inputWrapper}>
              <Text size="xlarge" className={style.label}>Description</Text>
              <textarea rows="3" value={data.description} onChange={changeHandler('description')} />
            </Box>
          )}

          <Box direction="column" className={style.inputWrapper}>
            <Text size="xlarge" className={style.label}>Time</Text>
            {timezone !== currentTimezone && (
              <Text margin={{ bottom: 'small' }} color="rgb(240, 94, 100)">
                Time below is in
                {' '}
                {timezone}
                {', '}
                the local timezone of the habitat.
              </Text>
            )}
            <Box direction="row" alignContent="center">
              <Box flex={{ grow: 1 }}>
                <input
                  type="time"
                  value={`${data.hour <= 9 ? '0' : ''}${data.hour}:${data.minute <= 9 ? '0' : ''}${data.minute}`}
                  onChange={changeHandler(null, 'time')} required
                />
              </Box>
              <Text size="xlarge" alignSelf="center">
                <Box margin={{ horizontal: '13px' }}>for</Box>
              </Text>
              <Box flex={{ grow: 1 }} width="30%" className={style.selectContainer}>
                <Select
                  classname={style.select}
                  labelKey="label"
                  valueKey={{ key: 'value', reduce: true }}
                  value={getDuration(data.durationMs)[0] || 0}
                  options={new Array(24).fill(null).map((item, index) => (
                    { label: `${index} hour${index !== 1 ? 's' : ''}`, value: index}
                  ))}
                  onChange={changeHandler(null, 'durationH')}
                />
              </Box>
              &nbsp;
              &nbsp;
              <Box flex={{ grow: 1 }} width="30%" className={style.selectContainer}>
                <Select
                  classname={style.select}
                  labelKey="label"
                  valueKey={{ key: 'value', reduce: true }}
                  value={getDuration(data.durationMs)[1] || 0}
                  options={new Array(59).fill(null).map((item, index) => {
                    if (index % 5 === 0 ) {
                      return { label: `${index} minute${index !== 1 ? 's' : ''}`, value: index}
                    }
                    return null;
                  }).filter((item) => item !== null)}
                  onChange={changeHandler(null, 'durationM')}
                />
              </Box>
            </Box>
            {/* This is not based on design - will be used for monitoring purpose */}
            {data.frequency === ONE_TIME_EVENT && isEdit && !data.days?.length && (
              <Box direction="row" alignContent="center" margin={{ top: '30px' }}>
                <Grommet theme={{ global: { ...grommetTheme.global }}}>
                  <DateInput
                    className={style.dateInput}
                    format="dd/mm/yyyy"
                    value={clearTimeOffset(data.date, timezone)}
                    onChange={changeHandler('date', 'DateInput')}
                    calendarProps={{ daysOfWeek: true }}
                    readOnly
                  />
                </Grommet>
              </Box>
            )}
            {data.singleEvent === 'false' && (
              <Box direction="column">
                <Text size="xlarge" className={style.label}>Frequency</Text>
                <Box direction="row">
                  <Box direction="column" className={style.frequency}>
                    <RadioButton
                      checked={data.frequency === REPEATS}
                      label={REPEATS}
                      value={REPEATS}
                      name="frequency"
                      onChange={changeHandler('frequency', 'CheckBox')}
                    />
                    <br />
                    <RadioButton
                      checked={data.frequency === ONE_TIME_EVENT}
                      label={ONE_TIME_EVENT}
                      value={ONE_TIME_EVENT}
                      name="frequency"
                      onChange={changeHandler('frequency', 'CheckBox')}
                    />
                  </Box>
                  <Box>
                    {data.frequency === REPEATS && (
                      <CheckBoxGroup
                        value={get(data, 'days')}
                        options={[
                          { label: 'Monday', value: 'MO' },
                          { label: 'Tuesday', value: 'TU' },
                          { label: 'Wednesday', value: 'WE' },
                          { label: 'Thursday', value: 'TH' },
                          { label: 'Friday', value: 'FR' },
                          { label: 'Saturday', value: 'SA' },
                          { label: 'Sunday', value: 'SU' },
                        ]}
                        onChange={changeHandler('days', 'CheckBoxGroup')}
                      />
                    )}
                    {data.frequency === ONE_TIME_EVENT && (
                      <Grommet theme={{ global: { ...grommetTheme.global }}}>
                        <DateInput
                          className={style.dateInput}
                          format="dd/mm/yyyy"
                          value={clearTimeOffset(data.date, timezone)}
                          onChange={changeHandler('date', 'DateInput')}
                          calendarProps={{ daysOfWeek: true }}
                          readOnly
                        />
                      </Grommet>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </div>
        {error && (
          <Box className={style.formSubmissionError}>
            {error}
          </Box>
        )}
        <Box direction="row" justify="end" margin={{ top: '38px' }} pad={{ right: '20px', left: '40px' }}>
          {isEdit && (
            <OutlineButton
              label="Delete"
              onClick={() => showDeleteEventModalAction(true, data.singleEvent === 'false', scheduleData.date)}
              margin={{ right: '20px' }}
              disabled={isEdit && !data.date && data.singleEvent === ''}
            />
          )}
          <PrimaryButton loading={loading} type="submit" label="Publish" disabled={isEdit && !data.date && data.singleEvent === ''} />
        </Box>
      </Form>
    </Grommet>
  )
};

export default connect(({
  habitat: {
    habitatInfo: {
      _id: habitatId,
      zoo: {
        timezone,
      } = {},
    },
  },
}) => ({ timezone, habitatId }),
{
  showDeleteEventModalAction: showDeleteEventModal,
})(EventForm);

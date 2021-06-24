import { get, omit } from 'lodash-es';
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
} from 'grommet';
import { formatISO, parseISO } from 'date-fns';
import classnames from 'classnames';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';
import { PrimaryButton, OutlineButton } from 'Components/Buttons';
import { showDeleteEventModal } from './actions';
import grommetTheme from '../../../../../../grommetTheme';

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

const defaultData = {
  type: 'stream',
  title: '',
  hostEmail: '',
  description: '',
  hour: 0,
  minute: 0,
  durationMs: 0,
  days: [], // ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
  date: formatISO(new Date(), { representation: 'date' }),
  // NEW
  frequency: REPEATS,
  singleEvent: false,
};

const Form = ({
  onSubmit,
  scheduleData,
  timezone,
  showDeleteEventModalAction,
}) => {
  // eslint-disable-next-line no-underscore-dangle
  const isEdit = !!scheduleData?._id;
  const [data, setData] = useState(isEdit ? {
    ...scheduleData,
    frequency: !scheduleData?.date ? REPEATS : ONE_TIME_EVENT,
    singleEvent: !scheduleData?.date,
  } : defaultData);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  const { data: { hosts } = {}, get: getHosts } = useFetch(
    buildURL('/admin/users/hosts'),
    { credentials: 'include' },
  );

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
      await onSubmit({
        ...omit(data, 'frequency'),
        days: data.frequency === REPEATS && !data.singleEvent ? data.days : [],
        date: data.frequency === ONE_TIME_EVENT || data.singleEvent ? data.date : null,
      });
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
      setData({ ...data, singleEvent: value.toLocaleString() === 'true' });
      return;
    }

    if (type === 'CheckBoxGroup') {
      value = e.value.map((value) => value.toUpperCase().slice(0, 2));
    }

    if (type === 'DateInput') {
      // there is a difference between input edit and selecting from date picker
      value = e.value || new Date(value).toString();
    }

    setData({ ...data, [property]: value });
  };

  const onHostSuggestionClick = ({ suggestion }) => {
    setData({ ...data, hostEmail: suggestion });
  };

  return (
    <form onSubmit={submitHandler} className={style.form}>
      <div className={classnames(style.wrapper, 'customScrollBar')}>
        <Box direction="column">
          {isEdit && !scheduleData.date && (
            <Box direction="row">
              <RadioButton
                checked={data.singleEvent}
                label="Single Event"
                value={true}
                name="singleEvent"
                onChange={changeHandler('singleEvent', 'RadioButton')}
              />
              &nbsp;
              &nbsp;
              <RadioButton
                checked={!data.singleEvent}
                label="All Events"
                value={false}
                name="singleEvent"
                onChange={changeHandler('singleEvent', 'RadioButton')}
              />
            </Box>
          )}
          {/* eslint-disable-next-line no-underscore-dangle */}
          {!isEdit && (
            <Box direction="column">
              <Text size="xlarge" className={classnames(style.label, style.eventType)}>Event Type:</Text>
              <div className={style.selectContainer}>
                <Select
                  labelKey="label"
                  valueKey={{ key: 'value', reduce: true }}
                  value={data.type || undefined}
                  options={[
                    { label: 'Talk', value: TALK},
                    { label: 'Stream', value: STREAM},
                  ]}
                  onChange={changeHandler('type', 'select')}
                />
              </div>
            </Box>
          )}

          <Box direction="row">
            <Box direction="column" width="calc(50% - 10px)" margin={{ right: '10px' }} className={style.inputWrapper}>
              <Text size="xlarge" className={style.label}>Event Title</Text>
              <input value={data.title} className={style.letterCount} maxLength="30" onChange={changeHandler('title')} required />
              <div>{`${data?.title?.length}/30`}</div>
            </Box>
            {data.type === TALK && (
              <Box direction="column" width="calc(50% - 10px)" margin={{ left: '10px' }} className={style.inputWrapper}>
                <Text size="xlarge" className={style.label}>Host Email</Text>
                <TextInput
                  required
                  type="email"
                  value={data.hostEmail}
                  onChange={changeHandler('hostEmail')}
                  onSuggestionSelect={onHostSuggestionClick}
                  suggestions={hosts}
                />
                {data.hostEmail.length > 0 && <div className={style.error}>Invalid Email</div>}
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
            <Text margin={{ vertical: 'small' }}>
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
                value={getDuration(data.durationMs)[0] || undefined}
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
                value={getDuration(data.durationMs)[1] || undefined}
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
          {!data.singleEvent && (
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
                        format="mm/dd/yyyy"
                        value={data.date ? parseISO(data.date) : (new Date()).toISOString()}
                        onChange={changeHandler('date', 'DateInput')}
                      />
                    </Grommet>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </div>
      <Box direction="row" justify="end" margin={{ top: '38px' }} pad={{ right: '20px', left: '40px' }}>
        {isEdit && (
          <OutlineButton
            label="Delete"
            onClick={() => showDeleteEventModalAction(true, !data.singleEvent, scheduleData.date)}
            margin={{ right: '20px' }}
          />
        )}
        <PrimaryButton loading={loading} type="submit" label="Publish" />
        {error && <div className={style.formSubmissionError}>{error}</div>}
      </Box>
    </form>
  )
};

export default connect(
  ({
    habitat: {
      habitatInfo: {
        zoo: {
          timezone,
        } = {},
      },
    },
  }) => ({
    timezone,
  }),
  { showDeleteEventModalAction: showDeleteEventModal },
)(Form);

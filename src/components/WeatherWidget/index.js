import { connect } from 'react-redux';
import {
  Box,
  Image,
  Text,
  Tip,
} from 'grommet';
import classnames from 'classnames';
import { useMemo } from 'preact/hooks';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/pro-light-svg-icons';

import Clock from './Clock';
import { useIsMobileSize } from '../../hooks';
import { useUpcomingTalks } from '../../routes/habitat/hooks';
import { showScheduleModal } from '../../routes/habitat/components/ScheduleModal/actions';

import style from './style.scss';

const WeatherWidget = ({
  weather,
  location,
  habitatId,
  showScheduleModalAction,
}) => {
  const isMobileSize = useIsMobileSize();
  const {upcoming = [] } = useUpcomingTalks(habitatId, 1);

  const nextTalk = useMemo(
    () => {
      if (!upcoming?.length) {
        return null;
      }
      const [nextTalk] = upcoming;
      return format(nextTalk.startTime, 'EEE hh:mm aa').toUpperCase();
    },
    [upcoming],
  );

  console.log({ nextTalk });

  if (!weather || !location) {
    return null;
  }

  if (isMobileSize) {
    return (
      <Box pad="small" className={classnames(style.liveTag, style.mobile)}>
        <Text size="small">LIVE</Text>
      </Box>
    );
  }

  return (
    <Box
      className={style.weatherWidget}
      responsive
      width="small"
    >
      <Box className={style.weatherWrapper}>
        <Box direction="row" flex="grow" margin={{ bottom: "xsmall" }}>
          <Box className={style.liveTag}>
            LIVE
          </Box>
          <Text size="medium">
            {`${location.city}, ${location.country}`}
          </Text>
        </Box>
        <Box direction="row" justify="center" align="center">
          <Clock />
          <Box flex="grow" justify="center" className={style.weather} direction="row">
            <Image src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="condition" />
            <Text size="small" weight={700}>
              {`${parseInt(weather.temperature, 10)}C`}
            </Text>
          </Box>
        </Box>
      </Box>
      <Tip
        content={
          <Box background="white" pad="xsmall" width="150px">
            <Text size="small" textAlign="center">Click to see the talk schedule</Text>
          </Box>
        }
      >
        <Box
          className={style.schedule}
          direction="row"
          flex="grow"
          onClick={showScheduleModalAction}
        >
          {nextTalk && (
            <>
              <FontAwesomeIcon icon={faCalendarAlt} color="white" size={10} />
              <Text size="small">
                {`Next talk: ${nextTalk}`}
              </Text>
            </>
          )}
          {!nextTalk && (
            <>
              <FontAwesomeIcon icon={faCalendarAlt} color="white" size={10} />
              <Text size="small">Click to see talk schedule</Text>
            </>
          )}
        </Box>
      </Tip>
    </Box>
  );
}

export default connect((
  { habitat: { habitatInfo: { zoo, _id: habitatId } } },
) => (
  { weather: zoo?.weather, location: zoo?.location, habitatId }
), {
  showScheduleModalAction: showScheduleModal,
})(WeatherWidget);

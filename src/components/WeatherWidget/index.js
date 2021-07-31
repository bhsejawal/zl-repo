import { connect } from 'react-redux';
import { Box, Image, Text } from 'grommet';
import classnames from 'classnames';

import Clock from './Clock';
import { useIsMobileSize } from '../../hooks';

import style from './style.scss';

const WeatherWidget = ({ weather, location }) => {
  const isMobileSize = useIsMobileSize();

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
  );
}

export default connect((
  { habitat: { habitatInfo: { zoo } } },
) => (
  { weather: zoo?.weather, location: zoo?.location }
))(WeatherWidget);

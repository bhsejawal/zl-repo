import { connect } from 'react-redux';
import { Box, Image, Text } from 'grommet';

import Clock from './Clock';
import style from './style.scss';

const WeatherWidget = ({ weather, location }) => {
  if (!weather || !location) {
    return null;
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
        <Text size="small">
          {`${location.city}, ${location.country}`}
        </Text>
      </Box>
      <Box direction="row" justify="center" align="center">
        <Clock />
        <Box flex="grow" justify="center" className={style.weather} direction="row">
          <Image src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="condition" />
          <Text size="xsmall">
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

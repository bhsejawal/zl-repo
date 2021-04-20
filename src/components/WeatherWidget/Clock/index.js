import { useEffect, useState, useRef } from 'preact/hooks';
import { connect } from 'react-redux';
import { Text } from 'grommet';

import style from './style.scss';

const currentTimeInTZ = (timeZone) => (new Intl.DateTimeFormat('default', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZone,
}).format(new Date()))

const Clock = ({ timezone }) => {
  const [time, setTime] = useState(currentTimeInTZ(timezone));
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setInterval(() => setTime(currentTimeInTZ(timezone)), 1000);
    return () => clearInterval(timeoutRef.current);
  }, [timezone]);

  return (
    <Text className={style.time}>
      {time.toLowerCase()}
    </Text>

  )
}

export default connect((
  { habitat: { habitatInfo: { zoo }}},
) => (
  { timezone: zoo?.timezone }
))(Clock)

import { memo } from 'preact/compat';
import { useEffect, useState, useRef } from 'preact/hooks';
import { Box, Text } from 'grommet';
import { differenceInMilliseconds } from 'date-fns';

import style from './style.scss';

const msToReadable = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Livetime = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const timeoutRef = useRef(null);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (endTime) {
      setTimeLeft(differenceInMilliseconds(endTime, new Date()));
      timeoutRef.current = setInterval(
        () => setTimeLeft(differenceInMilliseconds(endTime, new Date())),
        1000,
      );
      return () => clearInterval(timeoutRef.current);
    }
  }, [endTime]);

  if (!endTime || timeLeft <= 0) {
    return null;
  }

  return (
    <Box
      background="#F5696B"
      className={style.liveTagContainer}
      pad={{ vertical: "xsmall", horizontal: "small"}}
      direction="row"
      align="center"
      justify="center"
    >
      <div className={style.bullet} />
      <Text
        size="10px"
        weight={500}
        margin={{ left: "5px"}}
        color="white"
      >
        {msToReadable(timeLeft)}
      </Text>
    </Box>
  );
};

export default memo(Livetime);

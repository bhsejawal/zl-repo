import {
  Grommet,
  Box,
  RangeSelector,
  Stack,
} from 'grommet';
import { useState } from 'preact/hooks';
import { customEdge, getTimeString } from './helper';

import style from './style.scss'

let tooltipTimeout;

const CustomRangeInput = ({
  duration = 60,
  minimumSelection = 15,
  onChange,
  initRange,
}) => {
  const [range, setRange] = useState(initRange);
  const [showTooltip, setShowTooltip] = useState();
  const [min, max] = range;

  const onChangeHandler = ([low, high]) => {
    setShowTooltip(true);
    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => setShowTooltip(false), 2000);

    if ((high - low) >= minimumSelection) {
      setRange([low, high]);
      onChange([low, high]);
    }
  };

  return (
    <Grommet theme={customEdge} className={style.rangeInputContainer}>
      {showTooltip && (
        <div className={style.tooltip} style={{ left: `${((min + ((max - min) / 2)) / duration) * 100}%` }}>
          <div className={style.content}>
            <p>{`${max - min}s / ${duration}s`}</p>
            <span>{`${getTimeString(min)} - ${getTimeString(max)}`}</span>
          </div>
        </div>
      )}

      <Stack fill className={style.wrapper}>
        <Box
          direction="row"
          justify="between"
          width="100%"
          height="100%"
          background="var(--blueLight)"
          round="5px"
        >
          {Array(duration).fill('').map((value, index) => (
            <div
              /* eslint-disable-next-line react/no-array-index-key */
              key={index}
              className={style.step}
            >
              <div style={{ height: index % 5 === 0 ? '18px' : '10px' }} />
            </div>
          ))}
        </Box>

        <RangeSelector
          direction="horizontal"
          min={0}
          max={duration - 1}
          size="full"
          values={range}
          color="red"
          onChange={onChangeHandler}
          width="100%"
          round="5px"
          className={style.rangeInput}
        />
      </Stack>
    </Grommet>
  );
};

export default CustomRangeInput;

import { useState } from 'preact/hooks';
import { Box, Text } from 'grommet';

import { PrimaryButton } from 'Components/Buttons';
import Broadcast from 'Components/BroadcastWrapper/Broadcast';

import background from './hostBackground.png';
import style from './style.scss';

const BroadcastWrapper = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  if (!isInitialized) {
    return (
      <Box
        height={{ min: '140px', max: '140px' }}
        width={{ min: '240px', max: '240px' }}
        background={{image: `url(${background})`}}
        style={{ position: 'relative', borderRadius: '5px'}}
        fill
        justify="center"
        align="center"
      >
        <Text
          size="xlarge"
          color="white"
          className={style.shadow}
        >
          Ready to Stream
        </Text>
        <Box margin={{ top: 'small' }}>
          <PrimaryButton label="Enter Host Mode" size="medium" onClick={() => setIsInitialized(true)} />
        </Box>
      </Box>
    )
  }
  return <Broadcast resetBroadcastContainer={() => setIsInitialized(false)} />
};

export default BroadcastWrapper;

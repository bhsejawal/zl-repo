import { useState } from 'preact/hooks';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignalStream } from '@fortawesome/pro-solid-svg-icons';

import RoundButton from 'Components/RoundButton';

import Broadcast from 'Components/BroadcastWrapper/Broadcast';
import style from './style.scss';

const BroadcastWrapper = ({ size }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  if (!isInitialized) {
    return (
      <RoundButton
        onClick={() => setIsInitialized(true)}
        width="40"
        backgroundColor="var(--blueDark)"
        color="white"
        className={style.broadcastButton}
      >
        <FontAwesomeIcon icon={faSignalStream} />
      </RoundButton>
    )
  }

  return (
    <Broadcast
      resetBroadcastContainer={() => setIsInitialized(false)}
      width={size}
      height={size}
    />
  );
};

export default BroadcastWrapper;

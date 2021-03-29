import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from '@fortawesome/pro-solid-svg-icons';
import { GlobalsContext } from 'Shared/context';

import RoundButton from 'Components/RoundButton';
import ShareContainer from './ShareContainer';

import style from './style.scss';

const TakeSnapshotButton = () => {
  const { socket } = useContext(GlobalsContext);

  const clickHandler = () => {
    socket.emit('takeSnapshot', { room: 'zlRoom', userId: 'zlUserId' });
  };

  return (
    <div className={style.takeSnapshotContainer}>
      <RoundButton
        onClick={clickHandler}
        width="36"
        backgroundColor="var(--blueDark)"
        color="white"
      >
        <FontAwesomeIcon icon={faCamera} />
      </RoundButton>
      <ShareContainer />
    </div>
  );
};

export default TakeSnapshotButton;

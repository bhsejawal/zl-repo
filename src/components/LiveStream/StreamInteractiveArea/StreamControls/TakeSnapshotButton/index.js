import { h } from 'preact';
import { useContext } from 'preact/hooks';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from '@fortawesome/pro-solid-svg-icons';

import { GlobalsContext } from '../../../../../context';
import RoundButton from '../../../../RoundButton';

import style from './style.scss';

const TakeSnapshotButton = () => {
  const { socket } = useContext(GlobalsContext);

  const clickHandler = () => {
    socket.emit('takeSnapshot', { room: 'zlRoom', userId: 'zlUserId' });
  };

  return (
    <RoundButton
      onClick={clickHandler}
      className={style.takeSnapshotBtn}
      width="35"
      backgroundColor="#76A6F2"
      color="white"
    >
      <FontAwesomeIcon icon={faCamera} />
    </RoundButton>
  );
};

export default TakeSnapshotButton;

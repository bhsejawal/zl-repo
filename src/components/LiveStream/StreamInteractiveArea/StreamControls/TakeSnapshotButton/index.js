import { h } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/pro-solid-svg-icons';
import { GlobalsContext } from 'Shared/context';
import { connect } from 'react-redux';

import RoundButton from 'Components/RoundButton';
import ShareContainer from './ShareContainer';

import style from './style.scss';

let timeout;

const TakeSnapshotButton = ({ habitatId, userId }) => {
  const { socket } = useContext(GlobalsContext);
  const [loading, setLoading] = useState();

  const clickHandler = () => {
    socket.emit('zl_takeSnapshot', { room: habitatId, userId });
    setLoading(true);
    // This is a fallback in case socket didnt return any photo in 8 seconds
    timeout = setTimeout(setLoading, 8000);
  };

  useEffect(() => {
    const stopLoading = (data = {}) => {
      if (data?.userId === userId) {
        setLoading();
        clearTimeout(timeout);
        timeout = undefined;
      }
    };

    if (socket) {
      socket.on('snapshotTaken', stopLoading);
    }

    return () => {
      if (socket) {
        socket.off('snapshotTaken', stopLoading);
      }
    }
  }, [socket, userId]);

  return (
    <div className={style.takeSnapshotContainer}>
      <RoundButton
        onClick={clickHandler}
        width="36"
        backgroundColor="var(--blueDark)"
        color="white"
        disabled={loading}
        loading={loading}
      >
        <FontAwesomeIcon icon={faCamera} />
      </RoundButton>
      <ShareContainer />
    </div>
  );
};

export default connect(({
  user: { userId },
  habitat: { habitatInfo: { _id: habitatId } },
}) => ({
  userId,
  habitatId,
}))(TakeSnapshotButton);

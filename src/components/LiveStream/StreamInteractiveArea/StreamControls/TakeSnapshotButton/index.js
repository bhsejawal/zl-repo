import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { GlobalsContext } from 'Shared/context';
import { connect } from 'react-redux';
import { Button, Drop } from 'grommet';
import {
  useContext,
  useEffect,
  useState,
  useRef,
} from 'preact/hooks';

import RoundButton from 'Components/RoundButton';
import { useIsMobileSize } from '../../../../../hooks';
import { setShareModalData } from '../../../../../routes/habitat/components/ShareModal/actions';
import ShareContainer from './ShareContainer';

import style from './style.scss';

let timeout;

const TakeSnapshotButton = ({
  plain,
  habitatId,
  userId,
  setShareModalDataAction,
}) => {
  const { socket } = useContext(GlobalsContext);
  const [loading, setLoading] = useState();
  const [tryAgain, setTryAgain] = useState();
  const isMobileSize = useIsMobileSize();

  const ref = useRef();

  const clickHandler = () => {
    socket.emit('zl_takeSnapshot', { room: habitatId, userId });
    setLoading(true);
    // This is a fallback in case socket didn't return any photo in 8 seconds
    timeout = setTimeout(() => {
      setLoading(false);
      setTryAgain(true);
    }, 8000);
  };

  useEffect(() => {
    const stopLoading = (data = {}) => {
      if (data?.userId === userId) {
        setLoading(false);
        setTryAgain(false);
        clearTimeout(timeout);
        timeout = undefined;

        if (isMobileSize) {
          setShareModalDataAction({
            open: true,
            data: {
              _id: data.snapshotId,
              htmlURL: data.html,
              url: data.snapshot,
              userId,
            },
            nextId: null,
            prevId: null,
          });
        }
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

  if (plain) {
    return (
      <Button
        ref={ref}
        plain
        onClick={clickHandler}
        disabled={loading}
        className={style.mobileButton}
      >
        {loading
          ? <FontAwesomeIcon color="#fff" size="lg" icon={faSpinner} spin />
          : <FontAwesomeIcon color="#fff" size="lg" icon={faCamera} />}
        {ref.current && tryAgain && (
          <Drop
            background="var(--red)"
            margin={{ bottom: '25px' }}
            align={{ bottom: 'top', left: 'left' }}
            target={ref.current}
            round="7px"
            onClickOutside={() => setTryAgain(false)}
          >
            <div className={style.tryAgain}>
              Oops, try again!
            </div>
          </Drop>
        )}
      </Button>
    );
  }
  return (
    <div ref={ref} className={style.takeSnapshotContainer}>
      {ref.current && tryAgain && (
        <Drop
          background="var(--red)"
          margin={{ left: '10px' }}
          align={{ left: 'right' }}
          target={ref.current}
          round="7px"
          onClickOutside={() => setTryAgain(false)}
        >
          <div className={style.tryAgain}>
            Oops, try again!
          </div>
        </Drop>
      )}
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
      {!isMobileSize && <ShareContainer />}
    </div>
  );
};

export default connect(({
  user: { userId },
  habitat: { habitatInfo: { _id: habitatId } },
}) => ({
  userId,
  habitatId,
}),
{ setShareModalDataAction: setShareModalData })(TakeSnapshotButton);

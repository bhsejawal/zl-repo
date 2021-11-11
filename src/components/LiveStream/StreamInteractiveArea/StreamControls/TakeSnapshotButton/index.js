import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { connect } from 'react-redux';
import {
  Button,
  Drop,
  Tip,
  Box,
} from 'grommet';
import { isEmpty } from 'lodash-es';
import {
  useContext,
  useEffect,
  useState,
  useRef,
} from 'preact/hooks';

import RoundButton from 'Components/RoundButton';
import TipContent from 'Components/Tooltip';
import { GlobalsContext } from 'Shared/context';
import { useIsMobileSize } from '../../../../../hooks';
import TakeSnapshotModal from './TakeSnapshotModal';

import style from './style.scss';

let timeout;

const TakeSnapshotButton = ({ plain, cameraId, userId }) => {
  const { socket } = useContext(GlobalsContext);
  const [loading, setLoading] = useState();
  const [tryAgain, setTryAgain] = useState();
  const [snapshotData, setSnapshotData] = useState({});
  const isMobileSize = useIsMobileSize();

  const ref = useRef();

  const clickHandler = () => {
    socket.emit('userTookSnapshot', { cameraId, userId });
    setLoading(true);
    // This is a fallback in case socket didn't return any photo in 8 seconds
    timeout = setTimeout(() => {
      setLoading(false);
      setTryAgain(true);
    }, 8000);
  };

  useEffect(() => {
    const socketHandler = (data = {}) => {
      if (data?.userId === userId) {
        setLoading(false);
        setTryAgain(false);
        clearTimeout(timeout);
        timeout = undefined;
        setSnapshotData(data);
      }
    };

    if (socket) {
      socket.on('snapshotTaken', socketHandler);
    }

    return () => {
      if (socket) {
        socket.off('snapshotTaken', socketHandler);
      }
    }
  }, [isMobileSize, socket, userId]);

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
        {!isEmpty(snapshotData) && (
          <TakeSnapshotModal
            onClose={() => setSnapshotData({})}
            snapshotId={snapshotData.snapshotId}
            htmlURL={snapshotData.html}
            image={snapshotData.snapshot}
          />
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
      <Tip
        dropProps={{ align: { left: 'right' } }}
        content={<TipContent message="Take a Photo" />}
        plain
      >
        <Box>
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
        </Box>
      </Tip>
      {!isEmpty(snapshotData) && (
        <TakeSnapshotModal
          onClose={() => setSnapshotData({})}
          snapshotId={snapshotData.snapshotId}
          htmlURL={snapshotData.html}
          image={snapshotData.snapshot}
        />
      )}
    </div>
  );
};

export default connect(({
  user: { userId },
  habitat: { habitatInfo: { selectedCamera: { _id: cameraId } } },
}) => ({
  userId,
  cameraId,
}))(TakeSnapshotButton);

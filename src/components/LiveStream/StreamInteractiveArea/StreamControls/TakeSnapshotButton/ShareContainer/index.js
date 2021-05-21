import { h } from 'preact';
import { Box, Heading } from 'grommet';
import {
  useContext,
  useEffect,
  useState,
} from 'preact/hooks';

import {
  faTimes,
  faEnvelope,
  faDownload,
  faShareSquare,
  faShareAlt, faCheckCircle,
} from '@fortawesome/pro-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/pro-regular-svg-icons';
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isEmpty, isNil } from 'lodash-es';
import { connect } from 'react-redux';
import useFetch from 'use-http';
import { API_BASE_URL } from 'Shared/fetch';
import { GlobalsContext } from 'Shared/context';
import LiveStreamContext from 'Components/LiveStream/LiveStreamContext';
import { androidDevice, iOSDevice } from '../../../../../../helpers';

import style from './style.scss';
import {showSnapshotShare} from "../../../../../../redux/actions";

export const generateTwitterURL = (html, text, hashtag, handle) => {
  const shareURL = new URL('https://twitter.com/intent/tweet');
  if (!isNil(hashtag) && !isEmpty(hashtag)) {
    shareURL.searchParams.append('hashtags', hashtag);
  }

  if (!isNil(text) && !isEmpty(text)) {
    shareURL.searchParams.append('text', text);
  }

  if (!isNil(handle) && !isEmpty(handle)) {
    shareURL.searchParams.append('via', handle);
  }

  shareURL.searchParams.append('tw_p', 'tweetbutton');
  shareURL.searchParams.append('url', html);
  return shareURL.href;
};

export const generateFacebookURL = (html) => {
  const shareURL = new URL('https://www.facebook.com/sharer/sharer.php');
  shareURL.searchParams.append('u', html);
  return shareURL.href;
};

const ShareContainer = ({ userId, show, showSnapshotShareAction }) => {
  const { videoRef } = useContext(LiveStreamContext);
  const [snapshotData, setSnapshotData] = useState({});
  const [showMainContent, setShowMainContent] = useState(true);
  const { socket } = useContext(GlobalsContext);
  const { error, post, response } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  useEffect(() => {
    if (error || response.ok) {
      setShowMainContent(false);
    }
  }, [error, response, response.ok])

  const closeHandler = () => {
    setSnapshotData({});
    setShowMainContent(true);
    showSnapshotShareAction(false);
  }

  const logShare = (platform) => {
    const source = iOSDevice() || androidDevice() ? 'mobile' : 'desktop';

    socket.emit('logShare', {
      userId,
      room: 'zoolife',
      snapshotId: snapshotData.snapshotId,
      platform,
      source,
    });
  };

  useEffect(() => {
    const socketHandler = (data) => {
      const { userId: snapshotUserId } = data;
      if (snapshotUserId === userId) {
        setSnapshotData(data);
        setShowMainContent(true);
        showSnapshotShareAction(true);
      }
    };

    if (socket) {
      socket.on('snapshotTaken', socketHandler);
    }

    return () => {
      if (socket) {
        setSnapshotData({});
        socket.off('snapshotTaken', socketHandler);
      }
    }
  }, [socket, showSnapshotShareAction]);

  const sendEmail = async () => {
    await post('/email/snapshot', { imageUrl: snapshotData.snapshot });
    setShowMainContent(false);
    logShare('email');
  };

  const webShareHandler = async () => {
    const data = { url: snapshotData.html};
    try {
      await navigator.share(data);
      logShare('webShare');
    } catch (error) {
      console.error('Webshare error');
    }
  };

  if (isEmpty(snapshotData) || !show) {
    return null;
  }

  return (
    <Box
      className={style.shareContainer}
      width={{
        max: `${videoRef?.current.clientHeight - 60}px`,
        min: `${videoRef?.current.clientHeight / 2 - 60}px`,
      }}
    >
      <Box background="var(--hunterGreenMediumLight)">
        <button onClick={closeHandler} type="button" className={style.close}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        {showMainContent && (
          <>
            <Box height={{min: '25px'}} className={style.shareHeader}>
              <Heading color="white" textAlign="center" margin="auto" level="6">Here&apos;s your photo</Heading>
            </Box>
            <img src={snapshotData.snapshot} alt="" className={style.shareImage} />
            <Box height={{min: '25px'}} justify="center" alignContent="center" direction="row" className={style.shareButtons}>
              <button onClick={sendEmail} type="button" className={style.shareIcon}>
                <FontAwesomeIcon icon={faEnvelope} />
              </button>
              <a
                download
                target="_blank"
                rel="noreferrer"
                className={style.shareIcon}
                href={snapshotData.snapshot}
                onClick={() => logShare('download')}
              >
                <FontAwesomeIcon icon={faDownload} />
              </a>
              {(androidDevice() || iOSDevice()) && (
                <button
                  onClick={webShareHandler}
                  type="button"
                  className={style.shareIcon}
                >
                  {androidDevice() && <FontAwesomeIcon icon={faShareAlt} />}
                  {iOSDevice() && <FontAwesomeIcon icon={faShareSquare} />}
                </button>
              )}
              {(!androidDevice() && !iOSDevice()) && (
                <>
                  <a
                    className={style.shareIcon}
                    href={generateFacebookURL(snapshotData.html)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => logShare('facebook')}
                  >
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a
                    className={style.shareIcon}
                    href={generateTwitterURL(snapshotData.html)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => logShare('twitter')}
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                </>
              )}
            </Box>
          </>
        )}
        {!showMainContent && response.data && response.data.success && (
          <Box pad={{horizontal: '20px'}} margin={{top: '35px', bottom: '20px'}}>
            <Heading color="white" textAlign="center" margin="auto" size="50px">
              <FontAwesomeIcon icon={faCheckCircle} />
            </Heading>
            <br />
            <Heading color="white" textAlign="center" margin="auto" level="6">
              The photo has been sent to your account email!
            </Heading>
          </Box>
        )}
        {!showMainContent && error && (
          <Box pad={{horizontal: '20px'}} margin={{top: '35px', bottom: '20px'}}>
            <Heading color="white" textAlign="center" margin="auto" size="50px">
              <FontAwesomeIcon icon={faTimesCircle} />
            </Heading>
            <br />
            <Heading color="white" textAlign="center" margin="auto" level="6">
              Uh oh, something went wrong while sending your photo.
            </Heading>
            <button className={style.retry} type="button" onClick={sendEmail}>Try again!</button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default connect(
  ({
    user: { userId },
    mainStream: { interactionState: { showSnapshotShare } },
  }) => ({ userId, show: showSnapshotShare }),
  { showSnapshotShareAction: showSnapshotShare },
)(ShareContainer);

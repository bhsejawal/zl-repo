import { h } from 'preact';
import { connect } from 'react-redux';
import { useContext, useEffect, useState } from 'preact/hooks';
import { Box, Layer } from 'grommet';
import { isEmpty, isNil } from 'lodash-es';
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faEnvelope,
  faDownload,
  faShareSquare,
  faShareAlt,
  faChevronRight,
  faChevronLeft,
  faCheck,
} from '@fortawesome/pro-solid-svg-icons';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import useFetch from 'use-http';

import ErrorModal from 'Components/modals/Error';
import { API_BASE_URL } from 'Shared/fetch';
import { GlobalsContext } from 'Shared/context';
import { closeShareModal, setShareModalMediaId } from './actions';
import { androidDevice, iOSDevice } from '../../../../helpers';

import style from './style.scss';

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

const ShareModal = ({
  userId,
  animal,
  zoo,
  open,
  data,
  nextId,
  prevId,
  cameraId,
  closeShareModalAction,
  setShareModalMediaIdAction,
}) => {
  const {
    _id,
    htmlURL,
    url,
    videoURL,
  } = data
  const { socket } = useContext(GlobalsContext);
  const [showEmailError, setShowEmailError] = useState();
  const [showEmailSuccess, setShowEmailSuccess] = useState();
  const {
    error,
    post,
    response,
    loading,
  } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  useEffect(() => {
    if (error) {
      setShowEmailError(true);
    } else if (response.ok) {
      setShowEmailSuccess(true);
      setTimeout(setShowEmailSuccess, 2000);
    }
  }, [error, response, response.ok]);

  useEffect(() => {
    setShowEmailError(false);
    setShowEmailSuccess(false);
  }, [_id]);

  const logShare = (platform) => {
    const source = iOSDevice() || androidDevice() ? 'mobile' : 'desktop';

    socket.emit('logShare', {
      userId,
      room: 'zoolife',
      snapshotId: _id,
      cameraId,
      platform,
      source,
    });
  };

  const sendEmail = async () => {
    await post('/email/snapshot', { imageUrl: url });
    logShare('email');
  };

  const webShareHandler = async () => {
    const data = { url: htmlURL};
    try {
      await navigator.share(data);
      logShare('webShare');
    } catch (error) {
      console.error('Webshare error');
    }
  };

  if (!open) {
    return null;
  }

  return (
    <Layer
      background="transparent"
      animation="fadeIn"
      position="center"
      onClickOutside={closeShareModalAction}
      onEsc={closeShareModalAction}
    >
      <Box className={style.shareModalContainer}>
        <Box>
          <button onClick={closeShareModalAction} type="button" className={style.close}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <Box className={style.shareMedia} >
            {nextId && (
              <button
                type="button"
                className={style.next}
                onClick={() => setShareModalMediaIdAction(nextId)}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            )}
            {prevId && (
              <button
                type="button"
                className={style.prev}
                onClick={() => setShareModalMediaIdAction(prevId)}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            )}
            {url && <img src={url} alt="" />}
            {videoURL && (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video key={videoURL} playsInline controls>
                <source src={videoURL} type="video/mp4" />
              </video>
            )}
          </Box>
          <Box className={style.footer}>
            <div>
              {`${zoo} | ${animal}`}
            </div>
            <div className={style.shareButtons}>
              {!videoURL && (
                <button
                  onClick={sendEmail}
                  type="button"
                  className={style.shareIcon}
                  disabled={loading || showEmailSuccess}
                >
                  {!loading && <FontAwesomeIcon icon={showEmailSuccess ? faCheck : faEnvelope} />}
                  {loading && <FontAwesomeIcon icon={faSpinner} spin />}
                </button>
              )}
              <a
                download
                target="_blank"
                rel="noreferrer"
                className={style.shareIcon}
                href={url || videoURL}
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
              {(htmlURL && !androidDevice() && !iOSDevice()) && (
                <>
                  <a
                    className={style.shareIcon}
                    href={generateFacebookURL(htmlURL)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => logShare('facebook')}
                  >
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a
                    className={style.shareIcon}
                    href={generateTwitterURL(htmlURL)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => logShare('twitter')}
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                </>
              )}
            </div>
          </Box>
        </Box>
      </Box>
      {showEmailError && <ErrorModal onClose={() => setShowEmailError(false)} />}
    </Layer>
  );
};

export default connect(
  ({
    user: { userId },
    habitat: {
      habitatInfo: {
        animal,
        zoo: { name: zoo } = {},
        camera: { _id: cameraId } = {},
      },
      shareModal: {
        open,
        nextId,
        prevId,
        data,
      },
    },
  }) => ({
    userId,
    animal,
    zoo,
    nextId,
    prevId,
    open,
    data,
    cameraId,
  }),
  { closeShareModalAction: closeShareModal, setShareModalMediaIdAction: setShareModalMediaId },
)(ShareModal);

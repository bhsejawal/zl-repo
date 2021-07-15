import { useEffect, useState } from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import { Box, Layer, Text } from 'grommet';
import { isEmpty, isNil } from 'lodash-es';
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faDownload,
  faShareSquare,
  faShareAlt,
  faChevronRight,
  faChevronLeft,
  faCheck,
  faHeart,
} from '@fortawesome/pro-solid-svg-icons';
import { connect } from 'react-redux';
import { faHeart as faHeartOutline } from '@fortawesome/pro-light-svg-icons';
import useFetch from 'use-http';
import classnames from 'classnames';
import { formatDistanceToNow } from 'date-fns';

import ErrorModal from 'Components/modals/Error';
import CloseButton from 'Components/modals/CloseButton';
import AnimalIcon from 'Components/AnimalIcon';
import RoundButton from 'Components/RoundButton';

import { API_BASE_URL } from 'Shared/fetch';
import { getDeviceType, androidDevice, iOSDevice } from '../../helpers';
import { useIsMobileSize } from '../../hooks';

import style from './style.scss';

const Chat = lazy(() => import('Components/Chat'));

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
  mediaId,
  userId,
  open,
  data,
  nextId,
  prevId,
  onClose,
  setShareModalMediaId,
  habitat,
}) => {
  const {
    _id,
    url,
    videoURL,
    type = 'photo',
    habitatId,
    isLiked,
    usersLike,
    createdAt,
    creationDate,
    username,
    profile,
    title,
  } = data;

  const shareUrl = `${window.location.origin}/album/${videoURL ? 'videos' : 'photos'}/${_id}`;
  const isMobileSize = useIsMobileSize();
  const [showEmailError, setShowEmailError] = useState();
  const [showEmailSuccess, setShowEmailSuccess] = useState();
  const [contentLikes, setContentLikes] = useState({ isLiked: false, likes: 0 });

  useEffect(() => {
    setContentLikes({ isLiked, likes: usersLike });
  }, [isLiked, usersLike]);
  const {
    error,
    post,
    response,
    loading,
  } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  const {
    post: sharePost,
  } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  const { put: likePut } = useFetch(API_BASE_URL, { credentials: 'include', cachePolicy: 'no-cache '});

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

  const logShare = (platform) => sharePost('/logs/share', {
    userId,
    mediaId: _id,
    mediaType: type,
    platform,
    deviceType: getDeviceType(),
    applicationPath: document.location.pathname.startsWith('/h') ? 'habitat' : 'publicAlbum',
    habitatId: habitatId || habitat,
  });

  const sendEmail = async () => {
    await post('/email/snapshot', { imageUrl: url });
    logShare('email');
  };

  const webShareHandler = async () => {
    const data = { url: shareUrl };
    try {
      await navigator.share(data);
      logShare('webShare');
    } catch (error) {
      console.error('Webshare error');
    }
  };

  const likeContent = async () => {
    try {
      await likePut(`${type === 'photo' ? 'photos' : 'videos'}/${mediaId}/like`);
      setContentLikes( (prevState) => ({
        isLiked: !prevState.isLiked,
        likes: prevState.isLiked ? prevState.likes - 1 : prevState.likes + 1,
      }));
    } catch (err) {
      console.error('Error trying to like content');
    }
  }

  if (!open) {
    return null;
  }

  return (
    <Layer
      animation="fadeIn"
      position="center"
      onClickOutside={onClose}
      onEsc={onClose}
      margin={{ horizontal: isMobileSize ? '0px' : '70px' }}
      full={isMobileSize}

    >
      <>
        <div className={classnames(style.absoluteClose, {[style.mobile]: isMobileSize })}>
          <CloseButton
            onClick={onClose}
            className={style.close}
          />
        </div>
        {!videoURL && userId === data?.userId && (
          <div className={style.title}>Here’s your photo!</div>
        )}
        {nextId && (
          <button
            type="button"
            className={classnames(style.next, {[style.mobile]: isMobileSize } )}
            onClick={() => setShareModalMediaId(nextId)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}
        {prevId && (
          <button
            type="button"
            className={classnames(style.prev, {[style.mobile]: isMobileSize } )}
            onClick={() => setShareModalMediaId(prevId)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        )}
      </>
      <Box className={classnames(style.shareModalContainer, { [style.mobile]: isMobileSize })}>
        <Box direction="row">
          <Box className={style.shareMedia} >
            {url && <img src={url} alt="" />}
            {videoURL && (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video key={videoURL} playsInline controls>
                <source src={videoURL} type="video/mp4" />
              </video>
            )}
          </Box>
          <Box width={{ min: '285px' }} background="white" className={style.rightSection}>
            <Box
              direction="row"
              pad={{ horizontal: '22px', top: '22px'}}
              height={{ min: '62px' }}
            >
              <Box margin={{ right: '20px' }} align="center" justify="center">
                <AnimalIcon width={35} animalIcon={profile?.animal} color={profile?.color} />
              </Box>

              <Box>
                <Text size="xlarge" weight={700}>{username}</Text>
                <Text>{`${formatDistanceToNow(new Date(createdAt || creationDate))} ago`}</Text>
              </Box>
            </Box>
            <Box
              pad={{ horizontal: '22px', vertical: '15px' }}
              height={{ min: '32px' }}
              className={style.mediaTitle}
            >
              <Text>
                {title}
              </Text>
            </Box>
            <Box
              direction="row"
              pad={{ left: '20px', right: '14px', vertical: '6px' }}
              fill="horizontal"
              border={{
                color: '#EBEBEB',
                size: '1px',
                style: 'solid',
                side: 'horizontal',
              }}
              height={{ min: '34px' }}
            >
              <Box direction="row" align="center">
                <Box
                  className={classnames(
                    style.heartContainer,
                    {[style.liked]: contentLikes.isLiked},
                  )}
                  onClick={likeContent}
                >
                  <FontAwesomeIcon icon={contentLikes.isLiked ? faHeart : faHeartOutline} />
                </Box>
                <Text margin={{ left: '8px' }}>
                  {contentLikes.likes}
                </Text>
              </Box>
              <div className={style.shareButtons}>
                {!videoURL && (
                  <RoundButton
                    onClick={sendEmail}
                    className={style.shareIcon}
                    disabled={loading || showEmailSuccess}
                    backgroundColor="#F18C43"
                    color="white"
                    width={20}
                    loading={loading}
                  >
                    {!loading && <FontAwesomeIcon icon={showEmailSuccess ? faCheck : faEnvelope} />}
                  </RoundButton>
                )}
                <RoundButton
                  type="button"
                  backgroundColor="#71475D"
                  color="white"
                  width={20}
                  className={style.shareIcon}
                >
                  <a
                    download
                    target="_blank"
                    rel="noreferrer"
                    href={url || videoURL}
                    onClick={() => logShare('download')}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </a>
                </RoundButton>
                {(androidDevice() || iOSDevice()) && (
                  <RoundButton
                    onClick={webShareHandler}
                    type="button"
                    className={style.shareIcon}
                    backgroundColor="#1DA1F2"
                    color="white"
                    width={20}
                  >
                    {androidDevice() && <FontAwesomeIcon icon={faShareAlt} />}
                    {iOSDevice() && <FontAwesomeIcon icon={faShareSquare} />}
                  </RoundButton>
                )}
                {!androidDevice() && !iOSDevice() && (
                  <>
                    <RoundButton
                      type="button"
                      backgroundColor="#2174EE"
                      color="white"
                      width={20}
                      className={style.shareIcon}
                    >
                      <a
                        href={generateFacebookURL(shareUrl)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => logShare('facebook')}
                      >
                        <FontAwesomeIcon icon={faFacebookF} />
                      </a>
                    </RoundButton>
                    <RoundButton
                      type="button"
                      backgroundColor="#1DA1F2"
                      color="white"
                      width={20}
                      className={style.shareIcon}
                    >
                      <a
                        href={generateTwitterURL(shareUrl)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => logShare('twitter')}
                      >
                        <FontAwesomeIcon icon={faTwitter} />
                      </a>
                    </RoundButton>
                  </>
                )}
              </div>
            </Box>
            <Box className={style.commentSection}>
              <Box fill>
                {typeof window !== 'undefined' && mediaId && (
                  <Suspense>
                    <Chat channelId={mediaId} alternate />
                  </Suspense>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {showEmailError && <ErrorModal onClose={() => setShowEmailError(false)} />}
    </Layer>
  );
};

export default connect(({ habitat: { shareModal: { mediaId }}}) => ({ mediaId }))(ShareModal);

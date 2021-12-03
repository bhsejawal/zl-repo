import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faReddit } from '@fortawesome/free-brands-svg-icons';
import { faDownload } from '@fortawesome/pro-solid-svg-icons';
import { Box, Heading, Text } from 'grommet';
import classnames from 'classnames';
import useFetch from 'use-http';

import { PrimaryButton } from 'Components/Buttons';
import { generateFacebookURL, generateTwitterURL, generateRedditURL } from 'Components/ShareModal/Modal';
import { API_BASE_URL } from 'Shared/fetch';
// import EmailShare from './EmailShare';
import { getDeviceType } from '../../../../../../helpers';

import style from './style.scss';

const ShareContent = ({
  videoURL,
  htmlURL,
  title,
  mediaId,
  userId,
  habitatId,
  cameraId,
}) => {
  const { post: sharePost } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });

  const logShare = (platform) => sharePost('/logs/share', {
    userId,
    mediaId,
    mediaType: 'clip',
    platform,
    deviceType: getDeviceType(),
    habitatId,
    cameraId,
    applicationPath: 'habitat',
  });

  const copyToClipboardBtnHandler = async () => {
    try {
      await navigator.clipboard.writeText(videoURL);
    } catch (err) {
      console.error('Unable to copy to clipboard');
    }
  };

  return (
    <Box className={classnames(style.contentContainer, style.contentShare)}>
      <Box className={style.leftSection}>
        <div className={style.videoWrapper}>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video controls src={videoURL} />
        </div>
      </Box>
      <Box className={style.rightSection}>
        <Text size="xlarge">
          Here’s your clip for the highlight reel!
        </Text>

        <Heading level="3" margin={{ top: '20px', bottom: '0px' }}>{title}</Heading>

        <Box className={style.shareMedia}>
          <a
            className={style.facebook}
            href={generateFacebookURL(htmlURL)}
            target="_blank"
            rel="noreferrer"
            onClick={() => logShare('facebook')}
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>

          <a
            className={style.twitter}
            href={generateTwitterURL(htmlURL)}
            target="_blank"
            rel="noreferrer"
            onClick={() => logShare('twitter')}
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>

          <a
            className={style.reddit}
            href={generateRedditURL(htmlURL, title)}
            target="_blank"
            rel="noreferrer"
            onClick={() => logShare('reddit')}
          >
            <FontAwesomeIcon icon={faReddit} />
          </a>

          <a
            download
            target="_blank"
            rel="noreferrer"
            className={style.download}
            href={videoURL}
            onClick={() => logShare('download')}
          >
            <FontAwesomeIcon icon={faDownload} />
          </a>
          {/* This will be disabled until we have an email template and API for video share */}
          {/* eslint-disable-next-line max-len */}
          {/* <EmailShare videoURL={videoURL} logShare={() => logShare('email')} className={style.email} /> */}
        </Box>

        <Box className={style.copyText}>
          <input
            value={videoURL}
            disabled
            readOnly
          />
          <PrimaryButton size="small" label="Copy Link" onClick={copyToClipboardBtnHandler} />
        </Box>
      </Box>
    </Box>
  )
};

export default connect(({
  user: { userId },
  habitat: { habitatInfo: { _id: habitatId, camera: { _id: cameraId } }},
}) => ({ userId, habitatId, cameraId }))(ShareContent);

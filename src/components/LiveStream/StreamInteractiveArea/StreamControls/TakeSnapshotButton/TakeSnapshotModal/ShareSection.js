import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faDownload } from '@fortawesome/pro-solid-svg-icons';
import { Box, Heading, Text } from 'grommet';
import useFetch from 'use-http';
import classnames from 'classnames';

import { PrimaryButton } from 'Components/Buttons';
import { generateFacebookURL, generateTwitterURL } from 'Components/ShareModal/Modal';
import { API_BASE_URL } from 'Shared/fetch';
import EmailShare from './EmailShare';
import { getDeviceType } from '../../../../../../helpers';

import style from './style.scss';

const ShareSection = ({
  imageURL,
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
    mediaType: 'image',
    platform,
    deviceType: getDeviceType(),
    habitatId,
    cameraId,
    applicationPath: 'habitat',
  });

  const copyToClipboardBtnHandler = async () => {
    try {
      await navigator.clipboard.writeText(imageURL);
    } catch (err) {
      console.error('Unable to copy to clipboard');
    }
  };

  return (
    <div className={classnames(style.shareSection, style.rightSection)}>
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
          download
          target="_blank"
          rel="noreferrer"
          className={style.download}
          href={imageURL}
          onClick={() => logShare('download')}
        >
          <FontAwesomeIcon icon={faDownload} />
        </a>
        <EmailShare imageUrl={imageURL} logShare={() => logShare('email')} className={style.email} />
      </Box>

      <Box className={style.copyText}>
        <input
          value={imageURL}
          disabled
          readOnly
        />
        <PrimaryButton size="small" label="Copy Link" onClick={copyToClipboardBtnHandler} />
      </Box>
    </div>
  )
};

export default connect(({
  user: { userId },
  habitat: { habitatInfo: { _id: habitatId, camera: { _id: cameraId } }},
}) => ({ userId, habitatId, cameraId }))(ShareSection);

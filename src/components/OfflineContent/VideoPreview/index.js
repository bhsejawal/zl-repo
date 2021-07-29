import { Text, Heading } from 'grommet';

import { useIsMobileSize } from '../../../hooks';

import style from './style.scss';

const VideoPreview = ({
  previewURL,
  videoId,
  onClick,
  title,
}) => {
  const isMobile = useIsMobileSize();
  return (
    <div className={style.videoPreviewContainer} onClick={() => onClick(videoId)}>
      <img
        src={previewURL}
        alt="Preview for clip"
      />
      <div className={style.textWrapper}>
        {!isMobile && (
          <Heading
            level="4"
            color="white"
            textAlign="center"
            margin={{ vertical: '10px' }}
          >
            {title}
          </Heading>
        )}
        {isMobile && (
          <Text color="white" size="large" textAlign="center" margin={{ vertical: '8px' }}>
            {title}
          </Text>
        )}
      </div>
    </div>
  );
};

export default VideoPreview;

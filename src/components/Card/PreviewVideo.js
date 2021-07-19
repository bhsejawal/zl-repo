import { h } from 'preact';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { logGAEvent } from 'Shared/ga';
import { useIsHabitatTabbed, useIsMobileSize } from '../../hooks';

import style from './style.scss';

const PreviewVideo = ({ videoUrl, habitatId }) => {
  const isTabbed = useIsHabitatTabbed();
  const isSmallScreen = useIsMobileSize();

  if (isTabbed || isSmallScreen) {
    return null;
  }

  const onPlayHandler = () => {
    logGAEvent(
      'habitat-preview-video',
      'play',
      habitatId,
    )
  }

  return (
    <div className={classnames(style.card, style.videoCard)}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video src={videoUrl} controls playsInline onPlay={onPlayHandler} />
    </div>
  );
};

export default connect((
  { habitat: { habitatInfo: { _id: habitatId, isHostStreamOn, hostStreamKey } }},
) => (
  { isHostStreamOn, hostStreamKey, habitatId}
))(PreviewVideo);

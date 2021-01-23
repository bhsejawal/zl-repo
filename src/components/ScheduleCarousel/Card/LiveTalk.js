import { h } from 'preact';
import { createRef } from 'preact/compat';
import classnames from 'classnames';
import VideoControls from '../../VideoControls';
import LiveStream from '../../LiveStream';

import style from './style.scss';

const LiveTalk = ({
  streamId,
  description,
  name,
  disabled,
}) => {
  if (disabled) {
    return null;
  }

  const videoRef = createRef();

  return (
    <div className={classnames(style.card, style.liveTalk)}>
      <LiveStream ref={videoRef} width="auto" height="140px" streamId={streamId} />

      {(description || name) && (
        <div className={style.bottomSection}>
          {description && <p>{description}</p>}
          {name && <span>{name}</span>}
        </div>
      )}

      <VideoControls ref={videoRef} streamId={streamId} />
    </div>
  );
};

export default LiveTalk;

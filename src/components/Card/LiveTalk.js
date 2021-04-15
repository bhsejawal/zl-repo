import { h } from 'preact';
import { createRef } from 'preact/compat';
import classnames from 'classnames';
import LiveStream from '../LiveStream';

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
      <LiveStream
        ref={videoRef}
        width="auto"
        height="140px"
        streamId={streamId}
        // Custom controls is bugged, removing it for now
        // customControls
        mode="liveTalk"
      />
      {(description || name) && (
        <div className={style.bottomSection}>
          {description && <p>{description}</p>}
          {name && <span>{name}</span>}
        </div>
      )}
    </div>
  );
};

export default LiveTalk;

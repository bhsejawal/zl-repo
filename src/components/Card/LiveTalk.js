import { h } from 'preact';
import { connect } from 'react-redux';
import classnames from 'classnames';

import LiveStream from '../LiveStream';

import { useIsHabitatTabbed, useIsMobileSize } from '../../hooks';

import style from './style.scss';

const LiveTalk = ({
  hostStreamKey,
  isHostStreamOn,
  description,
  name,
  disabled,
}) => {
  const isMobileView = useIsHabitatTabbed();
  const isSmallScreen = useIsMobileSize();

  if (disabled) {
    return null;
  }
  return (
    <div className={classnames(style.card, style.liveTalk, {
      [style.tablet]: isMobileView, [style.phone]: isSmallScreen,
    })}>
      <LiveStream
        width="auto"
        height="140px"
        streamId={hostStreamKey}
        isStreamOn={isHostStreamOn}
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

export default connect((
  { habitat: { habitatInfo: { isHostStreamOn, hostStreamKey } }},
) => (
  { isHostStreamOn, hostStreamKey}
))(LiveTalk);

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
  size,
}) => {
  const isMobileView = useIsHabitatTabbed();
  const isSmallScreen = useIsMobileSize();

  return (
    <div className={classnames(style.liveTalk, {
      [style.tablet]: isMobileView, [style.phone]: isSmallScreen,
    })}>
      <LiveStream
        streamId={hostStreamKey}
        isStreamOn={isHostStreamOn}
        mode="liveTalk"
        width={size}
        height={size}
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

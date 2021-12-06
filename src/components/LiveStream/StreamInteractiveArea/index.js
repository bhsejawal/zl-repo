import { h } from 'preact';
import { connect } from 'react-redux';

import WeatherWidget from 'Components/WeatherWidget';
import StreamInteractions from './StreamInteractions';
import StreamControls from './StreamControls';
import InteractiveAreaHandler from './InteractiveAreaHandler';

import { addUserInteraction } from '../../../redux/actions';
import EmojiBubbles from './EmojiBubbles';
import { useShowMobileControls } from '../../../hooks';

const StreamInteractiveArea = ({ isFullscreen }) => {
  const showMobileControls = useShowMobileControls();

  return (
    <>
      {!showMobileControls && <StreamControls isFullscreen={isFullscreen} />}
      <StreamInteractions />
      <InteractiveAreaHandler />
      <WeatherWidget />
      <EmojiBubbles />
    </>
  );
};

export default connect(null, {
  addUserInteractionAction: addUserInteraction,
})(StreamInteractiveArea);

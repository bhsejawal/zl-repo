import { h } from 'preact';
import { connect } from 'react-redux';

import WeatherWidget from 'Components/WeatherWidget';
import StreamInteractions from './StreamInteractions';
import StreamControls from './StreamControls';
import InteractiveAreaHandler from './InteractiveAreaHandler';

import { addUserInteraction } from '../../../redux/actions';
import { useIsMobileSize } from '../../../hooks';
import EmojiBubbles from './EmojiBubbles';

const StreamInteractiveArea = () => {
  const isMobileSize = useIsMobileSize();

  return (
    <>
      {!isMobileSize && <StreamControls />}
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

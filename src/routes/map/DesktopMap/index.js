import { h } from 'preact';
import { connect } from 'react-redux';
import { Box } from 'grommet';

import { OutlineButton } from 'Components/Buttons';
import Can from 'Components/Authorize';

import HabitatMap from './HabitatMap'
import HabitatModal from './HabitatModal';

import { toggleMapModal, setEditHabitat } from '../actions';

import style from '../style.scss';

const DesktopMap = ({
  showMapModal,
  onShowTrailer,
  toggleMapModalAction,
  setEditHabitatAction,
}) => {
  const handleMapButton = () => {
    setEditHabitatAction(null);
    toggleMapModalAction();
  };

  return (
    <div className={style.map}>
      <div className={style.content}>
        <Box fill="horizontal" margin={{ vertical: 'auto'}}>
          <Can
            perform="maps:edit"
            yes={() => (
              <Box width="170px" alignSelf="end" margin={{ top: '24px' }}>
                <OutlineButton label="Map Settings" onClick={handleMapButton} />
              </Box>
            )}
          />
          <HabitatMap onShowTrailer={onShowTrailer} />
        </Box>
      </div>

      {showMapModal && <HabitatModal />}
    </div>
  );
};
export default connect(
  ({
    allHabitats,
    map: {
      activeHabitatId,
      showMapModal,
    },
  }) => ({
    allHabitats,
    activeHabitatId,
    showMapModal,
  }),
  {
    toggleMapModalAction: toggleMapModal,
    setEditHabitatAction: setEditHabitat,
  },
)(DesktopMap);

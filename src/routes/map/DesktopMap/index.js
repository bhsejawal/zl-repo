import { h } from 'preact';
import { connect } from 'react-redux';
import { Box, Heading } from 'grommet';

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
        <Box
          align="center"
          justify="center"
          background={{ color: 'var(--oliveMedium)' }}
          height="40px"
        >
          <Heading margin="0" level="4">The animal kingdom awaits! Select a habitat to explore.</Heading>
        </Box>
        <Box fill="horizontal" margin={{ vertical: 'auto'}}>
          <HabitatMap onShowTrailer={onShowTrailer} />
        </Box>

        <Can
          perform="maps:edit"
          yes={() => (
            <Box className={style.settingContainer}>
              <div>
                <OutlineButton label="Map Settings" onClick={handleMapButton} />
              </div>
            </Box>
          )}
        />
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

import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { connect } from 'react-redux';
import { Heading, Text, Box } from 'grommet';
import classnames from 'classnames';

import { OutlineButton } from 'Components/Buttons';
import EditButton from 'Components/AdminEditWrappers/EditButton';
import HabitatCard from 'Components/HabitatCard';
import Can from 'Components/Authorize';
import HabitatsUpdater from 'Components/HabitatsUpdater';

import HabitatMap from './HabitatMap'
import HabitatModal from './HabitatModal';

import { toggleMapModal, setEditHabitat } from './actions';
import { useIsMobileSize } from '../../hooks';

import style from './style.scss';

const Map = ({
  allHabitats,
  showMapModal,
  activeHabitatId,
  toggleMapModalAction,
  setEditHabitatAction,
}) => {
  const isMobileSize = useIsMobileSize();

  const activeHabitat = useMemo(
    () => allHabitats.find(({ _id }) => _id === activeHabitatId),
    [allHabitats, activeHabitatId],
  );

  const handleEditButton = () => {
    setEditHabitatAction(activeHabitat);
    toggleMapModalAction();
  };

  const handleMapButton = () => {
    setEditHabitatAction(null);
    toggleMapModalAction();
  };

  return (
    <div className={style.map}>
      <div className={style.content}>
        <div className={classnames(style.description, {[style.habitatSelected]: activeHabitat })}>
          <div>
            <Heading margin={{ top: '0' }} level="1">Explore the animal kingdom.</Heading>
            <Text size="xlarge">
              Choose a habitat to visit.
            </Text>
          </div>
          <div style={{ position: 'relative', width: 'fit-content', marginTop: '25px' }}>
            {activeHabitat && (
              <>
                <Can
                  perform="maps:edit"
                  yes={() => !isMobileSize && <EditButton onClick={handleEditButton} />}
                />
                <HabitatCard
                  className={style.card}
                  slug={activeHabitat.slug}
                  zooSlug={activeHabitat.zoo?.slug}
                  online={activeHabitat.online}
                  liveTalk={activeHabitat.liveTalk}
                  title={activeHabitat.title}
                  description={activeHabitat.description}
                  image={activeHabitat.wideImage}
                  logo={activeHabitat.zoo?.logo}
                  habitatId={activeHabitat._id}
                />
              </>
            )}
          </div>
        </div>
        <Box fill="horizontal">
          <Can
            perform="maps:edit"
            yes={() => (
              <Box width="170px" alignSelf="end" margin={{ top: '24px' }}>
                <OutlineButton label="Map Settings" onClick={handleMapButton} />
              </Box>
            )}
          />
          <HabitatMap />
        </Box>
      </div>

      {showMapModal && <HabitatModal />}
      <HabitatsUpdater />
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
)(Map);

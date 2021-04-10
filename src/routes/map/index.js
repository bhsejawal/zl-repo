import { h } from 'preact';
import { connect } from 'react-redux';
import { Heading, Text, Box } from 'grommet';
import classnames from 'classnames';

import { OutlineButton } from 'Components/Buttons';
import EditButton from 'Components/AdminEditWrappers/EditButton';
import HabitatCard from 'Components/HabitatCard';
import Header from 'Components/Header';
import Can from 'Components/Authorize';

import HabitatMap from './HabitatMap'
import HabitatModal from './HabitatModal';

import { toggleMapModal, selectEditHabitat } from './actions';

import style from './style.scss';

const Map = ({
  showMapModal,
  activeHabitat,
  toggleMapModalAction,
  selectEditHabitatAction,
}) => {
  const handleEditButton = () => {
    selectEditHabitatAction(activeHabitat._id);
    toggleMapModalAction();
  }

  const handleMapButton = () => {
    selectEditHabitatAction(null);
    toggleMapModalAction();
  }

  return (
    <>
      <Header />
      <div className={style.map} style={{ paddingTop: '60px' }}>
        <div className={style.content}>
          <div className={classnames(style.description, {[style.habitatSelected]: activeHabitat })}>
            <div>
              <Heading level="1">Explore the animal kingdom.</Heading>
              <Text size="xlarge">
                Choose a habitat to visit
              </Text>
            </div>
            <div style={{ position: 'relative', width: 'fit-content', marginTop: '45px' }}>
              {activeHabitat && (
                <>
                  <Can
                    perform="maps:edit"
                    yes={() => <EditButton onClick={handleEditButton} />}
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
                <Box width="170px" alignSelf="end" margin={{ top: '24px', right: '22px' }}>
                  <OutlineButton label="Map Settings" onClick={handleMapButton} />
                </Box>
              )}
            />
            <HabitatMap />
          </Box>
        </div>
      </div>
      {showMapModal && <HabitatModal />}
    </>
  );
};
export default connect(
  ({
    map: {
      activeHabitat,
      habitats,
      showMapModal,
    },
  }) => ({
    activeHabitat,
    habitats,
    showMapModal,
  }),
  {
    toggleMapModalAction: toggleMapModal,
    selectEditHabitatAction: selectEditHabitat,
  },
)(Map);

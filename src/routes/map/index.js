import { h } from 'preact';
import { connect } from 'react-redux';
import { Heading, Text } from 'grommet';

import Header from 'Components/Header';
import HabitatMap from './HabitatMap'
import HabitatCard from '../../components/HabitatCard';

import style from './style.scss';

const Map = ({ activeHabitat }) => (
  <>
    <Header />
    <div className={style.map} style={{ paddingTop: '60px' }}>
      <div className={style.content}>
        <div className={style.description}>
          <div>
            <Heading level="1">Explore the animal kingdom.</Heading>
            <Text size="xlarge">
              Visit animals in their habitats, all over the world. Start by selecting an animal!
            </Text>
          </div>
          <div>
            {activeHabitat && (
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
              />
            )}
          </div>
        </div>

        <HabitatMap />
      </div>
    </div>
  </>
);

export default connect(
  ({
    map: {
      activeHabitat,
      habitats,
    },
  }) => ({
    activeHabitat,
    habitats,
  }),
)(Map);

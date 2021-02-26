import { h } from 'preact';
import { connect } from 'react-redux';

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
            <h1>Explore the animal kingdom.</h1>
            <p>
              Visit animals in their habitats, all over the world. Start by selecting an animal!
            </p>
          </div>
          <div>
            {activeHabitat && (
              <HabitatCard
                className={style.card}
                slug={activeHabitat.slug}
                zooSlug={activeHabitat.zoo?.slug}
                online={activeHabitat.online}
                liveTalk={activeHabitat.liveTalk}
                title={activeHabitat.animal}
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

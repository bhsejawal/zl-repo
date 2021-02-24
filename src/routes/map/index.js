import { h } from 'preact';
import { connect } from 'react-redux';

import HabitatMap from 'Components/HabitatMap'
import Header from 'Components/Header';
import HabitatCard from '../../components/HabitatCard';

import style from './style.scss';

const Map = ({ activeHabitatId, habitats }) => {
  const habitatData = habitats.find(({ id }) => id === activeHabitatId);
  const { online, liveTalk, card } = habitatData || {};

  return (
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
              {habitatData && (
                <HabitatCard
                  className={style.card}
                  online={online}
                  liveTalk={liveTalk}
                  card={card}
                />
              )}
            </div>
          </div>
          <HabitatMap />
        </div>
      </div>
    </>
  );
};

export default connect(
  ({
    map: {
      activeHabitat: activeHabitatId,
      habitats,
    },
  }) => ({
    activeHabitatId,
    habitats,
  }),
)(Map);

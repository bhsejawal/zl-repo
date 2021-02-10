import { h } from 'preact';

import HabitatMap from 'Components/HabitatMap'
import Header from 'Components/Header';

import MapCard from './MapCard';
import style from './style.scss';

const Map = () => (
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
            <MapCard />
          </div>
        </div>
        <HabitatMap />
      </div>
    </div>
  </>
);

export default Map;

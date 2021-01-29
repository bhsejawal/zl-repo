import { h } from 'preact';
import HabitatMap from '../../components/HabitatMap'

import style from './style.scss';

const Map = () => (
  <div className={style.map}>
    <div className={style.content}>
      <div className={style.description}>
        <h1>Explore the animal kingdom.</h1>
        <p>Visit animals in their habitats, all over the world. Start by selecting an animal!</p>
      </div>
      <HabitatMap />
    </div>
  </div>
);

export default Map;

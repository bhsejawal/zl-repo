import { Image } from 'grommet';

import style from './style.scss';

const HabitatImage = ({ image }) => (
  // We need to load this from the habitats
  <Image src={image} className={style.habitatImage} />
)

export default HabitatImage;

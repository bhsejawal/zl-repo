import { Image } from 'grommet';

import style from './style.scss';

const HabitatImage = ({ image }) => (<Image src={image} className={style.habitatImage} />)

export default HabitatImage;

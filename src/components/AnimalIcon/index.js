import { h } from 'preact';
import { connect } from 'react-redux';

import style from './style.scss';

const AnimalIcon = ({
  animalIcon,
  color,
  width = 30,
}) => {
  if (!animalIcon) {
    // TODO: display loading indicator maybe if this is possible
    return null;
  }

  return (
    <div
      style={{ backgroundColor: color, width, height: width }}
      className={style.animalIcon}
    >
      <img src={animalIcon} alt="animal" />
    </div>
  )
}

export default connect(
  ({ user: { profile: { animalIcon, color } } }) => ({ animalIcon, color }),
)(AnimalIcon);

import { h } from 'preact';
import { connect } from 'react-redux';

import style from './style.scss';

import { getIcon } from './helpers';

const AnimalIcon = ({
  animal,
  color,
  width = 30,
}) => {
  if (!animal) {
    return null;
  }

  return (
    <div
      style={{ backgroundColor: color, width, height: width }}
      className={style.animalIcon}
    >
      <svg viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={getIcon(animal)} fill="white" />
      </svg>
    </div>
  )
}

export default connect(
  ({ user: { viewer: { animal, color } } }) => ({ animal, color }),
)(AnimalIcon);

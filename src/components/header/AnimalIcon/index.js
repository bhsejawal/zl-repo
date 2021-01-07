import { h } from 'preact';
import { connect } from 'react-redux';

import style from './style.scss';

import { getIcon } from './helpers';

const AnimalIcon = ({ animal, color }) => {
  if (!animal) {
    return null;
  }

  return (
    <div
      style={{ backgroundColor: color }}
      className={style.animalIcon}
    >
      <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={getIcon(animal)} fill="white" />
      </svg>
    </div>
  )
}

export default connect(({ user: { animal, color } }) => ({ animal, color }))(AnimalIcon);

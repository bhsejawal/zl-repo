import { h } from 'preact';
import { connect } from 'react-redux';
import { route } from 'preact-router';

import style from './style.scss';

const AnimalIcon = ({
  logged,
  animalIcon,
  color,
  width = 30,
}) => {
  if (!animalIcon) {
    if (!logged) {
      return null
    }
    // If profile is not defined and header is being shown, redirect user to the
    // account page to set it up
    route('/profile', true);
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
  ({ user: { profile: { animalIcon, color } = {}, logged } }) => ({ animalIcon, color, logged }),
)(AnimalIcon);

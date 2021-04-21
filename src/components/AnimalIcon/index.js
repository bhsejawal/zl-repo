import { h } from 'preact';
import { connect } from 'react-redux';
import { route } from 'preact-router';
import { useMemo } from 'preact/hooks';

import { getIconUrl, getIconKeys } from 'Shared/profileIcons';

import style from './style.scss';

const AnimalIcon = ({
  logged,
  animalIcon,
  color,
  width = 30,
  userIcon,
  userColor,
}) => {
  const userIconUrl = useMemo(() => {
    // in case of old solution where we were saving URLs,
    // initial value will be undefined after a user signup
    if (userIcon?.endsWith('.svg')) {
      return userIcon;
    }
    // getIconUrl(getIconKeys()[0]) is defensive part in case 'userIcon' is not found
    return getIconUrl(userIcon) || getIconUrl(getIconKeys()[0]);
  }, [userIcon]);

  if (!userIcon) {
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
      style={{ backgroundColor: color || userColor, width, height: width }}
      className={style.animalIcon}
    >
      <img src={animalIcon || userIconUrl} alt="animal" />
    </div>
  )
}

export default connect((
  { user: { profile: { animalIcon: userIcon, color: userColor } = {}, logged } },
) => (
  { userIcon, userColor, logged }
))(AnimalIcon);

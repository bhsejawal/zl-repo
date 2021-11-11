import { connect } from 'react-redux';

import CustomCursor from '../../CustomCursor';

import { LOADING_PIN } from '../../CustomCursor/constants';

import style from './style.scss';

const Click = ({
  animal,
  color,
  x,
  y,
  type,
  path,
  userId,
  currentUserId,
}) => {
  const isUserAction = userId === currentUserId;
  if (type === 'click') {
    return (
      <span
        className={style.Cursor}
        style={{
          top: `${y * 100}%`,
          left: `${x * 100}%`,
        }}
      >
        {isUserAction && (
          <CustomCursor
            color={color}
            animal={animal}
            showClickEffect
            cursorState={LOADING_PIN}
          />
        )}
        <div
          className={isUserAction ? style.clickIndicatorPin : style.clickIndicatorPinOtherUser}
          style={{ "--cursorColor": color }}
        >
          <div className={style.pulseIndicator} />
        </div>
      </span>
    );
  }

  if (type === 'emoji') {
    return (
      <img
        src={`${window.location.origin}${path}`}
        style={{ top: `${y}%`, left: `${x}%` }}
        draggable="false"
        alt="emoji"
        className={style.emoji}
      />
    )
  }

  return null;
};

export default connect(({ user: { userId }}) => ({ currentUserId: userId }))(Click);

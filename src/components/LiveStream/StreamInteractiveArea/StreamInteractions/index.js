import { h } from 'preact';
import { connect } from 'react-redux';

import Interaction from './Interaction';

import style from './style.scss';

const UserInteractions = ({ userInteractions }) => (
  <div className={style.userInteractionsWrapper}>
    {userInteractions.map(({
      x,
      y,
      userId,
      animal,
      color,
      cursorDelay,
      interactionId,
      type,
      path,
      normalizedX,
      normalizedY,
    }) => (
      <Interaction
        x={x || normalizedX}
        y={y || normalizedY}
        userId={userId}
        animal={animal}
        color={color}
        cursorDelay={cursorDelay}
        key={interactionId}
        type={type}
        path={path}
      />
    ))}
  </div>
);

export default connect(
  ({ mainStream: { userInteractions } }) => ({ userInteractions }),
)(UserInteractions);

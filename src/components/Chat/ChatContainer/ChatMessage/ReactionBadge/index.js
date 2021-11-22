import { Text } from 'grommet';
import classnames from 'classnames';

import images from '../ReactionBar/assets';
import style from './style.module.scss';

const ReactionBadge = ({
  reaction,
  count,
  onClick,
  isReaction,
}) => (
  // eslint-disable-next-line
  <div
    className={classnames(
      style.reactionContainer,
      {[style.reacted]: isReaction },
    )}
    onClick={() => onClick(reaction)}
  >
    <img src={images[reaction]} alt={`react with ${reaction}`} />
    <Text size="10px">{count}</Text>
  </div>
);

export default ReactionBadge;

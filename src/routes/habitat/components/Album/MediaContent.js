import { h } from 'preact';
import { connect } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { setShareModalMediaId } from '../ShareModal/actions';
import style from './style.scss';

const MediaContent = ({
  id,
  title,
  username,
  image,
  video,
  timestamp,
  zoo,
  setShareModalMediaIdAction,
}) => {
  const time = formatDistanceToNow(timestamp);

  const onclickHandler = () => {
    setShareModalMediaIdAction(id);
  }

  return (
    <div className={style.mediaContainer}>
      <button type="button" className={style.button} onClick={onclickHandler}>
        {image && <img src={image} alt="" loading="lazy" />}
        {/* TODO disable preload and use poster once we have a thumbnail */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        {video && <video src={video} />}
        <span>{time}</span>
      </button>
      <p>{title}</p>
      <p>{zoo}</p>
      {username && <p>{`By: ${username}`}</p>}
    </div>
  );
}

export default connect(
  ({
    habitat: {
      habitatInfo: { zoo: { name } },
    },
  }) => ({ zoo: name }),
  {
    setShareModalMediaIdAction: setShareModalMediaId,
  },
)(MediaContent);

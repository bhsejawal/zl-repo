import { h } from 'preact';
import { useState } from 'preact/hooks';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEyeSlash, faEye } from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';

import RoundButton from 'Components/RoundButton';
import Can from 'Components/Authorize';

import { handleDownloadMediaURL } from '../../../../../helpers';

import style from '../style.scss';

const MediaContent = ({
  id,
  title,
  username,
  image,
  timestamp,
  zooName,
  onClick,
  disabled,
  accessControlButtonHandler,
  type,
  rawURL,
  className,
}) => {
  const time = formatDistanceToNow(timestamp);
  const [showControls, setShowControls] = useState(false);

  const onclickHandler = () => {
    onClick(id);
  }

  return (
    <div
      className={classnames(style.mediaContainer, className)}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <Can
        perform="habitat:edit-album-media"
        yes={() => (
          <div
          className={classnames(style.actionBar, {[style.show]: showControls})}
          >
            {type === 'pastTalks' && rawURL && (
              <a href={rawURL} target="_blank" rel="noreferrer nooppener">
                <RoundButton
                  width="24"
                  color="var(--blueDark)"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </RoundButton>
              </a>
            )}
            {type === 'photos' && rawURL && (
              <a href={handleDownloadMediaURL(rawURL)} download>
                <RoundButton
                  width="24"
                  color="var(--blueDark)"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </RoundButton>
              </a>
            )}
            {accessControlButtonHandler && (
              <RoundButton
                width="24"
                color="var(--blueDark)"
                onClick={() => accessControlButtonHandler(id, disabled ? 'unhide' : 'hide', type)}
              >
                <FontAwesomeIcon icon={disabled ? faEye : faEyeSlash} />
              </RoundButton>
            )}
          </div>
        )}
      />
      <button
        type="button"
        className={classnames(style.button, {[style.disabled]: disabled})}
        onClick={onclickHandler}
      >
        {image && <img src={image} alt="" loading="lazy" />}
        <span>{time}</span>
      </button>
      <p>{title}</p>
      {zooName && <p>{zooName}</p>}
      {username && <p>{username}</p>}
    </div>
  );
};

export default MediaContent;

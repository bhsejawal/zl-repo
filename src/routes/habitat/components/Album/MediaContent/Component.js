import { h } from 'preact';
import { useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
  faEyeSlash,
  faEye,
  faHeart,
  faComment,
} from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';
import { Heading } from 'grommet';

import RoundButton from 'Components/RoundButton';
import Can from 'Components/Authorize';

import { handleDownloadMediaURL } from '../../../../../helpers';

import style from '../style.scss';

const MediaContent = ({
  id,
  image,
  onClick,
  disabled,
  accessControlButtonHandler,
  type,
  rawURL,
  className,
  comments,
  usersLike,
}) => {
  const [showOverlay, setShowOverlay] = useState(false);

  const onclickHandler = () => {
    onClick(id);
  }

  return (
    <div
      className={classnames(style.mediaContainer, className)}
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
      {showOverlay && (
        <Can
          perform="habitat:edit-album-media"
          yes={() => (
            <div className={style.actionBar}>
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
      )}
      <div
        className={classnames(style.mediaOverlay, {[style.show]: showOverlay})}
        onClick={onclickHandler}
      >
        <div className={style.overlayWrapper}>
          <div className={style.imageStats}>
            <div>
              <FontAwesomeIcon icon={faHeart} />
              <Heading level="4" color="white">{usersLike}</Heading>
            </div>
            <div>
              <FontAwesomeIcon icon={faComment} />
              <Heading level="4" color="white">{comments}</Heading>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className={classnames(style.button, {[style.disabled]: disabled})}
      >
        {image && <img src={image} alt="" loading="lazy" />}
      </button>
    </div>
  );
};

export default MediaContent;

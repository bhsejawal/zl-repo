import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Link } from 'preact-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/pro-solid-svg-icons';
import { faHeart } from '@fortawesome/pro-light-svg-icons';

import profileMask from '../../../../../assets/profile-mask.svg';

import style from './style.scss';

const Info = ({ info: { profileImg, name, zooName }, liked = false }) => {
  const [isLiked, setIsLiked] = useState(liked);

  const onFavClick = () => {
    setIsLiked(!isLiked);
    // TODO: implement server update
  };

  return (
    <div className={style.info}>
      <div className={style.profileImgWrapper}>
        <div className={style.profileImg}>
          <div>
            <img src={profileImg} alt="Profile" />
          </div>
          <button onClick={onFavClick} type="button" className={style.favBtn}>
            <FontAwesomeIcon
              icon={isLiked ? faHeartSolid : faHeart}
              color={isLiked ? "var(--pink)" : "var(--grey)"}
            />
          </button>
        </div>
        <img className={style.mask} src={profileMask} alt="Mask" />
      </div>

      <div>
        <h4 className={style.name}>{name}</h4>
        <p className={style.zooNameWrapper}>
          at
          {' '}
          <Link href="/">{zooName}</Link>
        </p>
      </div>
    </div>
  );
};

export default Info;

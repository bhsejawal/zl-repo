import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Link } from 'preact-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid } from '@fortawesome/pro-solid-svg-icons';
import { faHeart } from '@fortawesome/pro-light-svg-icons';

import profileMask from 'Assets/profile-mask.svg';

import TextEditor from 'Components/AdminEditWrappers/TextEditor';
import ImageEditor from 'Components/AdminEditWrappers/ImageEditor';

import style from './style.scss';

// TODO: this is just a mock variable - we should change it when we have habitat collection
const habitatId = 'habitat-id';

const Info = ({ info: { profileImg, name, zooName }, liked = false }) => {
  const [isLiked, setIsLiked] = useState(liked);

  const onFavClick = () => {
    setIsLiked(!isLiked);
    // TODO: implement server update
  };

  return (
    <div className={style.info}>
      <div className={style.profileImgWrapper}>
        <ImageEditor
          initialImgUrl={profileImg}
          postToUrl={`/admin/habitats/${habitatId}`}
          imageProp="profileImg"
          editBtnPosition={{ right: '50px', top: '10px' }}
          constraints={{
            maxResolution: 240,
            acceptedFormats: ['jpg', 'jpeg', 'png'],
            aspectRatio: '1:1',
            maxFileSize: '50kb',
          }}
        >
          {(img) => (
            <div className={style.profileImg}>
              <div>
                <img src={img} alt="Profile" />
              </div>
            </div>
          )}
        </ImageEditor>
        <button onClick={onFavClick} type="button" className={style.favBtn}>
          <FontAwesomeIcon
            icon={isLiked ? faHeartSolid : faHeart}
            color={isLiked ? "var(--pink)" : "var(--grey)"}
          />
        </button>
        <img className={style.mask} src={profileMask} alt="Mask" />
      </div>

      <div>
        <TextEditor
          postToUrl="/"
          textProp="cardTitle"
          minLen={10}
          maxLen={80}
          initialText={name}
        >
          {(text) => <h4 className={style.name}>{text}</h4>}
        </TextEditor>

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

import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { Link } from 'preact-router';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faSpinner, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { faHeart } from '@fortawesome/pro-light-svg-icons';
import useFetch from 'use-http';

import profileMask from 'Assets/profile-mask.svg';
import { buildURL } from 'Shared/fetch';

import TextEditor from 'Components/AdminEditWrappers/TextEditor';
import ImageEditor from 'Components/AdminEditWrappers/ImageEditor';

import { setHabitatLiked } from '../../../actions';

import style from './style.scss';

const Info = ({
  habitatId,
  animal,
  profileImage,
  zooName,
  zooSlug,
  isLiked,
  setLikedAction,
}) => {
  const [error, setError] = useState();
  const {
    post,
    del,
    response,
    loading,
  } = useFetch(buildURL('/habitats/favorite'), {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  const likeIcon = useMemo(() => {
    if (loading) {
      return faSpinner;
    }
    if (error) {
      return faTimes;
    }
    if (isLiked) {
      return faHeartSolid;
    }
    return faHeart;
  }, [isLiked, loading, error]);

  const onFavClick = async () => {
    if (isLiked) {
      await del({ habitatId });
    } else {
      await post({ habitatId });
    }

    if (!response.ok) {
      setError(true);
      setTimeout(() => {
        setError(undefined);
      }, 2000);
    } else {
      setLikedAction(!isLiked);
    }
  };

  return (
    <div className={style.info}>
      <div className={style.profileImgWrapper}>
        <ImageEditor
          initialImgUrl={profileImage}
          postToUrl={`/admin/habitats/${habitatId}/prop`}
          imageProp="profileImage"
          editBtnPosition={{ right: '50px', top: '10px' }}
          constraints={{
            maxResolution: 240,
            acceptedFormats: ['jpg', 'jpeg', 'png', 'svg'],
            aspectRatio: '1:1',
            maxFileSize: 50_000,
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
            icon={likeIcon}
            color={isLiked && !loading ? "var(--pink)" : "var(--grey)"}
            spin={likeIcon === faSpinner}
          />
        </button>
        <img className={style.mask} src={profileMask} alt="Mask" />
      </div>

      <div>
        <TextEditor
          postToUrl={`/admin/habitats/${habitatId}/prop`}
          textProp="animal"
          minLen={10}
          maxLen={80}
          initialText={animal}
        >
          {(text) => <h4 className={style.name}>{text}</h4>}
        </TextEditor>

        <p className={style.zooNameWrapper}>
          at
          {' '}
          {/* TODO: we need to agree on this routing path */}
          {/* maybe we could use `/z/${zooName}` */}
          {/* if we go with only `/${zooName}` we would need to do much more work to handle 404 */}
          <Link href={`/zoo/${zooSlug}`}>{zooName}</Link>
        </p>
      </div>
    </div>
  );
};

export default connect(
  ({
    habitat: {
      habitatInfo: {
        _id: habitatId,
        animal,
        profileImage,
        isLiked,
        zoo: { name: zooName, slug: zooSlug } = {},
      },
    },
  }) => ({
    habitatId,
    animal,
    profileImage,
    zooName,
    zooSlug,
    isLiked,
  }),
  { setLikedAction: setHabitatLiked },
)(Info);

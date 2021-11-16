import { connect } from 'react-redux';
import { useMemo, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faSpinner, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { faHeart } from '@fortawesome/pro-light-svg-icons';
import useFetch from 'use-http';
import classnames from 'classnames';

import { buildURL } from 'Shared/fetch';
import ImageEditor from 'Components/AdminEditWrappers/ImageEditor';
import ShareModal from 'Components/ShareModal/Standalone';

import { setHabitatLiked } from '../../../actions';

import style from './style.scss';

const ProfileImage = ({
  habitatId,
  profileImage,
  isLiked,
  trailer,
  setLikedAction,
}) => {
  const [showTrailer, setShowTrailer] = useState(false);
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

  const onFavClick = async (evt) => {
    evt.stopPropagation();

    if (isLiked) {
      await del({ habitatId });
    } else {
      await post({ habitatId });
    }

    if (response.ok) {
      setLikedAction(!isLiked);
    } else {
      setError(true);
      setTimeout(() => {
        setError(undefined);
      }, 2000);
    }
  };

  return (
    <div
      className={classnames(style.profileImgContainer, { [style.trailer]: trailer })}
      onClick={() => setShowTrailer(true)}
    >
      <div className={style.wrapper}>
        <button onClick={onFavClick} type="button" className={style.favBtn}>
          <FontAwesomeIcon
            icon={likeIcon}
            color={isLiked && !loading ? "var(--pink)" : "var(--grey)"}
            spin={likeIcon === faSpinner}
          />
        </button>
        <ImageEditor
          initialImgUrl={profileImage}
          postToUrl={`/admin/habitats/${habitatId}/prop`}
          imageProp="profileImage"
          editBtnPosition={{ right: '2px', top: '2px' }}
          constraints={{
            maxResolution: 240,
            acceptedFormats: ['jpg', 'jpeg'],
            aspectRatio: '1:1',
            maxFileSize: 50_000,
          }}
        >
          {(img) => (
            <div className={style.imageWrapper}>
              <img src={img} alt="Profile" />
            </div>
          )}
        </ImageEditor>
      </div>

      {trailer && (
        <ShareModal
          open={showTrailer}
          data={trailer}
          onClose={() => setShowTrailer(false)}
          mediaId={trailer._id}
          isDownloadAllowed={false}
        />
      )}
    </div>
  )
}

export default connect(({
  habitat: {
    habitatInfo: {
      _id: habitatId,
      profileImage,
      isLiked,
      trailer,
    },
  },
}) => ({
  habitatId,
  profileImage,
  isLiked,
  trailer,
}), {
  setLikedAction: setHabitatLiked,
})(ProfileImage);

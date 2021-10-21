import { h } from 'preact';
import {
  useMemo,
  useState,
} from 'preact/hooks';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faSpinner, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { faHeart } from '@fortawesome/pro-light-svg-icons';
import useFetch from 'use-http';
import classnames from 'classnames';
import { Heading } from 'grommet';

import { buildURL } from 'Shared/fetch';

import TextEditor from 'Components/AdminEditWrappers/TextEditor';
import ImageEditor from 'Components/AdminEditWrappers/ImageEditor';
import ShareModal from 'Components/ShareModal/Standalone';

import { setHabitatLiked } from '../../../actions';
import { useIsHabitatTabbed } from '../../../../../hooks';

import style from './style.scss';

const Info = ({
  habitatId,
  title,
  profileImage,
  zooLogo,
  isLiked,
  setLikedAction,
  trailer,
}) => {
  const [error, setError] = useState();
  const isTabbedLayout = useIsHabitatTabbed();
  const [showTrailer, setShowTrailer] = useState(false);

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
      {trailer && (
        <ShareModal
          open={showTrailer}
          data={trailer}
          onClose={() => setShowTrailer(false)}
          mediaId={trailer._id}
          isDownloadAllowed={false}
        />
      )}
      <div
        className={classnames(style.profileImgWrapper, {[style.mobile]: isTabbedLayout})}
        onClick={() => setShowTrailer(true)}
      >
        <button onClick={onFavClick} type="button" className={style.favBtn}>
          <FontAwesomeIcon
            icon={likeIcon}
            color={isLiked && !loading ? "var(--pink)" : "var(--grey)"}
            spin={likeIcon === faSpinner}
          />
        </button>
        {trailer && (
          <div className={style.background} />
        )}
        <ImageEditor
          initialImgUrl={profileImage}
          postToUrl={`/admin/habitats/${habitatId}/prop`}
          imageProp="profileImage"
          editBtnPosition={{ right: '18px', top: '10px' }}
          constraints={{
            maxResolution: 240,
            acceptedFormats: ['jpg', 'jpeg'],
            aspectRatio: '1:1',
            maxFileSize: 50_000,
          }}
        >
          {(img) => (
            <div className={classnames(style.profileImg, {[style.interactive]: trailer })}>
              <div>
                <img src={img} alt="Profile" />
              </div>
            </div>
          )}
        </ImageEditor>
      </div>

      <div className={style.detailsWrapper}>
        <TextEditor
          postToUrl={`/admin/habitats/${habitatId}/prop`}
          textProp="title"
          minLen={3}
          maxLen={20}
          initialText={title}
        >
          {(text) => <Heading level="3" className={style.name}>{text}</Heading>}
        </TextEditor>

        <p className={style.zooNameWrapper}>
          at
          &nbsp;
          <img src={zooLogo} alt="logo" />
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
        title,
        profileImage,
        isLiked,
        zoo: { logo: zooLogo, slug: zooSlug } = {},
        trailer,
      },
    },
  }) => ({
    habitatId,
    title,
    profileImage,
    zooLogo,
    zooSlug,
    isLiked,
    trailer,
  }),
  { setLikedAction: setHabitatLiked },
)(Info);

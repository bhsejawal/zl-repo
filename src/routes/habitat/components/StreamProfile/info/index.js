import { h } from 'preact';
import {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'preact/hooks';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faSpinner, faTimes } from '@fortawesome/pro-solid-svg-icons';
import { faHeart } from '@fortawesome/pro-light-svg-icons';
import useFetch from 'use-http';
import classnames from 'classnames';
import { Heading } from 'grommet';

import { buildURL, API_BASE_URL } from 'Shared/fetch';

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
}) => {
  const [error, setError] = useState();
  const isTabbedLayout = useIsHabitatTabbed();
  const [showTrailer, setShowTrailer] = useState(false);
  const [habitatTrailer, setHabitatTrailer] = useState(undefined);

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

  const {
    get,
    data: habitatTrailerData,
    response: habitatTrailerResponse,
    loading: habitatTrailerLoading,
  } = useFetch(API_BASE_URL, {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });

  useEffect(() => {
    if (habitatTrailerResponse.status === 200) {
      setHabitatTrailer(habitatTrailerData)
    } else {
      setHabitatTrailer(undefined);
    }
  }, [habitatTrailerResponse, habitatTrailerData])

  const getHabitatTrailer = useCallback(async (habitatId) => {
    await get(`/habitats/${habitatId}/trailer`);
  }, [get])

  useEffect(() => {
    if (habitatId && habitatId !== habitatTrailer?.habitat?.id) {
      getHabitatTrailer(habitatId);
    }
  }, [habitatId, getHabitatTrailer, habitatTrailer]);

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

  if (habitatTrailerLoading) {
    return null;
  }

  return (
    <div className={style.info}>
      {habitatTrailer && (
        <ShareModal
          open={showTrailer}
          data={habitatTrailer}
          onClose={() => setShowTrailer(false)}
          mediaId={habitatTrailer._id}
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
        {habitatTrailer && (
          <div className={style.background} />
        )}
        <ImageEditor
          initialImgUrl={profileImage}
          postToUrl={`/admin/habitats/${habitatId}/prop`}
          imageProp="profileImage"
          editBtnPosition={{ right: '18px', top: '10px' }}
          constraints={{
            maxResolution: 240,
            acceptedFormats: ['jpg', 'jpeg', 'png', 'svg'],
            aspectRatio: '1:1',
            maxFileSize: 50_000,
          }}
        >
          {(img) => (
            <div className={classnames(style.profileImg, {[style.interactive]: habitatTrailer })}>
              <div>
                <img src={img} alt="Profile" />
              </div>
            </div>
          )}
        </ImageEditor>
      </div>

      <div>
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
      },
    },
  }) => ({
    habitatId,
    title,
    profileImage,
    zooLogo,
    zooSlug,
    isLiked,
  }),
  { setLikedAction: setHabitatLiked },
)(Info);

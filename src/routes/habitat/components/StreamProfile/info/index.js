import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
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

import { setHabitatLiked } from '../../../actions';
import { useIsHabitatTabbed } from '../../../../../hooks';

import profileMask from './profile-mask.svg';

import style from './style.scss';

const Info = ({
  habitatId,
  title,
  profileImage,
  zooLogo,
  // zooSlug, this will be used for zoo page link
  isLiked,
  setLikedAction,
}) => {
  const [error, setError] = useState();
  const isTabbedLayout = useIsHabitatTabbed();

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
      <div
        className={classnames(style.profileImgWrapper, {[style.mobile]: isTabbedLayout})}
      >
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
          {/* TODO: we need to agree on this routing path */}
          {/* maybe we could use `/z/${zooName}` */}
          {/* if we go with only `/${zooName}` we would need to do much more work to handle 404 */}
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

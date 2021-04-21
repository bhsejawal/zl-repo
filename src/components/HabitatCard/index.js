import { h } from 'preact';
import { Link } from 'preact-router';
import { useMemo, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faCircle,
  faSpinner,
  faTimes,
} from '@fortawesome/pro-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/pro-light-svg-icons';
import {
  Button,
  Heading,
  Text,
  Box,
} from 'grommet';
import classnames from 'classnames';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';
import Tag from 'Components/Tag';
import { openTermsModal } from 'Components/TermsAndConditions/actions';

import zooPlaceholder from './zooPlaceholder.png';
import wideImgPlaceholder from './wideImgPlaceholder.png';

import { updateFavoriteHabitat } from '../../redux/actions';

import style from './style.scss';

const HabitatStatus = ({ online, liveTalk }) => {
  let label = online ? 'ONLINE' : 'OFFLINE'

  if (online && liveTalk) {
    label = 'LIVE TALK';
  }

  return (
    <Tag
      label={(
        <span he>
          {(online || liveTalk) && <FontAwesomeIcon icon={faCircle} />}
          <Text size="small" weight={700} style={{ lineHeight: '15px'}}>{label}</Text>
        </span>
      )}
      varient={online && liveTalk ? 'liveTalk' : label.toLowerCase()}
    />
  )
};

const HabitatCard = ({
  className,
  habitatId,
  zooSlug,
  slug,
  online,
  liveTalk,
  image,
  logo,
  title,
  description,
  termsAccepted,
  onFavoriteClick,
  favoriteHabitats,
  openTermsModalAction,
  updateFavoriteHabitatAction,
}) => {
  const [error, setError] = useState(false);
  const isFavorited = useMemo(
    () => favoriteHabitats.includes(habitatId),
    [favoriteHabitats, habitatId],
  );

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
    if (isFavorited) {
      return faHeart;
    }
    return faHeartOutline;
  }, [isFavorited, loading, error]);

  const onHabitatClick = (evt) => {
    if (!termsAccepted) {
      evt.preventDefault();
      evt.stopPropagation();
      openTermsModalAction();
    }
  };

  const defaultOnFavoriteClick = async () => {
    if (isFavorited) {
      await del({ habitatId });
    } else {
      await post({ habitatId });
    }

    if (response.ok) {
      updateFavoriteHabitatAction(habitatId);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  }

  const handleFavoriteClick = () => {
    if (typeof onFavoriteClick === 'undefined') {
      return defaultOnFavoriteClick();
    }
    return onFavoriteClick(habitatId);
  }

  return (
    <div className={classnames(style.habitatCard, className)}>
      <div className={style.header}>
        <img src={image ?? wideImgPlaceholder} alt="" />
        <div className={style.logo}>
          <img src={logo ?? zooPlaceholder} alt="" />
        </div>
        <div className={style.tag}>
          <HabitatStatus online={online} liveTalk={liveTalk} />
        </div>
      </div>
      <div className={style.body}>
        <div style={{ flexGrow: 1 }}>
          <Heading level="4" margin={{ top: "0px", bottom: "15px" }}>{title || "Dummy Title"}</Heading>
          <Text size="xlarge" as="p">
            {description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy"}
          </Text>
        </div>
        <div className={classnames(style.buttons, style.favorite)}>
          <Box width="170px">
            <Link onClick={onHabitatClick} href={encodeURI(`/h/${zooSlug}/${slug}`)}>
              <Button primary label="Enter Habitat" size="large" />
            </Link>
          </Box>
          <Button
            onClick={handleFavoriteClick}
            margin={{ right: '5px' }}
            width="20px"
            className={style.iconButton}
          >
            <FontAwesomeIcon
              icon={likeIcon}
              color={isFavorited && !loading ? "var(--pink)" : "var(--grey)"}
              spin={likeIcon === faSpinner}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default connect(
  ({ user: { termsAccepted, favoriteHabitats } = {} }) => ({ termsAccepted, favoriteHabitats }),
  { openTermsModalAction: openTermsModal, updateFavoriteHabitatAction: updateFavoriteHabitat },
)(HabitatCard)

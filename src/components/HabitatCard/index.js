import { h } from 'preact';
import { Link } from 'preact-router';
import { useMemo, useState } from 'preact/hooks';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faSpinner,
  faTimes,
  faLockAlt,
} from '@fortawesome/pro-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/pro-light-svg-icons';
import {
  Button,
  Heading,
  Text,
  Box,
} from 'grommet';
import useFetch from 'use-http';

import { buildURL } from 'Shared/fetch';
import { openTermsModal } from 'Components/TermsAndConditions/actions';
import { OutlineButton, PrimaryButton } from 'Components/Buttons';

import { updateFavoriteHabitat } from '../../redux/actions';

import HabitatCardBase from './HabitatCardBase';

import style from './style.scss';

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
  trailer,
  subscription,
  description,
  termsAccepted,
  onShowTrailer,
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

  const isLocked = useMemo(
    () => subscription.productId === 'FREEMIUM' && subscription.freeHabitat !== habitatId,
    [subscription, habitatId],
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

  if (!subscription) {
    return null;
  }

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
    <HabitatCardBase
      className={className}
      online={online}
      liveTalk={liveTalk}
      image={image}
      logo={logo}
    >
      <div style={{ flexGrow: 1 }}>
        <div className={style.titleSection}>
          {!isLocked && (
            <Button
              onClick={handleFavoriteClick}
              margin={{ right: '9px' }}
              width="20px"
              className={style.iconButton}
              >
              <FontAwesomeIcon
                icon={likeIcon}
                color={isFavorited && !loading ? "var(--pink)" : "var(--grey)"}
                spin={likeIcon === faSpinner}
              />
            </Button>
          )}
          <Link onClick={onHabitatClick} href={encodeURI(`/h/${zooSlug}/${slug}`)}>
            <Heading level="4" margin={{ vertical: "0px" }}>{title}</Heading>
          </Link>
        </div>
        <Text size="xlarge" as="p">
          {description}
        </Text>
      </div>
      <div className={style.buttons}>
        <Box direction="row" justify="between" fill="horizontal">
          {!isLocked && (
            <Link onClick={onHabitatClick} href={encodeURI(`/h/${zooSlug}/${slug}`)}>
              <PrimaryButton
                label="Visit"
                size="large"
                style={{ minWidth: '126px', width: '126px' }}
                width="126px"
              />
            </Link>
          )}
          {isLocked && (
            <Link href={encodeURI(`/plans`)}>
              <Button
                primary
                label={(
                  <Box direction="row" justify="center" align="center">
                    <FontAwesomeIcon icon={faLockAlt} color="#2E2D2D" size="1x" />
                    <Text className={style.buttonText}>Unlock</Text>
                  </Box>
                )}
                size="large"
                className={style.lockButton}
              />
            </Link>
          )}
          {trailer && (
            <OutlineButton
              label="Trailer"
              height="45px"
              style={{ minWidth: '126px', width: '126px' }}
              width="126px"
              onClick={() => onShowTrailer(trailer)}
            />
          )}
        </Box>
      </div>
    </HabitatCardBase>
  );
};

export default connect(
  (
    { user: { termsAccepted, favoriteHabitats, subscription } = {} },
  ) => (
    { termsAccepted, favoriteHabitats, subscription }
  ),
  {
    openTermsModalAction: openTermsModal,
    updateFavoriteHabitatAction: updateFavoriteHabitat,
  },
)(HabitatCard);

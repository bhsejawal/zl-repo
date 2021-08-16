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
  subscription,
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
        <Heading level="4" margin={{ top: "0px", bottom: "15px" }}>{title || "Dummy Title"}</Heading>
        <Text size="xlarge" as="p">
          {description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy"}
        </Text>
      </div>
      <div className={style.buttons}>
        <Box width="170px">
          {!isLocked && (
            <Link onClick={onHabitatClick} href={encodeURI(`/h/${zooSlug}/${slug}`)}>
              <Button primary label="Enter Habitat" size="large" />
            </Link>
          )}
          {isLocked && (
            <Link href={encodeURI(`/plans`)}>
              <Button
                primary
                label={(
                  <Box direction="row" justify="center" align="center">
                    <FontAwesomeIcon icon={faLockAlt} color="#2E2D2D" size="1x" />
                    <Text className={style.buttonText}>Unlock all Habitats</Text>
                  </Box>
                )}
                size="large"
                className={style.lockButton}
              />
            </Link>
          )}
        </Box>
        {!isLocked && (
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
        )}
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

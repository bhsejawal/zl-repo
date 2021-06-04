import { h } from 'preact';
import { useCallback, useEffect, useReducer } from 'preact/hooks';
import {
  Box,
  Heading,
  Text,
} from 'grommet';
import useFetch from 'use-http';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { buildURL } from 'Shared/fetch';
import HabitatCard from 'Components/HabitatCard';
import Loader from 'Components/Loader';
import NoContentFallback from 'Components/NoContentFallback';

import { useIsInitiallyLoaded, useIsMobileSize, useWindowResize } from '../../hooks';
import { updateFavoriteHabitat } from '../../redux/actions';

import style from './style.scss';

const SET_DATA = 'SET_DATA';
const REMOVE_HABITAT = 'REMOVE_HABITAT';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case SET_DATA: {
      return { ...state, ...payload };
    }

    case REMOVE_HABITAT: {
      const { habitatId } = payload;
      return {
        ...state,
        habitats: state.habitats.filter(({ _id }) => _id !== habitatId),
      };
    }

    default: {
      return state;
    }
  }
};

const url = buildURL('/habitats/favorite');

const Favorite = ({ updateFavoriteHabitatAction }) => {
  const { width } = useWindowResize();
  const [{ habitats = [] }, dispatch] = useReducer(reducer, {});
  const { loading, error, get } = useFetch(url, {
    credentials: 'include',
    cachePolicy: 'no-cache',
  });
  // using different useFetch hook because we need to handle error differently
  const { del, response: delResponse } = useFetch(url, {
    credentials: 'include',
    cachePolicy: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
  });
  const loaded = useIsInitiallyLoaded(loading);
  const isSmallScreen = useIsMobileSize();

  useEffect(() => {
    const loadHabitats = async () => {
      const { habitats } = await get();
      dispatch({ type: SET_DATA, payload: { habitats } });
    };

    loadHabitats();
  }, [get]);

  const onFavoriteClick = useCallback(async (habitatId) => {
    await del({ habitatId });
    if (delResponse.ok) {
      dispatch({ type: REMOVE_HABITAT, payload: { habitatId } });
      updateFavoriteHabitatAction(habitatId);
    } else {
      // TODO: display error
      // maybe display a toast
      console.warn(delResponse.data?.error ?? 'There was an error');
    }
  }, [del, delResponse, updateFavoriteHabitatAction]);

  return (
    <Box className={style.favorite}>
      <Box
        className={style.header}
        direction="row"
        align="center"
      >
        <Box justify="start" margin={{ top: '0', bottom: '0', right: '20px' }}>
          <Heading
            color="var(--charcoal)"
            level="3"
          >
            My Favorites
          </Heading>
        </Box>
        <Box justify="center">
          <Text margin="0" size="xlarge" color="var(--charcoalLight)">
            Your top habitats at a glance.
          </Text>
        </Box>
      </Box>

      <Box
        wrap
        background="var(--hunterGreenMediumLight)"
        flex="grow"
        direction="row"
        justify={width < 850 ? 'center' : 'start' }
        className={classnames(style.content, 'customScrollBar')}
        pad={{
          horizontal: isSmallScreen ? 'small' : 'xlarge',
          vertical: 'medium',
        }}
      >
        {!loaded && <Loader fill color="white" />}

        {error && (
          <Box fill justify="center" align="center">
            <Heading level="4" color="#fff">
              There was an error. Please try again.
            </Heading>
          </Box>
        )}

        {loaded && habitats.map(({
          _id,
          slug,
          online,
          liveTalk,
          title,
          zoo,
          description,
          wideImage: image,
        }) => (
          <Box key={_id} pad="small" flex="shrink">
            <HabitatCard
              favorite
              slug={slug}
              zooSlug={zoo?.slug}
              habitatId={_id}
              online={online}
              liveTalk={liveTalk}
              title={title}
              description={description}
              image={image}
              logo={zoo?.logo}
              onFavoriteClick={onFavoriteClick}
              className={style.listItem}
            />
          </Box>
        ))}

        {loaded && !error && habitats.length === 0 && (
          <Box fill flex="grow" justify="center" className={style.noContent}>
            <NoContentFallback
              text="Add your favorite animal habitats here for easy access."
              subText="Favorite by tapping the heart on the photo icon in any habitat. "
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default connect(null, { updateFavoriteHabitatAction: updateFavoriteHabitat })(Favorite);

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import { Grommet, Select } from 'grommet';
import { deepMerge } from 'grommet/utils';
import { grommet } from 'grommet/themes';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTimesCircle } from '@fortawesome/pro-solid-svg-icons';
import useFetch from 'use-http';
import classnames from 'classnames';

import { buildURL } from 'Shared/fetch';
import { LandingPrimary } from 'Components/Buttons';

import Loader from 'Components/Loader';
import Benefits from 'Components/Benefits';
import zoolifeLogo from 'Components/ZoolifeLogo/zoolife.svg';
import VideoPlayer from 'Components/VideoPlayer';

import MediaContent from '../habitat/components/Album/MediaContent/Standalone';
import FilterButton from './FilterButton';

import zoolifeTheme from '../../grommetTheme';

import style from './style.scss';

const ShareModal = lazy(() => import('Components/ShareModal/Standalone'));
const customBreakpoints = deepMerge(grommet, zoolifeTheme, {
  select: {
    options: {
      text: {
        size: 'xlarge',
      },
    },
    container: {
      extend: {
        fontSize: '16px',
      },
    },
  },
});

const Album = ({ mediaType: mediaTypeProp, matches: { photoId, videoId } = {} }) => {
  const [mediaType, setMediaType] = useState(mediaTypeProp);
  const [loading, setLoading] = useState(true);
  const [filteredZoos, setFilteredZoos] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [modalItem, setModalItem] = useState();
  const [totalItems, setTotalItems] = useState(0);
  const zoosParams = new URLSearchParams({ 'fields[]': 'name', disabled: false });
  const { data: { zoos = [] } = {} } = useFetch(buildURL(`/zoos?${zoosParams}`), []);
  const {
    data: { url: photoURL = '', videoURL } = {},
    error: mediaError,
  } = useFetch(buildURL(`/${mediaTypeProp}/${photoId || videoId}`), [photoId, videoId]);
  const { data: allAnimals = [] } = useFetch(buildURL('/animals'), []);

  const { get, loading: itemsLoading, error: itemsError } = useFetch(buildURL(mediaType));
  const allZoos = useMemo(
    () => zoos.map(({ name, _id }) => ({ label: name, value: _id })),
    [zoos],
  );

  const goToZoolife = () => {
    window.parent.location = 'https://zoolife.tv/signup?utm_source=zoolife&utm_medium=public&utm_campaign=albumpage';
  };

  const onMainItemLoad = () => {
    setLoading(false);
  };

  useEffect(() => {
    if (mediaError) {
      setLoading(false);
    }
  }, [mediaError]);

  const paramsStr = useMemo(() => {
    const params = new URLSearchParams({ page });
    filteredZoos.forEach((zooId) => {
      params.append('zooIds[]', zooId);
    });
    filteredAnimals.forEach((animal) => {
      params.append('animals[]', animal);
    });
    return params.toString();
  }, [filteredAnimals, filteredZoos, page]);

  useEffect(() => {
    const load = async () => {
      const { list, total } = await get(paramsStr ? `?${paramsStr}` : '');
      list.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.date = new Date(item.createdAt || item.creationDate);
      });
      setItems(page === 1 ? list : [...items, ...list]);
      setTotalItems(total);
    };

    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [get, paramsStr]);

  const clearZoosFilter = useCallback(() => {
    setFilteredZoos([]);
    setPage(1);
  }, []);
  const clearAnimalsFilter = useCallback(() => {
    setFilteredAnimals([]);
    setPage(1);
  }, []);

  const onZoosFilterChange = useCallback((filterData) => {
    setFilteredZoos(filterData);
    setPage(1);
  }, []);
  const onAnimalsFilterChange = useCallback((filterData) => {
    setFilteredAnimals(filterData);
    setPage(1);
  }, []);

  const incrementPage = () => {
    setPage(page + 1);
  };

  const onModalMediaChange = useCallback((photoId) => {
    setModalItem(items.find(({ _id }) => _id === photoId));
  }, [items]);

  const onShareModalClose = useCallback(() => {
    setModalItem(undefined);
  }, []);

  const onMediaTypeChange = useCallback(({ value }) => {
    setMediaType(value);
    setPage(1);
  }, []);

  const modalItemInd = useMemo(
    () => items.findIndex(({ _id }) => _id === modalItem?._id),
    [modalItem, items],
  );

  return (
    <Grommet full theme={customBreakpoints}>
      <div className={style.page}>
        <div className={style.container}>
          <div className={style.wrapper}>
            <div className={style.main}>
              <div className={style.text}>
                <h4 className={style.blue}>Welcome to</h4>
                <img src={zoolifeLogo} alt="logo" />
                <h4>Explore nature, from home!</h4>
                <p>
                  Join us for incredible animal experiences from
                  <br />
                  the world&apos;s top zoos, hosted by nature experts.
                </p>
                <LandingPrimary onClick={goToZoolife}>
                  Start Your Free Trial
                </LandingPrimary>
              </div>
              <div className={style.mainItem}>
                {!mediaError && loading && <Loader className={style.mainLoader} />}
                {photoURL && (
                  <img
                    alt=""
                    src={photoURL}
                    onLoad={onMainItemLoad}
                    className={classnames({ [style.hiddenMedia]: loading })}
                  />
                )}
                {videoURL && (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <VideoPlayer
                    videoURL={videoURL}
                    autoPlay
                    muted
                    isGuest
                    key={videoURL}
                    onLoad={onMainItemLoad}
                    className={classnames({ [style.hiddenMedia]: loading })}
                  />
                )}

                {mediaError && (
                  <div className={style.error}>
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      size="8x"
                      color="var(--red)"
                    />
                    <h3>Uh oh!</h3>
                    <p>There was an error.</p>
                  </div>
                )}
              </div>
            </div>

            <div className={style.thumbs}>
              <div className={style.filtersHeader}>
                <h4>Explore more animal moments!</h4>
                <div className={style.filters}>
                  <div className={style.typeSelectWrapper}>
                    <Select
                      labelKey="label"
                      valueKey={{ key: 'value', reduce: true }}
                      options={[
                        { label: 'Photo', value: 'photos' },
                        { label: 'Clip', value: 'videos' },
                      ]}
                      value={mediaType}
                      onChange={onMediaTypeChange}
                    />
                  </div>
                  <div className={style.filterButtonWrapper}>
                    <FilterButton
                      label="All Zoos"
                      items={allZoos}
                      filteredItems={filteredZoos}
                      onFilter={onZoosFilterChange}
                      onClear={clearZoosFilter}
                    />
                  </div>
                  <div className={style.filterButtonWrapper}>
                    <FilterButton
                      label="All Animals"
                      items={allAnimals}
                      filteredItems={filteredAnimals}
                      onFilter={onAnimalsFilterChange}
                      onClear={clearAnimalsFilter}
                    />
                  </div>
                </div>
              </div>

              <div>
                {itemsLoading && page === 1 && <Loader />}
                {itemsError && (
                  <div className={classnames(style.error, style.errorPad)}>
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      size="8x"
                      color="var(--red)"
                    />
                    <h3>Uh oh!</h3>
                    <p>There was an error.</p>
                  </div>
                )}

                {!(itemsLoading && page === 1) && !itemsError && items.map(({
                  _id,
                  username,
                  date,
                  url,
                  previewURL,
                  disabled,
                  habitat,
                  comments,
                  usersLike,
                }) => (
                  <MediaContent
                    key={_id}
                    id={_id}
                    image={url || previewURL}
                    title={format(date, 'MMM Lo, yyyy | h:mmaa')}
                    timestamp={date}
                    disabled={disabled}
                    username={username && `By: ${username}`}
                    type={mediaType}
                    className={style.thumb}
                    zooName={habitat?.zoo?.name}
                    animal={habitat?.animal}
                    onClick={onModalMediaChange}
                    usersLike={usersLike}
                    comments={comments}
                    hideOverlay
                  />
                ))}

                {!itemsLoading && !itemsError && items.length === 0 && (
                  <div className={style.noData}>
                    <p>There are no media items.</p>
                  </div>
                )}

                {!(itemsLoading && page === 1) && !itemsError && totalItems > items.length && (
                  <button className={style.loadMore} type="button" onClick={incrementPage}>
                    {!itemsLoading && 'Load More'}
                    {itemsLoading && <FontAwesomeIcon icon={faSpinner} spin size="2x" />}
                  </button>
                )}
              </div>
            </div>

            <Benefits />
          </div>
        </div>

        {typeof window !== 'undefined' && (
          <Suspense>
            <ShareModal
              open={!!modalItem}
              animal={modalItem?.habitat?.animal}
              zoo={modalItem?.habitat?.zoo?.name}
              habitat={modalItem?.habitat?.id}
              data={modalItem ?? {}}
              nextId={items[modalItemInd + 1]?._id}
              prevId={items[modalItemInd - 1]?._id}
              onClose={onShareModalClose}
              setShareModalMediaId={onModalMediaChange}
              isGuest
            />
          </Suspense>
        )}
      </div>
    </Grommet>
  );
};

export default Album;

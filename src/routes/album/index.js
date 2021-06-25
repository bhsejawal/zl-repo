import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import { lazy, Suspense } from 'preact/compat';
import useFetch from 'use-http';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTimesCircle } from '@fortawesome/pro-solid-svg-icons';

import { buildURL } from 'Shared/fetch';
import { LandingPrimary } from 'Components/Buttons';
import Loader from 'Components/Loader';
import Benefits from 'Components/Benefits';
import zoolifeLogo from 'Components/ZoolifeLogo/zoolife.svg';
import MediaContent from '../habitat/components/Album/MediaContent/Standalone';
import Header from '../home/Header';
import FilterButton from './FilterButton';

import { goToSignup } from '../home/helpers';

import style from './style.scss';

const ShareModal = lazy(() => import('Components/ShareModal/WithSocket'));

const Album = ({ matches: { photoId } = {} }) => {
  const [loading, setLoading] = useState(true);
  const [filteredZoos, setFilteredZoos] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [page, setPage] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [modalPhoto, setModalPhoto] = useState();
  const [totalPhotos, setTotalPhotos] = useState(0);
  const zoosParams = new URLSearchParams({ 'fields[]': 'name' });
  const { data: { zoos = [] } = {} } = useFetch(buildURL(`/zoos?${zoosParams}`), []);
  const {
    data: { url = '' } = {},
    error: mediaError,
  } = useFetch(buildURL(`/photos/${photoId}`), [photoId]);
  const { data: allAnimals } = useFetch(buildURL('/animals'), []);
  const { get, loading: itemsLoading, error: itemsError } = useFetch(buildURL('/photos'));
  const allZoos = useMemo(
    () => zoos.map(({ name, _id }) => ({ label: name, value: _id })),
    [zoos],
  );

  const onPhotoLoad = () => {
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
      list.forEach((photo) => {
        // eslint-disable-next-line no-param-reassign
        photo.date = new Date(photo.createdAt);
      });
      setPhotos(page === 1 ? list : [...photos, ...list]);
      setTotalPhotos(total);
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
    setModalPhoto(photos.find(({ _id }) => _id === photoId));
  }, [photos]);

  const onShareModalClose = useCallback(() => {
    setModalPhoto(undefined);
  }, []);

  const modalPhotoInd = useMemo(
    () => photos.findIndex(({ _id }) => _id === modalPhoto?._id),
    [modalPhoto, photos],
  );

  return (
    <div className={style.page}>
      <Header />

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
              <LandingPrimary onClick={goToSignup}>
                Start Your Free Trial
              </LandingPrimary>
            </div>
            <div className={style.mainPhoto}>
              {!mediaError && loading && <Loader className={style.mainLoader} />}
              {url && <img src={url} onLoad={onPhotoLoad} alt="" />}
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
                <FilterButton
                  label="All Zoos"
                  items={allZoos}
                  filteredItems={filteredZoos}
                  onFilter={onZoosFilterChange}
                  onClear={clearZoosFilter}
                />
                <FilterButton
                  label="All Animals"
                  items={allAnimals}
                  filteredItems={filteredAnimals}
                  onFilter={onAnimalsFilterChange}
                  onClear={clearAnimalsFilter}
                />
              </div>
            </div>

            <div>
              {itemsLoading && page === 1 && <Loader />}
              {itemsError && (
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

              {!(itemsLoading && page === 1) && photos.map(({
                _id,
                username,
                date,
                url,
                disabled,
                rawURL,
                habitat,
              }) => (
                <MediaContent
                  key={_id}
                  id={_id}
                  image={url}
                  title={format(date, 'MMM Lo, yyyy | h:mmaa')}
                  timestamp={date}
                  disabled={disabled}
                  username={username && `By: ${username}`}
                  type="photos"
                  rawURL={rawURL}
                  className={style.thumb}
                  zooName={habitat?.zoo?.name}
                  animal={habitat?.animal}
                  onClick={onModalMediaChange}
                />
              ))}

              {!itemsLoading && !itemsError && photos.length === 0 && (
                <div className={style.noData}>
                  <p>There are no photos.</p>
                </div>
              )}

              {!(itemsLoading && page === 1) && totalPhotos > photos.length && (
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
            open={!!modalPhoto}
            animal={modalPhoto?.habitat?.animal}
            zoo={modalPhoto?.habitat?.zoo?.name}
            data={modalPhoto ?? {}}
            nextId={photos[modalPhotoInd + 1]?._id}
            prevId={photos[modalPhotoInd - 1]?._id}
            onClose={onShareModalClose}
            setShareModalMediaId={onModalMediaChange}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Album;

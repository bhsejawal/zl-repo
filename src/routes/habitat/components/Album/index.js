import { h } from 'preact';
import { connect } from 'react-redux';
import { useEffect, useState } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilmAlt,
  faSpinner,
  faVideo,
  faImage,
  faUserMdChat,
} from '@fortawesome/pro-solid-svg-icons';
import classnames from 'classnames';
import useFetch from 'use-http';

import { API_BASE_URL } from 'Shared/fetch';
import Loader from 'Components/Loader';
import ErrorModal from 'Components/modals/Error';

import { setAlbumData, appendAlbumData, changeContentVisibility } from './actions';
import MediaContent from './MediaContent';
import ConfirmModal from './ConfirmModal';

import {
  PHOTOS,
  PAST_TALKS,
  CLIPS,
  STREAMS,
} from './types';

import style from './style.scss';

const defaultActionModalState = {
  _id: null,
  action: null,
  show: false,
  type: null,
};

const defaultErrorModalState = {
  show: false,
  text: null,
}

const Album = ({
  album,
  tab,
  habitatId,
  setAlbumDataAction,
  appendAlbumDataAction,
  changeContentVisibilityAction,
}) => {
  const [type, setType] = useState(CLIPS);
  const [page, setPage] = useState(1);
  const [actionModalState, setActionModalState] = useState(defaultActionModalState);
  const [errorModalState, setErrorModalState] = useState(defaultErrorModalState);

  const {
    get,
    data,
    loading,
    error,
  } = useFetch(API_BASE_URL, { credentials: 'include', cachePolicy: 'no-cache' });

  const {
    put,
    response,
  } = useFetch(API_BASE_URL, { credentials: 'include', cachePolicy: 'no-cache' });

  useEffect(() => {
    if (!error && data) {
      if (page > 1) {
        appendAlbumDataAction(data);
      } else {
        setAlbumDataAction(data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data, setAlbumDataAction]);

  useEffect(() => {
    if (habitatId) {
      get(`habitats/${habitatId}/album/${type}?page=${page}&pageSize=15`);
    }
  }, [type, get, habitatId, page]);

  const onChangeHandler = (value) => () => {
    setType(value);
    setPage(1);
  }

  const fetchMore = () => {
    setPage(page + 1);
  }

  const openConfirmActionModal = (mediaContentId, action, type) => setActionModalState({
    action,
    _id: mediaContentId,
    show: true,
    type,
  });

  const cancelConfirmActionModal = () => setActionModalState(defaultActionModalState);

  const confirmActionHandler = async () => {
    const { _id, type, action } = actionModalState;
    const resource = type === 'photos' ? `/admin/photos/${_id}` : `/admin/videos/${_id}`;
    await put(resource, { disabled: action === 'hide' });

    if (response.ok) {
      changeContentVisibilityAction(_id, type, action);
    } else {
      setErrorModalState({ show: true, text: `Error trying to ${action} the selected media content, please try again.`});
    }
    cancelConfirmActionModal();
  }

  const closeErrorModalHandler = () => setErrorModalState(defaultErrorModalState);

  return (
    <>
      <div className={classnames(style.album, { [style.tab]: tab })}>
        <div className={style.buttonTabs}>
          <button
            type="button"
            className={type === CLIPS && style.active}
            onClick={onChangeHandler(CLIPS)}
          >
            <FontAwesomeIcon icon={faFilmAlt} />
            <span>Animal Clips</span>
          </button>
          <button
            type="button"
            className={type === PHOTOS && style.active}
            onClick={onChangeHandler(PHOTOS)}
          >
            <FontAwesomeIcon icon={faImage} />
            <span>Animal Photos</span>
          </button>
          <button
            type="button"
            className={type === PAST_TALKS && style.active}
            onClick={onChangeHandler(PAST_TALKS)}
          >
            <FontAwesomeIcon icon={faUserMdChat} />
            <span>Expert Talks</span>
          </button>
          <button
            type="button"
            className={type === STREAMS && style.active}
            onClick={onChangeHandler(STREAMS)}
            // this button will not be displayed until API has streams support
            style={{ display: 'none' }}
          >
            <FontAwesomeIcon icon={faVideo} />
            <span>Streams</span>
          </button>
        </div>

        {loading && page === 1 && <Loader fill />}

        {(!loading || page > 1) && album.list.length > 0 && (
          <div className={style.section}>
            <div className={classnames(style.mediaWrapper)}>
              {
                album.list.map(({
                  _id,
                  url,
                  disabled,
                  rawURL,
                  comments,
                  usersLike,
                  previewURL,
                }) => (
                  <MediaContent
                    key={_id}
                    id={_id}
                    image={url ?? previewURL}
                    disabled={disabled}
                    accessControlButtonHandler={openConfirmActionModal}
                    type={type}
                    rawURL={rawURL}
                    comments={comments}
                    usersLike={usersLike}
                  />
                ))
              }
            </div>
          </div>
        )}

        {album.total > album.list.length && (
          <button className={style.loadMore} type="button" onClick={fetchMore}>
            {!loading && 'Load More'}
            {loading && (<FontAwesomeIcon icon={faSpinner} spin size="2x" />)}
          </button>
        )}
      </div>
      {actionModalState.show && (
        <ConfirmModal
          action={actionModalState.action}
          onClose={cancelConfirmActionModal}
          onConfirm={confirmActionHandler}
        />
      )}
      {errorModalState.show && (
        <ErrorModal
          text={errorModalState.text}
          onClose={closeErrorModalHandler}
        />
      )}

    </>
  );
};

export default connect(({
  habitat: {
    album,
    habitatInfo: {
      _id: habitatId,
      zoo: { name: zooName } = {},
    },
  },
}) => ({
  habitatId,
  album,
  zooName,
}),
{
  setAlbumDataAction: setAlbumData,
  appendAlbumDataAction: appendAlbumData,
  changeContentVisibilityAction: changeContentVisibility,
})(Album);

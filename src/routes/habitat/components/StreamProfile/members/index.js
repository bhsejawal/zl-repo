import { h } from 'preact';
import { connect } from 'react-redux';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'preact/hooks';

import List from 'Components/List';
import Loader from 'Components/async/Loader';
import Member from './member';

import { formatAge } from '../../../../../helpers';
import { useIsInitiallyLoaded } from '../../../../../hooks';

import style from './style.scss';

const Members = ({ loading, familyCards }) => {
  const listRef = useRef();
  const loadedImagesRef = useRef(0);
  const initiallyLoaded = useIsInitiallyLoaded(loading);
  const [loaded, setLoaded] = useState(false);

  const onImgLoad = useCallback(() => {
    loadedImagesRef.current += 1;
    if (loadedImagesRef.current === familyCards.length) {
      listRef.current.updateLayout();
    }
  }, [familyCards]);

  useEffect(() => {
    if (initiallyLoaded) {
      setLoaded(true);
    }
  }, [initiallyLoaded]);

  if (!loaded) {
    return (
      <div className={style.loadingWrapper}>
        <Loader />
      </div>
    );
  }

  return (
    <List ref={listRef}>
      {familyCards.map(({
        name,
        dateOfBirth,
        img,
      }, ind) => (
        <Member
          key={`${img}-${name}-${dateOfBirth}`}
          index={ind}
          name={name}
          age={formatAge(dateOfBirth)}
          profileImg={img}
          onLoad={onImgLoad}
        />
      ))}
    </List>
  );
};

export default connect(({
  habitat: {
    cards: {
      loading,
      familyCards,
    },
  },
}) => ({
  loading,
  familyCards,
}))(Members);

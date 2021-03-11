import { h } from 'preact';
import { connect } from 'react-redux';
import { formatDistanceToNow, parseISO } from 'date-fns';

import { useCallback, useRef } from 'preact/hooks';
import List from 'Components/List';
import Member from './member';

const Members = ({ familyCards }) => {
  const listRef = useRef();
  const loadedImagesRef = useRef(0);

  const onImgLoad = useCallback(() => {
    loadedImagesRef.current += 1;
    if (loadedImagesRef.current === familyCards.length) {
      listRef.current.updateLayout();
    }
  }, [familyCards]);

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
          age={formatDistanceToNow(parseISO(dateOfBirth))}
          profileImg={img}
          onLoad={onImgLoad}
        />
      ))}
    </List>
  );
};

export default connect(({ habitat: { cards: { familyCards } } }) => ({ familyCards }))(Members);

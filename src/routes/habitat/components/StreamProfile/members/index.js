import { h } from 'preact';
import { useCallback, useRef } from 'preact/hooks';

import Member from './member';
import List from '../../../../../components/List';

const Members = ({ members = [] }) => {
  const listRef = useRef();
  const loadedImagesRef = useRef(0);

  const onImgLoad = useCallback(() => {
    loadedImagesRef.current += 1;
    if (loadedImagesRef.current === members.length) {
      listRef.current.updateLayout();
    }
  }, [members]);

  return (
    <List ref={listRef}>
      {members.map(({ name, age, profileImg }, ind) => (
        <Member
          key={`${name}-${age}-${profileImg}`}
          index={ind}
          name={name}
          age={age}
          profileImg={profileImg}
          onLoad={onImgLoad}
        />
      ))}
    </List>
  )
};

export default Members;

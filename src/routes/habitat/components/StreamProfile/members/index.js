import { h } from 'preact';
import { useCallback, useRef } from 'preact/hooks';
import { connect } from 'react-redux';

import List from 'Components/List';
import Member from './member';

const Members = ({ familyMembers = [] }) => {
  const listRef = useRef();
  const loadedImagesRef = useRef(0);

  const onImgLoad = useCallback(() => {
    loadedImagesRef.current += 1;
    if (loadedImagesRef.current === familyMembers.length) {
      listRef.current.updateLayout();
    }
  }, [familyMembers]);

  return (
    <List ref={listRef}>
      {familyMembers.map(({
        _id,
        name,
        age,
        profileImg,
      }, ind) => (
        <Member
          key={_id}
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

export default connect(
  ({ habitat: { habitatInfo: { familyMembers } } }) => ({ familyMembers }),
)(Members);

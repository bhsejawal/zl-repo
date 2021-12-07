import { h } from 'preact';
import { useCallback } from 'preact/hooks';

import TagInput from 'Components/TagInput';

import style from './style.scss';

const HabitatTags = ({ habitatTags, setHabitatTags }) => {
  const removeTag = useCallback(
    ({index}) => {
      habitatTags.splice(index, 1);
      setHabitatTags([...habitatTags]);
    },
    [habitatTags, setHabitatTags],
  );

  const addTag = useCallback(
    (tag) => setHabitatTags([...habitatTags, tag]),
    [habitatTags, setHabitatTags],
  )

  return (
    <TagInput
      label="Habitat Tags"
      name="tags"
      labelClassName={style.title}
      tagClassName={style.tag}
      value={habitatTags}
      onAdd={addTag}
      onRemove={removeTag}
    />
  );
};

export default HabitatTags;

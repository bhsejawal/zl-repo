import { connect } from 'react-redux';
import { Heading } from 'grommet';

import TextEditor from 'Components/AdminEditWrappers/TextEditor';

import { setHabitatLiked } from '../../../actions';
import ProfileImage from './ProfileImage';

import style from './style.scss';

const Info = ({
  habitatId,
  title,
  zooLogo,
}) => (
  <div className={style.info}>
    <ProfileImage />
    <div className={style.detailsWrapper}>
      <TextEditor
        postToUrl={`/admin/habitats/${habitatId}/prop`}
        textProp="title"
        minLen={3}
        maxLen={20}
        initialText={title}
      >
        {(text) => <Heading level="3" className={style.name}>{text}</Heading>}
      </TextEditor>

      <div className={style.zooNameWrapper}>
        <img src={zooLogo} alt="logo" />
      </div>
    </div>
  </div>
);

export default connect(
  ({
    habitat: {
      habitatInfo: {
        _id: habitatId,
        title,
        profileImage,
        isLiked,
        zoo: { logo: zooLogo, slug: zooSlug } = {},
        trailer,
      },
    },
  }) => ({
    habitatId,
    title,
    profileImage,
    zooLogo,
    zooSlug,
    isLiked,
    trailer,
  }),
  { setLikedAction: setHabitatLiked },
)(Info);

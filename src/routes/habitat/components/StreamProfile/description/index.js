import { h } from 'preact';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import TextEditor from 'Components/AdminEditWrappers/TextEditor';
import Members from './Members';

import style from './style.scss';

const Description = ({ habitatId, conservationText = '' }) => (
  <div className={style.desc}>
    <div className={style.wrapper}>
      <FontAwesomeIcon icon={faInfoCircle} size="2x" color="var(--hunterGreen)" />
      <TextEditor
        postToUrl={`/admin/habitats/${habitatId}/prop`}
        textProp="conservationText"
        initialText={conservationText}
        minLen={50}
        maxLen={130}
      >
        {(text) => <p className={style.text}>{text}</p>}
      </TextEditor>
    </div>
    <Members />
  </div>
);

export default connect(
  ({
    habitat: {
      habitatInfo: {
        _id: habitatId,
        conservationText,
      },
    },
  }) => ({
    habitatId,
    conservationText,
  }),
)(Description);

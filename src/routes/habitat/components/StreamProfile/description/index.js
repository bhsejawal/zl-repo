import { h } from 'preact';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldCheck } from '@fortawesome/pro-light-svg-icons';

import TextEditor from 'Components/AdminEditWrappers/TextEditor';

import style from './style.scss';

const Description = ({ habitatId, conservationText = '' }) => (
  <div className={style.desc}>
    <FontAwesomeIcon icon={faShieldCheck} size="2x" color="var(--hunterGreen)" />
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

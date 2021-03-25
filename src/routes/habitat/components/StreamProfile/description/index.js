import { h } from 'preact';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldCheck } from '@fortawesome/pro-light-svg-icons';

import TextEditor from 'Components/AdminEditWrappers/TextEditor';

import style from './style.scss';

const Description = ({ habitatId, description = '' }) => (
  <div className={style.desc}>
    <FontAwesomeIcon icon={faShieldCheck} size="2x" color="var(--turquoiseLight)" />
    <TextEditor
      postToUrl={`/admin/habitats/${habitatId}/prop`}
      textProp="description"
      initialText={description}
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
        description,
      },
    },
  }) => ({
    habitatId,
    description,
  }),
)(Description);

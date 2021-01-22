import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldCheck } from '@fortawesome/pro-light-svg-icons';

import style from './style.scss';
import TextEditor from '../../../../../components/AdminEditWrappers/TextEditor';

const Description = ({ text: descriptionText }) => (
  <div className={style.desc}>
    <FontAwesomeIcon icon={faShieldCheck} size="2x" color="var(--turquoiseLight)" />
    <TextEditor
      textProp="description"
      initialText={descriptionText}
      minLen={50}
      maxLen={130}
    >
      {(text) => <p className={style.text}>{text}</p>}
    </TextEditor>
  </div>
);

export default Description;

import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/pro-solid-svg-icons';

import style from './style.scss';

const EditButton = ({ onClick, style: inlineStyle }) => (
  <button
    type="button"
    style={inlineStyle}
    className={style.editBtn}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={faEdit} />
  </button>
);

export default EditButton;

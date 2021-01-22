import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/pro-solid-svg-icons';

import style from './style.scss';

const EditButton = ({ onClick }) => (
  <button
    type="button"
    className={style.editBtn}
    onClick={onClick}
  >
    <FontAwesomeIcon icon={faEdit} />
  </button>
);

export default EditButton;

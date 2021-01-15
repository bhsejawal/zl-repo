import { h } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-solid-svg-icons';
import { Layer } from 'grommet';

import style from './style.scss';

const FallbackLoader = () => (
  <Layer className={style.wrapper}>
    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
  </Layer>
);

export default FallbackLoader;

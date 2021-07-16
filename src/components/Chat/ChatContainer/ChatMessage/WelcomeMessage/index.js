import classnames from 'classnames';
import { Text } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import style from './style.module.scss';

const WelcomeMessage = ({ onClose }) => (
  <div className={style.welcomeMessageWrapper}>
    <div className={style.closeButton} onClick={onClose}>
      <FontAwesomeIcon icon={faTimes} />
    </div>
    <div className={classnames(style.welcomeMessage)}>
      <div>
        <Text size="small" weight={700}>
          <span className={style.waveEmote}>👋 </span>
          Hey animal lover! Welcome to Zoolife.
        </Text>
      </div>
      <div className={style.messageContainer}>
        <Text size="large">
          Introduce yourself in the chat below.
        </Text>
        <br />
        <Text size="large">
          Tell us where you’re from!
        </Text>
      </div>
    </div>
  </div>
);

export default WelcomeMessage;

import { Text } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/pro-solid-svg-icons';
import RoundButton from 'Components/RoundButton';
import { useRef, useState, useEffect } from 'preact/hooks';

import style from './style.scss';

const ContentExplorer = () => {
  const [showContentExplorer, setShowContentExplorer] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setInterval(
      () => setShowContentExplorer(true),
      90000,
    );
    return () => clearInterval(timeoutRef.current);
  }, []);

  if (!showContentExplorer) {
    return null;
  }

  return (
    // eslint-disable-next-line
    <div
      className={style.contentExplorer}
      onClick={() => document.getElementById('cardsSection').scrollIntoView({ behavior: 'smooth' })}
    >
      <div>
        <Text size="xlarge">
          Learn more about the species below
        </Text>
      </div>
      <div>
        <RoundButton
          className={style.actionButton}
          width="32"
          color="var(--blueDark)"
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </RoundButton>
      </div>
    </div>
  );
};

export default ContentExplorer;

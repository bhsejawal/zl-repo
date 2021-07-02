import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from '@fortawesome/pro-solid-svg-icons';
import { useState } from 'preact/hooks';

import RoundButton from 'Components/RoundButton';
import TrimVideoModal from './TrimVideoModal';

import style from './style.scss';

const RecordVideoButton = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div>
        <RoundButton
          onClick={() => setShowModal(true)}
          width="36"
          backgroundColor="var(--blueDark)"
          color="white"
          className={style.button}
        >
          <FontAwesomeIcon icon={faVideo} />
        </RoundButton>
      </div>
      {showModal && <TrimVideoModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default RecordVideoButton;

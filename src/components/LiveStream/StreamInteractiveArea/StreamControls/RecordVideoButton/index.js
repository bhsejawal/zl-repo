import { connect } from 'react-redux'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from '@fortawesome/pro-solid-svg-icons';
import { useState } from 'preact/hooks';
import classnames from 'classnames';
import { Button, Tip, Box } from 'grommet';

import RoundButton from 'Components/RoundButton';
import TipContent from 'Components/Tooltip';
import TrimVideoModal from './TrimVideoModal';
import { setClipButtonClicked } from '../../../../../redux/actions'

import style from './style.scss';

const RecordVideoButton = ({ isClicked, setClipButtonClickedAction, plain }) => {
  const [showModal, setShowModal] = useState(false);

  const onClickHandler = () => {
    setShowModal(true);
    setClipButtonClickedAction(true);
  };

  if (plain) {
    return (
      <>
        <Button
          plain
          onClick={onClickHandler}
          className={style.mobileButton}
        >
          <FontAwesomeIcon color="#fff" size="lg" icon={faVideo} />
        </Button>
        {showModal && <TrimVideoModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return (
    <>
      <Tip
        dropProps={{ align: { left: 'right' } }}
        content={<TipContent message="Take a Clip" />}
        plain
      >
        <Box>
          <RoundButton
            onClick={onClickHandler}
            width="36"
            backgroundColor="var(--blueDark)"
            color="white"
            className={classnames(style.button, { [style.animate]: !isClicked })}
          >
            <FontAwesomeIcon icon={faVideo} />
          </RoundButton>
        </Box>
      </Tip>
      {showModal && <TrimVideoModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default connect(({
  user: { clipButtonClicked: isClicked },
}) => ({ isClicked }), {
  setClipButtonClickedAction: setClipButtonClicked,
})(RecordVideoButton);

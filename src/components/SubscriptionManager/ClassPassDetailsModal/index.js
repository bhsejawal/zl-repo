import { Layer, Box, Button } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import { useIsMobileSize } from '../../../hooks';

import desktopImage from './desktop.jpg';
import mobileImage from './mobile.jpg';

import style from './style.scss';

const ClassPassDetailsModal = ({ onClose }) => {
  const isMobileSize = useIsMobileSize();
  return (
    <Layer
      position="center"
      onClickOutside={onClose}
      onEsc={onClose}
      background="transparent"
      animation="fadeIn"
    >
      <Box
        style={{ position: 'relative' }}
        height={{ max: '90vh' }}
        justify="center"
        align="center"
        className={style.modalWrapper}
      >
        <Button
          plain
          onClick={onClose}
          icon={<FontAwesomeIcon size="2x" icon={faTimes} />}
          className={style.closeButton}
        />
        <div>
          <img src={isMobileSize ? mobileImage : desktopImage} alt="class pass details" />
        </div>
      </Box>
    </Layer>
  );
}
export default ClassPassDetailsModal;

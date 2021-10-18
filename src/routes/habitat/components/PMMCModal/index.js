import {
  Layer,
  Heading,
  Text,
  Box,
} from 'grommet';

import { PrimaryButton } from 'Components/Buttons';
import CloseButton from 'Components/modals/CloseButton';

import pmmc from './pmmc.jpg';

import style from './style.scss';

const PMMCModal = ({ onClose }) => (
  <Layer className={style.layer} onEsc={onClose} onClickOutside={onClose}>
    <div className={style.container}>
      <div className={style.header}>
        <img src={pmmc} alt="marine mammals" />
        <CloseButton varient="grey" onClick={onClose} className={style.closeBtn} />
      </div>
      <Box className={style.contentWrapper}>
        <Heading level="3" textAlign="center" color="var(--charcoal)">
          Exciting news!
          <br />
          Our rescues have been released back in the wild.
        </Heading>
        <Text size="large" textAlign="center" color="var(--charcoalLight)">
          {/* eslint-disable-next-line max-len */}
          After a successful rescue season, PMMC only has a few patients left in their care.
        </Text>
        <Text size="large" textAlign="center" color="var(--charcoalLight)" margin={{ top: 'medium' }}>
          {/* eslint-disable-next-line max-len */}
          Tune in to see their newest rescues when stranding season resumes in late winter/early spring.
          <br />
          {/* eslint-disable-next-line max-len */}
          Continue exploring to learn more about PMMC’s ocean and marine mammal conservation mission.
        </Text>
      </Box>
      <Box margin={{ vertical: '30px' }} pad={{ horizontal: '120px' }} align="center">
        <PrimaryButton
          size="large"
          label="Continue"
          onClick={onClose}
        />
      </Box>
    </div>
  </Layer>
)

export default PMMCModal;

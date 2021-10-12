import {
  Layer,
  Heading,
  Text,
  Box,
} from 'grommet';

import { PrimaryButton } from 'Components/Buttons';

import pmmc from './pmmc.jpg';

import style from './style.scss';

const PMMCModal = ({ onClose }) => (
  <Layer onEsc={onClose} onClickOutside={onClose}>
    <div className={style.container}>
      <div className={style.header}>
        <img src={pmmc} alt="marine mammals" />
      </div>
      <Box className={style.contentWrapper}>
        <Heading level="3" textAlign="center" color="var(--charcoal)">
          Hooray! This season’s patients have been released.
        </Heading>
        <Text size="xlarge" textAlign="center" color="var(--charcoalLight)">
          {/* eslint-disable-next-line max-len */}
          PMMC specializes in rescuing and rehabilitating marine mammals so that they can be released back into the wild.
        </Text>
        <Text size="xlarge" textAlign="center" color="var(--charcoalLight)" margin={{ top: 'medium' }}>
          {/* eslint-disable-next-line max-len */}
          The pool will be empty until a new group of patients enter PMMC’s care.
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

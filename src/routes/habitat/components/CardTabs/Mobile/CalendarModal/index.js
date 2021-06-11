import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { connect } from 'react-redux';
import { Layer, Box, Button } from 'grommet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import CalendarLoader from '../../Calendar/CalendarLoader';
import { closeModalCalendar } from '../actions';

import style from './style.scss';

const CalendarModal = ({ closeAction }) => {
  const closeButton = useMemo(() => (
    <Box className={style.controls}>
      <Box
        direction="row"
        align="center"
        justify="end"
        as="header"
      >
        <Button
          plain
          margin="small"
          onClick={closeAction}
          icon={<FontAwesomeIcon size="lg" color="var(--charcoalLight)" icon={faTimes} />}
        />
      </Box>
    </Box>
  ), [closeAction]);

  return (
    <Layer onEsc={closeAction}>
      <Box width="max-content">
        {closeButton}
        <Box fill pad="small" overflow="auto">
          <CalendarLoader />
        </Box>
      </Box>
    </Layer>
  );
};

export default connect(
  null,
  { closeAction: closeModalCalendar },
)(CalendarModal);

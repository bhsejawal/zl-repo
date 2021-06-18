import { h } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { connect } from 'react-redux';
import {
  Layer,
  Box,
  Button,
  Grommet,
} from 'grommet';
import { deepMerge } from 'grommet/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

import CalendarLoader from '../../Calendar/CalendarLoader';
import { closeModalCalendar } from '../actions';
import grommetTheme from '../../../../../../grommetTheme';

import style from './style.scss';

const fullLayerTheme = deepMerge(grommetTheme, {
  layer: {
    container: {
      extend: {
        maxWidth: 'auto',
        maxHeight: 'auto',
      },
    },
  },
});

const CalendarModal = ({ closeAction }) => {
  // close on unmount
  useEffect(() => () => {
    closeAction();
  }, [closeAction]);

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
    <Grommet theme={fullLayerTheme}>
      <Layer full onEsc={closeAction}>
        <Box fill>
          {closeButton}
          <Box fill pad="small" overflow="auto">
            <CalendarLoader />
          </Box>
        </Box>
      </Layer>
    </Grommet>
  );
};

export default connect(
  null,
  { closeAction: closeModalCalendar },
)(CalendarModal);

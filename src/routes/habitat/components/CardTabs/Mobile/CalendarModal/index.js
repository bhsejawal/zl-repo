import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { connect } from 'react-redux';
import { Layer, Box, Grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';
import CloseButton from 'Components/modals/CloseButton';
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

  return (
    <Grommet theme={fullLayerTheme}>
      <Layer full onEsc={closeAction}>
        <Box fill>
          <CloseButton onClick={closeAction} className={style.controls} />
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

import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { connect } from 'react-redux';
import { Layer, Box, Grommet } from 'grommet';
import { deepMerge } from 'grommet/utils';
import CloseButton from 'Components/modals/CloseButton';

import { closeModalQuestions } from '../actions';
import grommetTheme from '../../../../../../grommetTheme';
import Questions from '../../../Questions';

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

const QuestionsModal = ({ closeAction }) => {
  // close on unmount
  useEffect(() => () => {
    closeAction();
  }, [closeAction]);

  return (
    <Grommet theme={fullLayerTheme}>
      <Layer full onEsc={closeAction} background={{ color: '#F4F4F4' }}>
        <Box fill className={style.container}>
          <CloseButton onClick={closeAction} className={style.close} />
          <h4>Q&A</h4>
          <Box fill overflow="auto">
            <Questions />
          </Box>
        </Box>
      </Layer>
    </Grommet>
  );
};

export default connect(
  null,
  { closeAction: closeModalQuestions },
)(QuestionsModal);
